import { Link } from "react-router-dom";
import { MapPin, Users, Wifi, WifiOff, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Temple, Device, CrowdData } from "@/data/mockData";
import { getCrowdLevel } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface TempleCardProps {
    temple: Temple;
    device?: Device;
    crowd?: CrowdData;
    index?: number;
}

const crowdBadgeClasses = {
    Low: "badge-crowd-low",
    Medium: "badge-crowd-medium",
    High: "badge-crowd-high",
    Critical: "badge-crowd-extreme", // Using same class for Critical
};

export function TempleCard({ temple, device, crowd, index = 0 }: TempleCardProps) {
    const crowdLevel = crowd ? getCrowdLevel(crowd.currentCount, temple.totalCapacity) : "Low";
    const capacityPercentage = crowd ? Math.round((crowd.currentCount / temple.totalCapacity) * 100) : 0;

    return (
        <Link
            to={`/temple/${temple.id}`}
            className="group card-interactive block animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            aria-label={`View details for ${temple.name}`}
        >
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={temple.images[0]}
                    alt={temple.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 gradient-overlay opacity-50" />

                {/* Device Status Badge */}
                <div className="absolute top-3 right-3">
                    {device?.isConnected ? (
                        <span className="badge-live">
                            <Wifi className="h-3.5 w-3.5" />
                            Live Data
                        </span>
                    ) : (
                        <span className="badge-offline">
                            <WifiOff className="h-3.5 w-3.5" />
                            Offline
                        </span>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-medium backdrop-blur-sm">
                        {temple.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
                    {temple.name}
                </h3>

                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{temple.city}</span>
                    <span className="text-border">•</span>
                    <span className="text-xs">Est. {temple.established}</span>
                </div>

                {/* Crowd Stats */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {crowd?.currentCount ?? 0}
                            <span className="text-muted-foreground"> / {temple.totalCapacity}</span>
                        </span>
                    </div>

                    <span className={cn(crowdBadgeClasses[crowdLevel])}>
                        {crowdLevel}
                    </span>
                </div>


                {/* Capacity Bar */}
                <div className="mb-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                capacityPercentage > 80 ? "bg-destructive" :
                                    capacityPercentage > 50 ? "bg-warning" :
                                        "bg-success"
                            )}
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                            role="progressbar"
                            aria-valuenow={capacityPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Capacity at ${capacityPercentage}%`}
                        />
                    </div>
                </div>

                <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    tabIndex={-1}
                >
                    Start Exploring
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </Link>
    );
}
