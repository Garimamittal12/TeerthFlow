import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff, TrendingUp, Users, Clock, AlertTriangle, Play, Pause, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HistoricalChart } from "@/components/HistoricalChart";
import type { Temple, Device, CrowdData } from "@/data/mockData";
import { getCrowdLevel, CROWD_THRESHOLDS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

interface CrowdMonitorProps {
    temple: Temple;
    device?: Device;
    initialCrowd?: CrowdData;
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Extreme: "badge-crowd-extreme",
};

export function CrowdMonitor({ temple, device, initialCrowd }: CrowdMonitorProps) {
    const [crowd, setCrowd] = useState(initialCrowd);
    const [isSimulating, setIsSimulating] = useState(false);
    const [alerts, setAlerts] = useState<string[]>([]);
    const { permission, requestPermission, sendNotification, isSupported } = useNotifications();
    const { toast } = useToast();

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

    const updateCrowd = useCallback(() => {
        if (!crowd) return;

        const delta = Math.floor(Math.random() * 21) - 8; // -8 to +12
        const newCount = Math.max(0, crowd.currentCount + delta);
        const newLevel = getCrowdLevel(newCount);

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

        if (newLevel === "Extreme" && crowd.crowdLevel !== "Extreme") {
            const alertMsg = "Crowd level has reached EXTREME! Consider visiting later.";
            newAlerts.push(alertMsg);

            // Send push notification
            if (permission === "granted") {
                sendNotification(`🔴 ${temple.name} - Extreme Crowd`, {
                    body: "Crowd level is now EXTREME. We recommend visiting at a different time.",
                    tag: `extreme-${temple.id}`,
                });
            }
        }

        if (newLevel === "High" && crowd.crowdLevel !== "High" && crowd.crowdLevel !== "Extreme") {
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

    // Device disconnect alert
    useEffect(() => {
        if (device && !device.isConnected) {
            const alertMsg = "Device disconnected! Live data unavailable.";
            setAlerts(prev => {
                if (!prev.includes(alertMsg)) {
                    // Send push notification for device disconnect
                    if (permission === "granted") {
                        sendNotification(`📡 ${temple.name} - Device Offline`, {
                            body: "IoT device disconnected. Live crowd data is temporarily unavailable.",
                            tag: `offline-${device.id}`,
                        });
                    }
                    return [...prev, alertMsg];
                }
                return prev;
            });
        }
    }, [device, permission, sendNotification, temple.name]);

    const crowdLevel = crowd ? getCrowdLevel(crowd.currentCount) : "Low";
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
                        onClick={handleEnableNotifications}
                        className="bg-primary hover:bg-primary/90 text-sm px-3 py-1.5"
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

            {/* Device Status Card */}
            <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold">Device Status</h3>
                    <div className="flex items-center gap-2">
                        {/* Notification Status Indicator */}
                        {isSupported && (
                            <button
                                onClick={permission !== "granted" ? handleEnableNotifications : undefined}
                                className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    permission === "granted"
                                        ? "text-success bg-success/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                                )}
                                title={permission === "granted" ? "Notifications enabled" : "Enable notifications"}
                            >
                                {permission === "granted" ? (
                                    <Bell className="h-4 w-4" />
                                ) : (
                                    <BellOff className="h-4 w-4" />
                                )}
                            </button>
                        )}

                        {device?.isConnected ? (
                            <span className="badge-live">
                                <Wifi className="h-3.5 w-3.5" />
                                Connected
                            </span>
                        ) : (
                            <span className="badge-offline">
                                <WifiOff className="h-3.5 w-3.5" />
                                Offline
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Device ID</p>
                        <p className="font-mono text-sm">{device?.id ?? "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Last Ping</p>
                        <p className="text-sm">
                            {device?.lastPing
                                ? new Date(device.lastPing).toLocaleTimeString()
                                : "N/A"
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Signal</p>
                        <p className={cn(
                            "text-sm font-medium",
                            device?.signalStrength === "Excellent" && "text-success",
                            device?.signalStrength === "Good" && "text-success",
                            device?.signalStrength === "Fair" && "text-warning",
                            device?.signalStrength === "Poor" && "text-destructive",
                        )}>
                            {device?.signalStrength ?? "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="text-sm">{device?.isConnected ? "Online" : "Offline"}</p>
                    </div>
                </div>
            </div>

            {/* Current Stats Card */}
            <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold">Current Crowd</h3>

                    {/* Realtime Simulation Toggle */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Simulate</span>
                        <Switch
                            checked={isSimulating}
                            onCheckedChange={setIsSimulating}
                            aria-label="Toggle realtime simulation"
                        />
                        {isSimulating ? (
                            <Pause className="h-4 w-4 text-primary animate-pulse" />
                        ) : (
                            <Play className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
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
                    <HistoricalChart data={crowd.history} capacity={temple.totalCapacity} />
                </div>
            )}
        </div>
    );
}
