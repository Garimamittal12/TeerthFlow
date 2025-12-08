import { useState, useCallback, useEffect } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar, MapPin, Clock, Route, Plus, Trash2, Sparkles, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ItineraryMap } from "@/components/itinerary/ItineraryMap";
import { DayItineraryCard } from "@/components/itinerary/DayItineraryCard";
import { RecommendationPanel } from "@/components/recommendations/RecommendationPanel";
import { temples } from "@/data/mockData";
import { majorCities, templeLocations, calculateDistance, estimateTravelTime } from "@/data/itineraryData";
import type { Itinerary, DayItinerary, ItineraryStop, RitualTiming } from "@/data/itineraryData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
export default function ItineraryPlanner() {
    const {
        user
    } = useAuth();
    const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), "yyyy-MM-dd"));
    const [startLocation, setStartLocation] = useState<string>("Delhi");
    const [selectedTemples, setSelectedTemples] = useState<string[]>([]);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [selectedTempleForRec, setSelectedTempleForRec] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState("planner");
    const startCity = majorCities.find(c => c.name === startLocation);
    const tripDays = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)) + 1);

    // Generate itinerary
    const generateItinerary = useCallback(() => {
        if (selectedTemples.length === 0) {
            toast.error("Please select at least one temple");
            return;
        }
        const days: DayItinerary[] = [];
        const templesPerDay = Math.ceil(selectedTemples.length / tripDays);
        let previousCoords = startCity ? {
            lat: startCity.lat,
            lng: startCity.lng
        } : {
            lat: 28.6139,
            lng: 77.209
        };
        for (let day = 1; day <= tripDays; day++) {
            const dayTemples = selectedTemples.slice((day - 1) * templesPerDay, day * templesPerDay);
            const stops: ItineraryStop[] = [];
            let totalTravelTime = 0;
            let totalDistance = 0;
            let currentTime = 6 * 60; // Start at 6:00 AM in minutes

            dayTemples.forEach(templeId => {
                const temple = temples.find(t => t.id === templeId);
                const location = templeLocations.find(l => l.templeId === templeId);
                if (!temple || !location) return;
                const distance = calculateDistance(previousCoords.lat, previousCoords.lng, location.lat, location.lng);
                const travelTime = estimateTravelTime(distance);
                currentTime += travelTime;
                const arrivalHour = Math.floor(currentTime / 60);
                const arrivalMin = currentTime % 60;
                const visitDuration = location.avgVisitDuration;
                currentTime += visitDuration;
                const departureHour = Math.floor(currentTime / 60);
                const departureMin = currentTime % 60;

                // Find a suitable ritual
                const suitableRitual = location.ritualTimings.find(r => {
                    const [rHour] = r.startTime.split(":").map(Number);
                    return rHour >= arrivalHour && rHour <= departureHour;
                });
                stops.push({
                    id: `stop_${day}_${templeId}`,
                    templeId,
                    templeName: temple.name,
                    day,
                    arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMin.toString().padStart(2, "0")}`,
                    departureTime: `${departureHour.toString().padStart(2, "0")}:${departureMin.toString().padStart(2, "0")}`,
                    selectedRitual: suitableRitual,
                    isLocked: false,
                    travelTimeFromPrevious: stops.length === 0 ? travelTime : travelTime,
                    distance
                });
                totalTravelTime += travelTime;
                totalDistance += distance;
                previousCoords = {
                    lat: location.lat,
                    lng: location.lng
                };
            });
            if (stops.length > 0) {
                days.push({
                    day,
                    date: format(addDays(new Date(startDate), day - 1), "yyyy-MM-dd"),
                    stops,
                    totalTravelTime,
                    totalDistance: Math.round(totalDistance * 10) / 10
                });
            }
        }
        const newItinerary: Itinerary = {
            id: `itin_${Date.now()}`,
            startDate,
            endDate,
            startLocation,
            startCoords: startCity ? {
                lat: startCity.lat,
                lng: startCity.lng
            } : {
                lat: 28.6139,
                lng: 77.209
            },
            days,
            createdAt: new Date().toISOString()
        };
        setItinerary(newItinerary);
        toast.success("Itinerary generated successfully!");
    }, [selectedTemples, tripDays, startDate, startCity, startLocation, endDate]);
    const toggleTempleSelection = (templeId: string) => {
        setSelectedTemples(prev => prev.includes(templeId) ? prev.filter(id => id !== templeId) : [...prev, templeId]);
    };
    const handleToggleLock = (stopId: string) => {
        if (!itinerary) return;
        setItinerary({
            ...itinerary,
            days: itinerary.days.map(day => ({
                ...day,
                stops: day.stops.map(stop => stop.id === stopId ? {
                    ...stop,
                    isLocked: !stop.isLocked
                } : stop)
            }))
        });
    };
    const handleSwap = (stopId: string) => {
        toast.info("Swap feature: Opens alternative temples panel");
        // Find the stop and set it for recommendations
        itinerary?.days.forEach(day => {
            const stop = day.stops.find(s => s.id === stopId);
            if (stop) {
                setSelectedTempleForRec(stop.templeId);
                setActiveTab("recommendations");
            }
        });
    };
    const handleSelectRitual = (stopId: string, ritual: RitualTiming) => {
        if (!itinerary) return;
        setItinerary({
            ...itinerary,
            days: itinerary.days.map(day => ({
                ...day,
                stops: day.stops.map(stop => stop.id === stopId ? {
                    ...stop,
                    selectedRitual: ritual
                } : stop)
            }))
        });
        toast.success(`Selected ${ritual.name} for visit`);
    };
    const handleDownload = () => {
        if (!itinerary) return;
        const data = JSON.stringify(itinerary, null, 2);
        const blob = new Blob([data], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `teerthflow-itinerary-${format(new Date(), "yyyy-MM-dd")}.json`;
        a.click();
        toast.success("Itinerary downloaded!");
    };
    const allStops = itinerary?.days.flatMap(d => d.stops) || [];
    if (!user) {
        return <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">Sign In Required</h2>
                    <p className="text-muted-foreground mb-6">
                        Please sign in to access the Itinerary Planner
                    </p>
                    <Link to="/auth">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>;
    }
    return <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    Pilgrimage Itinerary Planner
                </h1>
                <p className="text-muted-foreground">
                    Plan your sacred journey with optimized routes and ritual timings
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="planner">
                        <Calendar className="h-4 w-4 mr-2" />
                        Planner
                    </TabsTrigger>
                    <TabsTrigger value="recommendations">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Recommendations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="planner" className="space-y-6">
                    {/* Trip Configuration */}
                    <div className="card-elevated p-6">
                        <h2 className="font-display text-xl font-semibold mb-4">Trip Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="start-date">Start Date</Label>
                                <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="end-date">End Date</Label>
                                <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="start-location">Start Location</Label>
                                <Select value={startLocation} onValueChange={setStartLocation}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {majorCities.map(city => <SelectItem key={city.name} value={city.name}>
                                            {city.name}
                                        </SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={generateItinerary} className="w-full">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Itinerary
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Temple Selection */}
                    <div className="card-elevated p-6">
                        <h2 className="font-display text-xl font-semibold mb-4">Select Temples</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {temples.map(temple => <button key={temple.id} onClick={() => toggleTempleSelection(temple.id)} className={`p-4 rounded-xl text-left transition-all border ${selectedTemples.includes(temple.id) ? "bg-primary/10 border-primary ring-2 ring-primary/20" : "bg-card border-border hover:bg-muted"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTemples.includes(temple.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                        {selectedTemples.includes(temple.id) ? <span className="font-bold">{selectedTemples.indexOf(temple.id) + 1}</span> : <Plus className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{temple.name}</p>
                                        <p className="text-sm text-muted-foreground">{temple.city}</p>
                                    </div>
                                </div>
                            </button>)}
                        </div>
                    </div>

                    {/* Generated Itinerary */}
                    {itinerary && <>
                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{tripDays} Days</span>
                                <span>•</span>
                                <span>{selectedTemples.length} Temples</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-1.5" />
                                    Download
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-1.5" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Map */}


                        {/* Day-by-Day Itinerary */}
                        <div className="space-y-8">
                            {itinerary.days.map(day => <DayItineraryCard key={day.day} dayItinerary={day} onToggleLock={handleToggleLock} onSwap={handleSwap} onSelectRitual={handleSelectRitual} />)}
                        </div>
                    </>}
                </TabsContent>

                <TabsContent value="recommendations">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Temple Selection for Recommendations */}
                        <div className="lg:col-span-1 card-elevated p-4">
                            <h3 className="font-display font-semibold mb-4">Select Temple</h3>
                            <div className="space-y-2">
                                {temples.map(temple => <button key={temple.id} onClick={() => setSelectedTempleForRec(temple.id)} className={`w-full p-3 rounded-lg text-left transition-all border ${selectedTempleForRec === temple.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-muted"}`}>
                                    <p className="font-medium">{temple.name}</p>
                                    <p className="text-sm text-muted-foreground">{temple.city}</p>
                                </button>)}
                            </div>
                        </div>

                        {/* Recommendations Panel */}
                        <div className="lg:col-span-2 card-elevated p-4">
                            <RecommendationPanel selectedTempleId={selectedTempleForRec} currentTime={format(new Date(), "HH:mm")} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </main>

        <Footer />
    </div>;
}