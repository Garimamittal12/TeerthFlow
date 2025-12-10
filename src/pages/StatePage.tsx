import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { CityCard } from "@/components/CityCard";
import { StateCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import {
    getStateById,
    getCitiesByState,
    type State,
    type City,
} from "@/data/mockData";

export default function StatePage() {
    const { stateId } = useParams<{ stateId: string }>();
    const [state, setState] = useState<State | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!stateId) return;

        setLoading(true);
        Promise.all([getStateById(stateId), getCitiesByState(stateId)]).then(
            ([stateData, cityData]) => {
                setState(stateData || null);
                setCities(cityData);
                setLoading(false);
            }
        );
    }, [stateId]);

    const filteredCities = useMemo(() => {
        if (!search) return cities;
        return cities.filter((city) =>
            city.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [cities, search]);

    if (!loading && !state) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-16">
                    <div className="text-center">
                        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                            State Not Found
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The state you're looking for doesn't exist.
                        </p>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative h-64 md:h-80 overflow-hidden">
                    {state && (
                        <>
                            <img
                                src={state.image}
                                alt={state.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 gradient-overlay" />
                            <div className="absolute inset-0 flex items-end">
                                <div className="container pb-8">
                                    <Breadcrumb
                                        items={[{ label: state.name }]}
                                    />
                                    <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                                        Cities in {state.name}
                                    </h1>
                                    <p className="text-primary-foreground/80 mt-2">
                                        {cities.length} cit{cities.length !== 1 ? "ies" : "y"} with pilgrimage sites
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* Search */}
                <section className="sticky top-16 z-40 bg-card/95 backdrop-blur-lg border-b border-border py-4">
                    <div className="container">
                        <div className="relative flex-1 max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search cities..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                aria-label="Search cities"
                            />
                        </div>
                    </div>
                </section>

                {/* Cities Grid */}
                <section className="py-8">
                    <div className="container">
                        {/* Results count */}
                        <p className="text-sm text-muted-foreground mb-6">
                            {filteredCities.length} cit{filteredCities.length !== 1 ? "ies" : "y"} found
                        </p>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <StateCardSkeleton />
                                <StateCardSkeleton />
                                <StateCardSkeleton />
                            </div>
                        ) : filteredCities.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                                    <Search className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                                    {search ? "No cities found" : "No cities available"}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {search 
                                        ? `We couldn't find any cities matching "${search}" in ${state?.name}. Try a different search term.`
                                        : `There are currently no cities with pilgrimage sites listed for ${state?.name}.`}
                                </p>
                                {search && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearch("")}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCities.map((city, index) => (
                                    <CityCard
                                        key={city.name}
                                        city={city}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
