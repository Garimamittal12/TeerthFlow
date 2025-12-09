import { useState, useCallback, useEffect } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar, MapPin, Clock, Route, Plus, Trash2, Sparkles, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { DayItineraryCard } from "@/components/itinerary/DayItineraryCard";
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
        toast.info("Swap feature coming soon for itinerary optimization");
        // In the future this can reshuffle stops within the itinerary day
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

        // Create a simple flowchart-style image on a canvas
        const canvas = document.createElement("canvas");
        const width = 1200;
        const baseMargin = 40;
        const dayHeaderHeight = 50;
        const stopHeight = 80;
        const vGap = 24;

        // Calculate dynamic height
        const totalStops = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0);
        const height = Math.max(
            800,
            baseMargin * 2 + itinerary.days.length * dayHeaderHeight + totalStops * (stopHeight + vGap),
        );

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background
        ctx.fillStyle = "#fdf7ef";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "24px Source Sans 3, sans-serif";
        ctx.fillStyle = "#5c3b10";
        ctx.fillText("TeerthFlow - Itinerary", baseMargin, baseMargin);
        ctx.font = "16px Source Sans 3, sans-serif";
        ctx.fillText(
            `${itinerary.startDate} → ${itinerary.endDate} | Start: ${itinerary.startLocation}`,
            baseMargin,
            baseMargin + 26,
        );

        let y = baseMargin + 60;

        itinerary.days.forEach((day, dayIdx) => {
            // Day header
            ctx.fillStyle = "#f7c266";
            ctx.strokeStyle = "#c17f1c";
            ctx.lineWidth = 2;
            ctx.fillRect(baseMargin, y, width - baseMargin * 2, dayHeaderHeight);
            ctx.strokeRect(baseMargin, y, width - baseMargin * 2, dayHeaderHeight);

            ctx.fillStyle = "#3b2b1a";
            ctx.font = "18px Source Sans 3, sans-serif";
            ctx.fillText(`Day ${day.day} - ${format(new Date(day.date), "MMM d, yyyy")}`, baseMargin + 16, y + 32);

            y += dayHeaderHeight + 12;

            day.stops.forEach((stop, stopIdx) => {
                const boxWidth = width - baseMargin * 2 - 40;
                const boxX = baseMargin + 20;
                const boxY = y;

                // Box
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#d9b370";
                ctx.lineWidth = 2;
                ctx.fillRect(boxX, boxY, boxWidth, stopHeight);
                ctx.strokeRect(boxX, boxY, boxWidth, stopHeight);

                // Text
                ctx.fillStyle = "#1f140d";
                ctx.font = "16px Source Sans 3, sans-serif";
                ctx.fillText(`${stop.templeName || stop.templeId}`, boxX + 14, boxY + 24);
                ctx.font = "13px Source Sans 3, sans-serif";
                ctx.fillText(
                    `${stop.arrivalTime} - ${stop.departureTime}  •  ${Math.round(stop.distance)} km`,
                    boxX + 14,
                    boxY + 45,
                );
                if (stop.selectedRitual?.name) {
                    ctx.fillText(`Ritual: ${stop.selectedRitual.name}`, boxX + 14, boxY + 64);
                }

                // Connector arrow to next stop
                if (stopIdx < day.stops.length - 1) {
                    const arrowY = boxY + stopHeight + 6;
                    ctx.strokeStyle = "#c17f1c";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(boxX + boxWidth / 2, arrowY);
                    ctx.lineTo(boxX + boxWidth / 2, arrowY + vGap - 12);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(boxX + boxWidth / 2 - 6, arrowY + vGap - 14);
                    ctx.lineTo(boxX + boxWidth / 2, arrowY + vGap - 6);
                    ctx.lineTo(boxX + boxWidth / 2 + 6, arrowY + vGap - 14);
                    ctx.fillStyle = "#c17f1c";
                    ctx.fill();
                }

                y += stopHeight + vGap;
            });

            y += 12;
        });

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `teerthflow-itinerary-${format(new Date(), "yyyy-MM-dd")}.png`;
        link.click();
        toast.success("Itinerary image downloaded");
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

            <div className="space-y-6">
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

                    {/* Day-by-Day Itinerary */}
                    <div className="space-y-8">
                        {itinerary.days.map(day => <DayItineraryCard key={day.day} dayItinerary={day} onToggleLock={handleToggleLock} onSwap={handleSwap} onSelectRitual={handleSelectRitual} />)}
                    </div>
                </>}
            </div>
        </main>
    </div>;
}