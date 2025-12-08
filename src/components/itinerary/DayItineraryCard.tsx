import { Calendar, Clock, Route } from "lucide-react";
import { format } from "date-fns";
import { ItineraryStopCard } from "./ItinerarystopCard.tsx";
import type { DayItinerary, RitualTiming } from "@/data/itineraryData";

interface DayItineraryCardProps {
    dayItinerary: DayItinerary;
    onToggleLock: (stopId: string) => void;
    onSwap: (stopId: string) => void;
    onSelectRitual: (stopId: string, ritual: RitualTiming) => void;
}

export function DayItineraryCard({
    dayItinerary,
    onToggleLock,
    onSwap,
    onSelectRitual,
}: DayItineraryCardProps) {
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
            <div className="space-y-3 relative">
                {/* Connection line */}
                <div className="absolute left-[1.2rem] top-8 bottom-8 w-0.5 bg-border" />

                {dayItinerary.stops.map((stop, index) => (
                    <ItineraryStopCard
                        key={stop.id}
                        stop={stop}
                        index={index}
                        onToggleLock={onToggleLock}
                        onSwap={onSwap}
                        onSelectRitual={onSelectRitual}
                    />
                ))}
            </div>
        </div>
    );
}
