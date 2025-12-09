import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { TempleCard } from "@/components/TempleCard";
import { TempleCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getStateById,
    getTemplesByState,
    devices as initialDevices,
    crowdData as initialCrowdData,
    getCrowdLevel,
    type State,
    type Temple,
    type Device,
    type CrowdData,
} from "@/data/mockData";
import { cn } from "@/lib/utils";

const categories = ["All", "Shiva", "Vishnu", "Ganesha", "Lakshmi-Narayan"];
const crowdLevels = ["All", "Low", "Medium", "High", "Extreme"];

export default function StatePage() {
    const { stateId } = useParams<{ stateId: string }>();
    const [state, setState] = useState<State | null>(null);
    const [temples, setTemples] = useState<Temple[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [crowdLevelFilter, setCrowdLevelFilter] = useState("All");
    const [devices, setDevices] = useState<Device[]>(initialDevices);
    const [crowdData, setCrowdData] = useState<CrowdData[]>(initialCrowdData);

    useEffect(() => {
        if (!stateId) return;

        setLoading(true);
        Promise.all([getStateById(stateId), getTemplesByState(stateId)]).then(
            ([stateData, templeData]) => {
                setState(stateData || null);
                setTemples(templeData);
                setLoading(false);
            }
        );
    }, [stateId]);

    // Real-time crowd simulation
    const updateCrowdData = useCallback(() => {
        setCrowdData(prevCrowdData =>
            prevCrowdData.map(crowd => {
                const delta = Math.floor(Math.random() * 21) - 8; // -8 to +12
                const newCount = Math.max(0, crowd.currentCount + delta);
                const newLevel = getCrowdLevel(newCount);

                return {
                    ...crowd,
                    currentCount: newCount,
                    crowdLevel: newLevel,
                    lastUpdated: new Date().toISOString(),
                    history: [
                        ...crowd.history.slice(-23),
                        { time: new Date().toISOString(), count: newCount }
                    ],
                };
            })
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateCrowdData();
        }, Math.random() * 4000 + 3000); // 3-7 seconds

        return () => clearInterval(interval);
    }, [updateCrowdData]);

    const filteredTemples = useMemo(() => {
        return temples.filter((temple) => {
            // Search filter
            if (
                search &&
                !temple.name.toLowerCase().includes(search.toLowerCase()) &&
                !temple.city.toLowerCase().includes(search.toLowerCase())
            ) {
                return false;
            }

            // Category filter
            if (category !== "All" && temple.category !== category) {
                return false;
            }

            // Crowd level filter - compare case-insensitively
            if (crowdLevelFilter !== "All") {
                const templeCrowd = crowdData.find((c) => c.templeId === temple.id);
                if (!templeCrowd) return false;

                // Recalculate crowd level based on current count for real-time accuracy
                const currentLevel = getCrowdLevel(templeCrowd.currentCount);
                if (currentLevel.toLowerCase() !== crowdLevelFilter.toLowerCase()) {
                    return false;
                }
            }

            return true;
        });
    }, [temples, search, category, crowdLevelFilter, crowdData]);

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
                                        Temples in {state.name}
                                    </h1>
                                    <p className="text-primary-foreground/80 mt-2">
                                        {state.templeCount} sacred destinations to explore
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* Filters */}
                <section className="sticky top-16 z-40 bg-card/95 backdrop-blur-lg border-b border-border py-4">
                    <div className="container">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search temples by name or city..."
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    aria-label="Search temples"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full md:w-44 rounded-xl">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Crowd Level Filter */}
                            <Select value={crowdLevelFilter} onValueChange={setCrowdLevelFilter}>
                                <SelectTrigger className="w-full md:w-44 rounded-xl">
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Crowd Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {crowdLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level === "All" ? "All Levels" : level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {/* Temple Grid */}
                <section className="py-8">
                    <div className="container">
                        {/* Results count */}
                        <p className="text-sm text-muted-foreground mb-6">
                            {filteredTemples.length} temple{filteredTemples.length !== 1 && "s"} found
                        </p>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <TempleCardSkeleton />
                                <TempleCardSkeleton />
                                <TempleCardSkeleton />
                            </div>
                        ) : filteredTemples.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-lg text-muted-foreground mb-4">
                                    No temples match your filters
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch("");
                                        setCategory("All");
                                        setCrowdLevelFilter("All");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTemples.map((temple, index) => (
                                    <TempleCard
                                        key={temple.id}
                                        temple={temple}
                                        device={devices.find((d) => d.id === temple.deviceId)}
                                        crowd={crowdData.find((c) => c.templeId === temple.id)}
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
