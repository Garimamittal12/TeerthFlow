import { Lock, Unlock, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { temples, crowdData, getCrowdLevel } from "@/data/mockData";
import { templeLocations } from "@/data/itineraryData";
import type { ItineraryStop, RitualTiming } from "@/data/itineraryData";
import { useState } from "react";

interface ItineraryStopCardProps {
    stop: ItineraryStop;
    index: number;
    onToggleLock: (stopId: string) => void;
    onSelectRitual: (stopId: string, ritual: RitualTiming) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Critical: "badge-crowd-extreme", // Using same class for Critical
};

export function ItineraryStopCard({
    stop,
    index,
    onToggleLock,
    onSelectRitual,
    onDragStart,
    onDragEnd,
    isDragging,
}: ItineraryStopCardProps) {
    const [expanded, setExpanded] = useState(false);
    const temple = temples.find((t) => t.id === stop.templeId);
    const location = templeLocations.find((l) => l.templeId === stop.templeId);
    const crowd = crowdData.find((c) => c.templeId === stop.templeId);
    const crowdLevel = crowd && temple ? getCrowdLevel(crowd.currentCount, temple.totalCapacity) : "Low";

    if (!temple || !location) return null;

    return (
        <div className="grid grid-cols-[80px_auto] items-start gap-4 relative">
            <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-primary">{stop.arrivalTime}</span>
                <div className="w-3 h-3 rounded-full bg-primary mt-2 border-2 border-white shadow" />
            </div>

            <div
                className={cn(
                    "card-elevated p-4 transition-all",
                    stop.isLocked && "ring-2 ring-warning",
                    isDragging && "opacity-60"
                )}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg",
                            stop.isLocked
                                ? "bg-warning text-warning-foreground"
                                : "bg-primary text-primary-foreground"
                        )}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-display font-semibold text-foreground">{temple.name}</h4>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{temple.city}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(crowdBadgeClasses[crowdLevel])}>{crowdLevel}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleLock(stop.id)}
                            className={cn(stop.isLocked && "text-warning")}
                        >
                            {stop.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Time & Travel Info */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{stop.arrivalTime}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-medium">{stop.departureTime}</span>
                    </div>
                    {stop.travelTimeFromPrevious > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {stop.travelTimeFromPrevious} min travel • {stop.distance} km
                        </Badge>
                    )}
                </div>

                {/* Selected Ritual */}
                {stop.selectedRitual && (
                    <div className="mt-3 p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-medium">{stop.selectedRitual.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {stop.selectedRitual.startTime} - {stop.selectedRitual.endTime}
                                </span>
                            </div>
                            <Badge
                                variant={stop.selectedRitual.priority === "must-see" ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {stop.selectedRitual.priority}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Expand/Collapse */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 hover:bg-primary/20 hover:text-primary"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? (
                        <>
                            Hide Rituals <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                    ) : (
                        <>
                            View Rituals <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                    )}
                </Button>

                {/* Ritual Timings */}
                {expanded && (
                    <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Available Rituals</p>
                        {location.ritualTimings.map((ritual) => (
                            <button
                                key={ritual.name}
                                onClick={() => onSelectRitual(stop.id, ritual)}
                                className={cn(
                                    "w-full p-2 rounded-lg text-left transition-all border",
                                    stop.selectedRitual?.name === ritual.name
                                        ? "bg-primary/10 border-primary"
                                        : "bg-card border-border hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{ritual.name}</span>
                                    <Badge
                                        variant={ritual.priority === "must-see" ? "default" : "outline"}
                                        className="text-xs"
                                    >
                                        {ritual.priority}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {ritual.startTime} - {ritual.endTime} • {ritual.description}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
