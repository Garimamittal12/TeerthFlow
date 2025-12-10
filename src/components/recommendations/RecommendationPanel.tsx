import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Clock, Users, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlternativeCard } from "./AlternativeCard";
import { cn } from "@/lib/utils";
import { temples, crowdData, getCrowdLevel } from "@/data/mockData";
import {
    templeLocations,
    calculateDistance,
    estimateTravelTime,
    getExpectedWaitTime,
    getTempleLocation,
} from "@/data/itineraryData";
import type { AlternativeRecommendation, RitualTiming } from "@/data/itineraryData";
import { toast } from "sonner";

interface RecommendationPanelProps {
    selectedTempleId?: string;
    currentTime?: string; // HH:mm format
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Critical: "badge-crowd-extreme", // Using same class for Critical
};

export function RecommendationPanel({ selectedTempleId, currentTime = "10:00" }: RecommendationPanelProps) {
    const [recommendations, setRecommendations] = useState<AlternativeRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedTemple = useMemo(() => {
        if (!selectedTempleId) return null;
        return temples.find((t) => t.id === selectedTempleId);
    }, [selectedTempleId]);

    const selectedCrowd = useMemo(() => {
        if (!selectedTempleId) return null;
        return crowdData.find((c) => c.templeId === selectedTempleId);
    }, [selectedTempleId]);

    const selectedLocation = useMemo(() => {
        if (!selectedTempleId || !selectedTemple) return null;
        let location = templeLocations.find((l) => l.templeId === selectedTempleId);
        if (!location) {
            location = getTempleLocation(selectedTempleId, selectedTemple.city);
        }
        return location;
    }, [selectedTempleId, selectedTemple]);

    const crowdLevel = selectedCrowd && selectedTemple ? getCrowdLevel(selectedCrowd.currentCount, selectedTemple.totalCapacity) : "Low";
    // Always show recommendations for same city and nearby places with low-medium crowd
    const showRecommendations = true;

    // Check if a ritual is within a time window of current time
    const isRitualNearTime = (ritualTime: string, currentTimeStr: string): boolean => {
        const [ritualHour, ritualMin] = ritualTime.split(":").map(Number);
        const [currentHour, currentMin] = currentTimeStr.split(":").map(Number);
        const ritualMinutes = ritualHour * 60 + ritualMin;
        const currentMinutes = currentHour * 60 + currentMin;
        return Math.abs(ritualMinutes - currentMinutes) <= 120; // Within 2 hours
    };

    // Generate recommendations
    const generateRecommendations = () => {
        if (!selectedLocation || !selectedTemple) return;
        setIsLoading(true);

        setTimeout(() => {
            const alternatives: AlternativeRecommendation[] = [];

            temples.forEach((temple) => {
                if (temple.id === selectedTempleId) return;

                // Get location, generate if missing
                let location = templeLocations.find((l) => l.templeId === temple.id);
                if (!location) {
                    location = getTempleLocation(temple.id, temple.city);
                }
                const crowd = crowdData.find((c) => c.templeId === temple.id);

                if (!location || !crowd) return;

                const distance = calculateDistance(
                    selectedLocation.lat,
                    selectedLocation.lng,
                    location.lat,
                    location.lng
                );
                const travelTime = estimateTravelTime(distance);
                const templeCrowdLevel = getCrowdLevel(crowd.currentCount, temple.totalCapacity);
                const expectedWaitTime = getExpectedWaitTime(templeCrowdLevel);

                // Only include low to medium crowd levels
                if (templeCrowdLevel !== "Low" && templeCrowdLevel !== "Medium") {
                    return;
                }

                // Check if same city or nearby (within 50km)
                const isSameCity = temple.city.toLowerCase() === selectedTemple.city.toLowerCase();
                const isNearby = distance <= 50; // Within 50km

                // Only include same city or nearby places
                if (!isSameCity && !isNearby) {
                    return;
                }

                // Find matching rituals near current time
                const matchingRituals = location.ritualTimings.filter((ritual) =>
                    isRitualNearTime(ritual.startTime, currentTime)
                );

                // Calculate score (lower is better)
                let score = 0;
                score += distance * 2; // Proximity weight
                // Prioritize same city
                if (isSameCity) {
                    score -= 50; // Big bonus for same city
                }
                // Prioritize low crowd over medium
                score += templeCrowdLevel === "Low" ? -30 : -10;
                score -= matchingRituals.length * 15; // Ritual match bonus
                score += expectedWaitTime * 0.5;

                alternatives.push({
                    templeId: temple.id,
                    templeName: temple.name,
                    city: temple.city,
                    distance,
                    travelTime,
                    crowdLevel: templeCrowdLevel,
                    currentCount: crowd.currentCount,
                    expectedWaitTime,
                    ritualMatch: matchingRituals.length > 0,
                    matchingRituals,
                    score,
                    hasPriorityAccess: Math.random() > 0.5, // Simulated
                });
            });

            // Sort by score (lower is better) - already filtered to low/medium crowd
            const filtered = alternatives
                .sort((a, b) => a.score - b.score)
                .slice(0, 5);

            setRecommendations(filtered);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        if (selectedTempleId && selectedTemple && selectedLocation) {
            generateRecommendations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTempleId, currentTime]);

    const handleReschedule = (templeId: string) => {
        const temple = temples.find((t) => t.id === templeId);
        toast.success(`${temple?.name} rescheduled to next best window`);
    };

    const handleSwap = (templeId: string) => {
        const temple = temples.find((t) => t.id === templeId);
        toast.success(`${temple?.name} swapped into current day`);
    };

    const handleAddEvening = (templeId: string) => {
        const temple = temples.find((t) => t.id === templeId);
        toast.success(`${temple?.name} added as evening visit`);
    };

    const handleBookPriority = (templeId: string) => {
        const temple = temples.find((t) => t.id === templeId);
        toast.success(`Priority access booked for ${temple?.name}`);
    };

    if (!selectedTempleId || !selectedTemple) {
        return (
            <div className="h-full flex items-center justify-center text-center p-6">
                <div>
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">Select a Temple</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose a temple from the dashboard to see crowd-based recommendations
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            {/* Cause Section */}
            <div className={cn(
                "p-4 rounded-xl mb-4",
                crowdLevel === "Critical" ? "bg-destructive/10 border border-destructive/20" :
                    crowdLevel === "High" ? "bg-primary/10 border border-primary/20" :
                        "bg-muted"
            )}>
                <div className="flex items-start gap-3">
                    <AlertTriangle className={cn(
                        "h-5 w-5 mt-0.5",
                        crowdLevel === "Critical" ? "text-destructive" :
                            crowdLevel === "High" ? "text-primary" :
                                "text-muted-foreground"
                    )} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-display font-semibold">{selectedTemple.name}</h3>
                            <span className={cn(crowdBadgeClasses[crowdLevel])}>{crowdLevel}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">{selectedCrowd?.currentCount}</span>
                                    <span className="text-muted-foreground"> / {selectedTemple.totalCapacity}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <span className="font-medium">~{getExpectedWaitTime(crowdLevel)} min</span>
                                    <span className="text-muted-foreground"> wait</span>
                                </span>
                            </div>
                        </div>

                        {showRecommendations && (
                            <p className="text-sm text-muted-foreground mt-3">
                                {crowdLevel === "High" || crowdLevel === "Critical" 
                                    ? `Current crowd level is ${crowdLevel.toLowerCase()}. Consider these alternatives for a better experience.`
                                    : "Here are nearby places in the same city with low to medium crowd levels."}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {showRecommendations && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-success" />
                            <h3 className="font-display font-semibold">
                                {crowdLevel === "High" || crowdLevel === "Critical" 
                                    ? "Recommended Alternatives"
                                    : "Nearby Places to Visit"}
                            </h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={generateRecommendations}
                            disabled={isLoading}
                        >
                            <RefreshCw className={cn("h-4 w-4 mr-1.5", isLoading && "animate-spin")} />
                            Refresh
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="space-y-3">
                            {recommendations.map((rec, index) => (
                                <div key={rec.templeId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <AlternativeCard
                                        recommendation={rec}
                                        selectedCity={selectedTemple.city}
                                        onReschedule={handleReschedule}
                                        onSwap={handleSwap}
                                        onAddEvening={handleAddEvening}
                                        onBookPriority={handleBookPriority}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6 text-muted-foreground">
                            <p>No nearby places with low to medium crowd found in {selectedTemple.city}.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
