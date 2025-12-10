import { Clock, MapPin, Route, Users, Star, Ticket, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AlternativeRecommendation } from "@/data/itineraryData";

interface AlternativeCardProps {
    recommendation: AlternativeRecommendation;
    selectedCity?: string; // City of the selected temple
    onReschedule: (templeId: string) => void;
    onSwap: (templeId: string) => void;
    onAddEvening: (templeId: string) => void;
    onBookPriority: (templeId: string) => void;
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Critical: "badge-crowd-extreme", // Using same class for Critical
};

export function AlternativeCard({
    recommendation,
    selectedCity,
    onReschedule,
    onSwap,
    onAddEvening,
    onBookPriority,
}: AlternativeCardProps) {
    const isSameCity = selectedCity && recommendation.city.toLowerCase() === selectedCity.toLowerCase();
    const isNearby = recommendation.distance <= 50;
    
    return (
        <div className="card-elevated p-4 hover:shadow-lg transition-all">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-display font-semibold text-foreground">{recommendation.templeName}</h4>
                        {isSameCity && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                <MapPin className="h-3 w-3 mr-1" />
                                Same City
                            </Badge>
                        )}
                        {!isSameCity && isNearby && (
                            <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                                <Route className="h-3 w-3 mr-1" />
                                Nearby
                            </Badge>
                        )}
                        {recommendation.ritualMatch && (
                            <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                                <Star className="h-3 w-3 mr-1" />
                                Ritual Match
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{recommendation.city}</span>
                    </div>
                </div>
                <span className={cn(crowdBadgeClasses[recommendation.crowdLevel])}>
                    {recommendation.crowdLevel}
                </span>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="p-2 bg-muted rounded-lg text-center">
                    <Route className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium">{recommendation.distance} km</p>
                    <p className="text-xs text-muted-foreground">Distance</p>
                </div>
                <div className="p-2 bg-muted rounded-lg text-center">
                    <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium">{recommendation.travelTime} min</p>
                    <p className="text-xs text-muted-foreground">Travel</p>
                </div>
                <div className="p-2 bg-muted rounded-lg text-center">
                    <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium">{recommendation.expectedWaitTime} min</p>
                    <p className="text-xs text-muted-foreground">Wait Time</p>
                </div>
            </div>

            {/* Matching Rituals */}
            {recommendation.matchingRituals.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1.5">Matching Rituals:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {recommendation.matchingRituals.slice(0, 3).map((ritual) => (
                            <Badge key={ritual.name} variant="outline" className="text-xs">
                                {ritual.name} ({ritual.startTime})
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => onReschedule(recommendation.templeId)}>
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Reschedule
                </Button>
                <Button variant="outline" size="sm" onClick={() => onSwap(recommendation.templeId)}>
                    <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                    Swap Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => onAddEvening(recommendation.templeId)}>
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Evening Visit
                </Button>
                {recommendation.hasPriorityAccess && (
                    <Button variant="default" size="sm" onClick={() => onBookPriority(recommendation.templeId)}>
                        <Ticket className="h-3.5 w-3.5 mr-1.5" />
                        Priority Pass
                    </Button>
                )}
            </div>
        </div>
    );
}
