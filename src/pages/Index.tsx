import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, Sparkles, Search, Calendar } from "lucide-react";
import { Header } from "@/components/Header";
import { StateCard } from "@/components/StateCard";
import { SearchSelect } from "@/components/SearchSelect";
import { StateCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { getStates, type State } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [allStatesSearch, setAllStatesSearch] = useState("");
    const [showAllStates, setShowAllStates] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getStates().then((data) => {
            setStates(data);
            setLoading(false);
        });
    }, []);

    const featuredStates = states.filter((s) => s.featured);
    const filteredAllStates = useMemo(
        () =>
            allStatesSearch
                ? states.filter((s) =>
                    s.name.toLowerCase().includes(allStatesSearch.toLowerCase())
                )
                : states,
        [states, allStatesSearch]
    );

    // Homepage should show 3 cards, skipping Gujarat; View All should include Gujarat
    const homepageStates = useMemo(
        () => filteredAllStates.filter((state) => state.id !== "gujarat").slice(0, 3),
        [filteredAllStates]
    );

    const visibleAllStates = useMemo(
        () => (showAllStates ? filteredAllStates : homepageStates),
        [filteredAllStates, homepageStates, showAllStates]
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-16 md:py-24">
                    <div className="absolute inset-0 -z-10 pattern-mandala">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/12 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron-light/5 rounded-full blur-3xl" />
                    </div>

                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-gold/15 text-primary text-sm font-medium mb-6 border border-primary/20">
                                <Sparkles className="h-4 w-4" />
                                <span>शुभ यात्रा — Your spiritual journey begins here</span>
                            </div>

                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                                Discover Sacred Pilgrimage Sites{" "}
                                <span className="text-gradient">Across India</span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                                Plan your pilgrimage with real-time crowd insights, Pilgrimage Site information,
                                and smart recommendations. Experience divine <span className="font-medium text-foreground">darshan</span> without the wait.
                            </p>

                            <div className="flex justify-center mb-8">
                                <SearchSelect states={states} placeholder="Search for a state..." />
                            </div>

                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{states.length} States</span>
                                </div>
                                <span className="text-gold">•</span>
                                <span>{states.reduce((sum, s) => sum + s.templeCount, 0)} Pilgrimage Sites</span>
                                <span className="text-gold">•</span>
                                <span>Live Crowd Data</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured States — public */}
                <section className="py-16 bg-muted/30">
                    <div className="container">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                                    Featured Destinations
                                </h2>
                                <p className="text-muted-foreground">
                                    Popular states with rich heritage
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                className="hidden md:flex items-center gap-2"
                                onClick={() => {
                                    const el = document.getElementById("all-states-section");
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                }}
                            >
                                View All
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? (
                                <>
                                    <StateCardSkeleton />
                                    <StateCardSkeleton />
                                    <StateCardSkeleton />
                                    <StateCardSkeleton />
                                </>
                            ) : (
                                featuredStates.map((state, index) => (
                                    <StateCard key={state.id} state={state} index={index} />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* All States — public */}
                <section id="all-states-section" className="py-16">
                    <div className="container">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                                    All States
                                </h2>
                                <p className="text-muted-foreground">
                                    Explore Pilgrimage Sites across every state
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                                <div className="w-full md:w-72">
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                                        Search state
                                    </label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-xl border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={allStatesSearch}
                                            onChange={(e) => {
                                                setAllStatesSearch(e.target.value);
                                                if (!showAllStates && e.target.value) {
                                                    setShowAllStates(true);
                                                }
                                            }}
                                            placeholder="Type a state name..."
                                            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                {filteredAllStates.length > 3 && !allStatesSearch && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAllStates(!showAllStates)}
                                    >
                                        {showAllStates ? "Show fewer" : "View all states"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <>
                                    <StateCardSkeleton />
                                    <StateCardSkeleton />
                                    <StateCardSkeleton />
                                </>
                            ) : filteredAllStates.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No states match your search.
                                </p>
                            ) : (
                                visibleAllStates.map((state, index) => (
                                    <StateCard key={state.id} state={state} index={index} />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA — personal features require sign-in */}
                <section className="py-20 gradient-hero relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-10 w-32 h-32 border-2 border-primary-foreground/30 rounded-full" />
                        <div className="absolute bottom-4 right-10 w-24 h-24 border-2 border-primary-foreground/30 rounded-full" />
                    </div>

                    <div className="container relative">
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="font-devanagari text-lg text-primary-foreground/90 mb-2">॥ शुभारंभ ॥</p>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                                {user ? "Begin Your Sacred Journey" : "Plan Your Personal Itinerary"}
                            </h2>
                            <p className="text-primary-foreground/85 mb-8 text-lg">
                                {user
                                    ? "Get real-time updates on pilgrimage sites crowds, plan your visit, and make the most of your pilgrimage experience."
                                    : "Sign in to build itineraries, swap visits, and save your pilgrimage plan to your account."}
                            </p>
                            <Button
                                size="xl"
                                variant="secondary"
                                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                onClick={() => navigate(user ? "/itinerary" : "/login")}
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                {user ? "Open Itinerary Planner" : "Sign In to Plan"}
                                <ChevronRight className="h-5 w-5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Index;
