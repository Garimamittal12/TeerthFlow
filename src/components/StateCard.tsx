import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { State } from "@/data/mockData";

interface StateCardProps {
    state: State;
    index?: number;
}

export function StateCard({ state, index = 0 }: StateCardProps) {
    return (
        <Link
            to={`/state/${state.id}`}
            className="group card-interactive block animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            aria-label={`Explore temples in ${state.name}`}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={state.image}
                    alt={`${state.name} temples`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 gradient-overlay opacity-60" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl font-semibold text-primary-foreground mb-1">
                        {state.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-primary-foreground/80 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{state.templeCount} temples</span>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {state.description}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    tabIndex={-1}
                >
                    Explore Temples
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </Link>
    );
}
