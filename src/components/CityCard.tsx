import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { City } from "@/data/mockData";

interface CityCardProps {
    city: City;
    index?: number;
}

export function CityCard({ city, index = 0 }: CityCardProps) {
    return (
        <Link
            to={`/state/${city.stateId}/city/${encodeURIComponent(city.name)}`}
            className="group card-interactive block animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            aria-label={`Explore pilgrimage sites in ${city.name}`}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                {/* City Image */}
                <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/85 transition-all" />
                
                {/* City Name - Now more visible */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-gold transition-colors">
                        {city.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-gold" />
                        <span className="drop-shadow-md">{city.templeCount} pilgrimage site{city.templeCount !== 1 ? "s" : ""}</span>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-card">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    tabIndex={-1}
                >
                    Explore Sites
                    <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </Link>
    );
}

