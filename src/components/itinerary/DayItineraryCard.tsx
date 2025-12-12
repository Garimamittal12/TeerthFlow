import { Calendar, Clock, Route } from "lucide-react";
import { format } from "date-fns";
import { ItineraryStopCard } from "./ItinerarystopCard.tsx";
import type { DayItinerary, RitualTiming } from "@/data/itineraryData";

interface DayItineraryCardProps {
    dayItinerary: DayItinerary;
    dayIndex: number;
    onToggleLock: (stopId: string) => void;
    onSelectRitual: (stopId: string, ritual: RitualTiming) => void;
    onDragStart: (stopId: string, fromDayIndex: number) => void;
    onDrop: (dayIndex: number, targetIndex: number) => void;
    onDragEnd: () => void;
    dragging: { stopId: string; fromDayIndex: number } | null;
}

export function DayItineraryCard({
    dayItinerary,
    dayIndex,
    onToggleLock,
    onSelectRitual,
    onDragStart,
    onDrop,
    onDragEnd,
    dragging,
}: DayItineraryCardProps) {

    // Use stops directly - they're already correctly assigned to this day
    const stopsForDay = dayItinerary.stops;

    return (
        <div className="space-y-4">
            
            {/* Day Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg">
                        {dayItinerary.day}
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-lg">Day {dayItinerary.day}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(dayItinerary.date), "EEEE, MMMM d, yyyy")}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dayItinerary.totalTravelTime} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dayItinerary.totalDistance} km</span>
                    </div>
                </div>
            </div>

            {/* Stops */}
            <div className="relative space-y-2 pl-4">
                <div className="absolute left-10 top-4 bottom-4 w-0.5 bg-border" />

                {stopsForDay.length === 0 && (
                    <div className="p-4 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                        No temples assigned for this day yet.
                    </div>
                )}

                {stopsForDay.map((stop, index) => (
                    <div key={stop.id} className="space-y-2">
                        
                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                onDrop(dayIndex, index);
                            }}
                            className="h-4"
                        />

                        <ItineraryStopCard
                            stop={stop}
                            index={index}
                            onToggleLock={onToggleLock}
                            onSelectRitual={onSelectRitual}
                            onDragStart={() => onDragStart(stop.id, dayIndex)}
                            onDragEnd={onDragEnd}
                            isDragging={dragging?.stopId === stop.id}
                        />
                    </div>
                ))}

                {/* Drop zone at end */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        onDrop(dayIndex, stopsForDay.length);
                    }}
                    className="h-6"
                />
            </div>
        </div>
    );
}