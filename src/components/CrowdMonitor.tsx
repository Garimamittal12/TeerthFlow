import { useState, useEffect, useCallback, useMemo } from "react";
import { TrendingUp, Users, Clock, AlertTriangle, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoricalChart } from "@/components/HistoricalChart";
import type { Temple, Device, CrowdData } from "@/data/mockData";
import { getCrowdLevel } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useCrowdCount } from "@/hooks/useCrowdCount";

interface CrowdMonitorProps {
    temple: Temple;
    device?: Device;
    initialCrowd?: CrowdData;
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Critical: "badge-crowd-extreme", // Using same class for Critical
};

export function CrowdMonitor({ temple, device, initialCrowd }: CrowdMonitorProps) {
    const [crowd, setCrowd] = useState(initialCrowd);
    const [isSimulating, setIsSimulating] = useState(false);
    const [alerts, setAlerts] = useState<string[]>([]);
    const { permission, requestPermission, sendNotification, isSupported } = useNotifications();
    const { toast } = useToast();

    // Use API for temple_001
    const isTemple001 = temple.id === "temple_001";
    const { count: apiCount, isOnline: apiIsOnline, lastUpdated: apiLastUpdated, error: apiError } = useCrowdCount({
        apiUrl: "10.128.103.124/count",
        templeId: temple.id,
        enabled: isTemple001,
        pollInterval: 2000, // Poll every 2 seconds for real-time updates
    });

    // Create a device object with updated connection status for temple_001
    const updatedDevice = useMemo(() => {
        if (!device) return device;
        if (isTemple001) {
            return {
                ...device,
                isConnected: apiIsOnline,
                lastPing: apiLastUpdated || device.lastPing,
            };
        }
        return device;
    }, [device, isTemple001, apiIsOnline, apiLastUpdated]);

    // Calculate next hour prediction based on current count and historical trends
    const calculateNextHourPrediction = useCallback((currentCount: number, history: { time: string; count: number }[]): number => {
        if (history.length < 2) {
            // If we don't have enough history, use a simple growth estimate (5-15% increase)
            const growthRate = 0.6; // 10% average growth
            return Math.min(
                Math.round(currentCount * (1 + growthRate)),
                temple.totalCapacity
            );
        }

        // Calculate trend from recent history (last 6 data points or all if less)
        const recentHistory = history.slice(-6);
        if (recentHistory.length >= 2) {
            const oldest = recentHistory[0].count;
            const newest = recentHistory[recentHistory.length - 1].count;
            const timeDiff = new Date(recentHistory[recentHistory.length - 1].time).getTime() - 
                           new Date(recentHistory[0].time).getTime();
            
            // Calculate average change per hour
            const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours
            const changePerHour = hoursDiff > 0 ? (newest - oldest) / hoursDiff : 0;
            
            // Predict next hour: current + change per hour
            let prediction = currentCount + changePerHour;
            
            // Apply some smoothing and ensure reasonable bounds
            // If trend is very steep, cap it at 20% increase per hour
            const maxIncrease = currentCount * 0.2;
            if (changePerHour > maxIncrease) {
                prediction = currentCount + maxIncrease;
            }
            
            // If trend is decreasing, don't predict below 0
            if (prediction < 0) {
                prediction = Math.max(0, currentCount * 0.9); // At least 90% of current
            }
            
            // Cap at total capacity
            prediction = Math.min(Math.round(prediction), temple.totalCapacity);
            
            return prediction;
        }
        
        // Fallback: simple percentage increase
        return Math.min(
            Math.round(currentCount * 1.1),
            temple.totalCapacity
        );
    }, [temple.totalCapacity]);

    const handleEnableNotifications = async () => {
        const granted = await requestPermission();
        if (granted) {
            toast({
                title: "Notifications enabled",
                description: "You'll receive alerts when crowd levels change significantly.",
            });
        } else {
            toast({
                title: "Notifications blocked",
                description: "Please enable notifications in your browser settings.",
                variant: "destructive",
            });
        }
    };

    // Initialize crowd from initialCrowd if available and we don't have crowd data yet
    useEffect(() => {
        if (isTemple001 && !crowd && initialCrowd) {
            setCrowd(initialCrowd);
        }
    }, [isTemple001, initialCrowd, crowd]);

    // Update crowd data when API count changes for temple_001
    useEffect(() => {
        if (isTemple001 && apiCount !== null) {
            const newLevel = getCrowdLevel(apiCount, temple.totalCapacity);
            const now = apiLastUpdated || new Date().toISOString();
            
            if (crowd) {
                // Update history first
                const updatedHistory = [
                    ...crowd.history.slice(-23),
                    { time: now, count: apiCount }
                ];
                
                // Calculate next hour prediction based on current count and history
                const nextHourPred = calculateNextHourPrediction(apiCount, updatedHistory);
                
                // Update existing crowd data
                setCrowd({
                    ...crowd,
                    currentCount: apiCount,
                    crowdLevel: newLevel,
                    nextHourPrediction: nextHourPred,
                    lastUpdated: now,
                    history: updatedHistory,
                });
            } else {
                // Initialize crowd data if it doesn't exist
                const initialHistory = [{ time: now, count: apiCount }];
                const nextHourPred = calculateNextHourPrediction(apiCount, initialHistory);
                
                setCrowd({
                    templeId: temple.id,
                    currentCount: apiCount,
                    crowdLevel: newLevel,
                    nextHourPrediction: nextHourPred,
                    lastUpdated: now,
                    history: initialHistory,
                });
            }
        }
        // Note: When apiCount is null (device offline), we preserve the existing crowd data
        // The crowd state will maintain the last successfully fetched count
    }, [apiCount, apiLastUpdated, isTemple001, temple.totalCapacity, temple.id, crowd, calculateNextHourPrediction]);

    // Show API connection status alerts (only if we don't have previous data)
    useEffect(() => {
        if (isTemple001) {
            // Only show error alerts if we don't have any crowd data yet (first time failure)
            // If we have previous data, just show device offline status without error alerts
            if (apiError && !crowd) {
                setAlerts(prev => {
                    const alertMsg = `API connection error: ${apiError}`;
                    // Remove old API error and add new one
                    const filtered = prev.filter(alert => !alert.includes("API connection error"));
                    if (!filtered.includes(alertMsg)) {
                        return [...filtered, alertMsg];
                    }
                    return filtered;
                });
            } else if (apiIsOnline) {
                // Remove API error alerts when online
                setAlerts(prev => prev.filter(alert => !alert.includes("API connection error")));
            } else if (!apiIsOnline && crowd) {
                // Device is offline but we have previous data - remove error alerts
                // The "Device disconnected" alert will be handled by the device disconnect effect
                // This ensures users see the last fetched count even when offline
                setAlerts(prev => prev.filter(alert => !alert.includes("API connection error")));
            }
        }
    }, [apiError, apiIsOnline, isTemple001, crowd]);

    const updateCrowd = useCallback(() => {
        if (!crowd || isTemple001) return; // Don't simulate for temple_001 (use API instead)

        const delta = Math.floor(Math.random() * 21) - 8; // -8 to +12
        const newCount = Math.max(0, crowd.currentCount + delta);
        const newLevel = getCrowdLevel(newCount, temple.totalCapacity);

        // Check for alerts
        const newAlerts: string[] = [];

        if (newCount > temple.totalCapacity) {
            const alertMsg = `Temple capacity exceeded! (${newCount}/${temple.totalCapacity})`;
            newAlerts.push(alertMsg);

            // Send push notification
            if (permission === "granted") {
                sendNotification(`⚠️ ${temple.name} - Capacity Exceeded`, {
                    body: `Current visitors: ${newCount}/${temple.totalCapacity}. Consider visiting later.`,
                    tag: `capacity-${temple.id}`,
                });
            }
        }

        if (newLevel === "Critical" && crowd.crowdLevel !== "Critical") {
            const alertMsg = "Crowd level has reached CRITICAL! Consider visiting later.";
            newAlerts.push(alertMsg);

            // Send push notification
            if (permission === "granted") {
                sendNotification(`🔴 ${temple.name} - Critical Crowd`, {
                    body: "Crowd level is now CRITICAL. We recommend visiting at a different time.",
                    tag: `critical-${temple.id}`,
                });
            }
        }

        if (newLevel === "High" && crowd.crowdLevel !== "High" && crowd.crowdLevel !== "Critical") {
            const alertMsg = "Crowd level is now HIGH.";
            newAlerts.push(alertMsg);

            // Send push notification
            if (permission === "granted") {
                sendNotification(`🟠 ${temple.name} - High Crowd`, {
                    body: `Current count: ${newCount}. Plan your visit accordingly.`,
                    tag: `high-${temple.id}`,
                });
            }
        }

        setAlerts(newAlerts);

        setCrowd({
            ...crowd,
            currentCount: newCount,
            crowdLevel: newLevel,
            lastUpdated: new Date().toISOString(),
            history: [
                ...crowd.history.slice(-23),
                { time: new Date().toISOString(), count: newCount }
            ],
        });
    }, [crowd, temple.totalCapacity, temple.name, temple.id, permission, sendNotification]);

    useEffect(() => {
        if (!isSimulating) return;

        const interval = Math.random() * 4000 + 3000; // 3-7 seconds
        const timer = setTimeout(updateCrowd, interval);

        return () => clearTimeout(timer);
    }, [isSimulating, updateCrowd]);

    // Device disconnect alert (use updatedDevice for temple_001)
    // For temple_001, only show alert if we don't have previous data to display
    useEffect(() => {
        const deviceToCheck = updatedDevice || device;
        if (deviceToCheck && !deviceToCheck.isConnected) {
            // For temple_001, only show disconnect alert if we don't have previous data
            // If we have previous data, just show device offline status without alert
            if (isTemple001 && crowd) {
                // Don't show alert, just keep showing previous data
                return;
            }
            
            const alertMsg = "Device disconnected! Live data unavailable.";
            setAlerts(prev => {
                if (!prev.includes(alertMsg)) {
                    // Send push notification for device disconnect
                    if (permission === "granted") {
                        sendNotification(`📡 ${temple.name} - Device Offline`, {
                            body: "IoT device disconnected. Live crowd data is temporarily unavailable.",
                            tag: `offline-${deviceToCheck.id}`,
                        });
                    }
                    return [...prev, alertMsg];
                }
                return prev;
            });
        } else if (deviceToCheck && deviceToCheck.isConnected) {
            // Remove disconnect alert when device comes online (for all temples)
            setAlerts(prev => prev.filter(alert => alert !== "Device disconnected! Live data unavailable."));
        }
    }, [updatedDevice, device, permission, sendNotification, temple.name, isTemple001, crowd]);

    const crowdLevel = crowd ? getCrowdLevel(crowd.currentCount, temple.totalCapacity) : "Low";
    const capacityPercentage = crowd ? Math.round((crowd.currentCount / temple.totalCapacity) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Notifications Permission Banner */}
            {isSupported && permission === "default" && (
                <div className="flex items-center justify-between gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Enable Crowd Alerts</p>
                            <p className="text-xs text-muted-foreground">Get notified when crowd levels exceed thresholds</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleEnableNotifications}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Enable
                    </Button>
                </div>
            )}

            {/* Alerts Banner */}
            {alerts.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                    {alerts.map((alert, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl"
                            role="alert"
                        >
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                            <p className="text-sm font-medium text-destructive">{alert}</p>
                            <button
                                onClick={() => setAlerts(prev => prev.filter((_, i) => i !== index))}
                                className="ml-auto text-destructive hover:text-destructive/80"
                                aria-label="Dismiss alert"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {/* Current Stats Card */}
            <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold">Current Crowd</h3>
                    {isTemple001 && (
                        <div className="flex items-center gap-2">
                            {apiIsOnline ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                    Device Online
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                    <span className="w-2 h-2 bg-destructive rounded-full" />
                                    Device Offline
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{crowd?.currentCount ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Current Count</p>
                    </div>

                    <div className="text-center">
                        <div className="mb-2">
                            <span className={cn(crowdBadgeClasses[crowdLevel])}>
                                {crowdLevel}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Crowd Level</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{crowd?.nextHourPrediction ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Next Hour Prediction</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            {crowd?.lastUpdated
                                ? new Date(crowd.lastUpdated).toLocaleTimeString()
                                : "N/A"
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                    </div>
                </div>

                {/* Capacity Progress */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Capacity</span>
                        <span className="text-sm font-medium">
                            {crowd?.currentCount ?? 0} / {temple.totalCapacity} ({capacityPercentage}%)
                        </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                capacityPercentage > 100 ? "bg-destructive" :
                                    capacityPercentage > 80 ? "bg-warning" :
                                        capacityPercentage > 50 ? "bg-primary" :
                                            "bg-success"
                            )}
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                            role="progressbar"
                            aria-valuenow={capacityPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>
            </div>

            {/* Historical Chart */}
            {crowd && (
                <div className="card-elevated p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">24-Hour History</h3>
                    <HistoricalChart
                        data={crowd.history}
                        capacity={temple.totalCapacity}
                        isRealtime={true}
                    />
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        Chart updates automatically with real-time data from IoT sensors
                    </p>
                </div>
            )}
        </div>
    );
}
