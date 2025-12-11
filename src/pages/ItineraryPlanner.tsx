import { useState, useCallback, useEffect } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Calendar, MapPin, Clock, Route, Plus, Trash2, Sparkles, Download, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { DayItineraryCard } from "@/components/itinerary/DayItineraryCard";
import { temples, getTemplesByCity } from "@/data/mockData";
import { majorCities, templeLocations, calculateDistance, estimateTravelTime, getTempleLocation } from "@/data/itineraryData";
import type { Itinerary, DayItinerary, ItineraryStop, RitualTiming } from "@/data/itineraryData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import type { Temple } from "@/data/mockData";
import { useDashboardStore } from "@/hooks/useDashboardStore";

export default function ItineraryPlanner() {
    const {
        user
    } = useAuth();
    const { saveItinerary } = useDashboardStore();
    const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), "yyyy-MM-dd"));
    const [startLocation, setStartLocation] = useState<string>("Delhi");
    const [selectedTemples, setSelectedTemples] = useState<string[]>([]);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [availableTemples, setAvailableTemples] = useState<Temple[]>([]);
    const [loadingTemples, setLoadingTemples] = useState(false);
    const startCity = majorCities.find(c => c.name === startLocation);
    const tripDays = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)) + 1);

    // Load temples for selected city
    useEffect(() => {
        if (!startLocation) return;
        
        setLoadingTemples(true);
        setSelectedTemples([]); // Clear selection when city changes
        
        // Find temples in the selected city
        const cityTemples = temples.filter(t => 
            t.city.toLowerCase() === startLocation.toLowerCase()
        );
        
        setAvailableTemples(cityTemples);
        setLoadingTemples(false);
        
        if (cityTemples.length === 0) {
            toast.info(`No pilgrimage sites found in ${startLocation}. Please select a different city.`);
        }
    }, [startLocation]);

    // Generate itinerary
    const generateItinerary = useCallback(() => {
        if (selectedTemples.length === 0) {
            toast.error("Please select at least one temple");
            return;
        }
        
        const days: DayItinerary[] = [];
        const templesPerDay = Math.max(1, Math.ceil(selectedTemples.length / tripDays));
        let previousCoords = startCity ? {
            lat: startCity.lat,
            lng: startCity.lng
        } : {
            lat: 28.6139,
            lng: 77.209
        };
        
        // Distribute temples across days, ensuring all are included
        const remainingTemples = [...selectedTemples];
        
        for (let day = 1; day <= tripDays; day++) {
            // Calculate how many temples for this day
            const remainingDays = tripDays - day + 1;
            const templesForThisDay = remainingDays === 1 
                ? remainingTemples.length 
                : Math.min(templesPerDay, remainingTemples.length);
            
            const dayTemples = remainingTemples.splice(0, templesForThisDay);
            
            const stops: ItineraryStop[] = [];
            let totalTravelTime = 0;
            let totalDistance = 0;
            let currentTime = 6 * 60; // Start at 6:00 AM in minutes
            let dayPreviousCoords = previousCoords;

            dayTemples.forEach((templeId, index) => {
                const temple = temples.find(t => t.id === templeId);
                if (!temple) return;
                
                // Get location, generate if missing
                let location = templeLocations.find(l => l.templeId === templeId);
                if (!location) {
                    location = getTempleLocation(templeId, temple.city);
                }
                if (!location) return;
                
                const distance = calculateDistance(
                    dayPreviousCoords.lat, 
                    dayPreviousCoords.lng, 
                    location.lat, 
                    location.lng
                );
                const travelTime = estimateTravelTime(distance);
                
                // Add travel time
                currentTime += travelTime;
                
                // Ensure we don't go past 10 PM
                if (currentTime >= 22 * 60) {
                    currentTime = 22 * 60; // Cap at 10 PM
                }
                
                const arrivalHour = Math.floor(currentTime / 60);
                const arrivalMin = currentTime % 60;
                const visitDuration = location.avgVisitDuration;
                currentTime += visitDuration;
                
                // Ensure departure doesn't go past 11 PM
                if (currentTime >= 23 * 60) {
                    currentTime = 23 * 60;
                }
                
                const departureHour = Math.floor(currentTime / 60);
                const departureMin = currentTime % 60;

                // Find a suitable ritual
                const suitableRitual = location.ritualTimings.find(r => {
                    const [rHour] = r.startTime.split(":").map(Number);
                    return rHour >= arrivalHour && rHour <= departureHour;
                });
                
                stops.push({
                    id: `stop_${day}_${templeId}_${index}`,
                    templeId,
                    templeName: temple.name,
                    day,
                    arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMin.toString().padStart(2, "0")}`,
                    departureTime: `${departureHour.toString().padStart(2, "0")}:${departureMin.toString().padStart(2, "0")}`,
                    selectedRitual: suitableRitual,
                    isLocked: false,
                    travelTimeFromPrevious: index === 0 ? travelTime : travelTime,
                    distance
                });
                
                totalTravelTime += travelTime;
                totalDistance += distance;
                dayPreviousCoords = {
                    lat: location.lat,
                    lng: location.lng
                };
            });
            
            // Update previousCoords for next day
            if (stops.length > 0) {
                const lastStop = stops[stops.length - 1];
                const lastTemple = temples.find(t => t.id === lastStop.templeId);
                if (lastTemple) {
                    const lastLocation = templeLocations.find(l => l.templeId === lastStop.templeId) ||
                                      getTempleLocation(lastStop.templeId, lastTemple.city);
                    if (lastLocation) {
                        previousCoords = { lat: lastLocation.lat, lng: lastLocation.lng };
                    }
                }
            }
            
            days.push({
                day,
                date: format(addDays(new Date(startDate), day - 1), "yyyy-MM-dd"),
                stops,
                totalTravelTime,
                totalDistance: Math.round(totalDistance * 10) / 10
            });
        }
        
        // Verify all temples are included
        const includedTemples = new Set(days.flatMap(d => d.stops.map(s => s.templeId)));
        const missingTemples = selectedTemples.filter(id => !includedTemples.has(id));
        
        if (missingTemples.length > 0) {
            toast.warning(`${missingTemples.length} temple(s) could not be included in the itinerary.`);
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
    const [dragging, setDragging] = useState<{ dayIndex: number; stopIndex: number } | null>(null);
    const handleDragStart = (dayIndex: number, stopIndex: number) => {
        setDragging({ dayIndex, stopIndex });
    };

    const handleDrop = (targetDayIndex: number, targetStopIndex: number) => {
        if (!itinerary || dragging === null) return;
        const sourceDayIdx = dragging.dayIndex;
        const sourceStopIdx = dragging.stopIndex;
        const daysCopy = itinerary.days.map((d) => ({ ...d, stops: [...d.stops] }));

        const [moved] = daysCopy[sourceDayIdx].stops.splice(sourceStopIdx, 1);
        if (!moved) return;
        moved.day = daysCopy[targetDayIndex].day;

        const insertIndex = targetStopIndex;
        daysCopy[targetDayIndex].stops.splice(insertIndex, 0, moved);

        setItinerary({ ...itinerary, days: daysCopy });
        setDragging(null);
    };

    const handleDragEnd = () => setDragging(null);
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

    const handleSaveItinerary = () => {
        if (!itinerary) return;
        const name = `${startLocation} Trip – ${format(new Date(startDate), "MMM yyyy")}`;
        saveItinerary({ ...itinerary, startLocation }, name);
        toast.success("Itinerary saved to dashboard");
    };
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl font-semibold">Select Pilgrimage Sites</h2>
                        {startLocation && (
                            <span className="text-sm text-muted-foreground">
                                Showing sites in <span className="font-medium text-foreground">{startLocation}</span>
                            </span>
                        )}
                    </div>
                    
                    {loadingTemples ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading pilgrimage sites...</p>
                        </div>
                    ) : availableTemples.length === 0 ? (
                        <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">
                                {startLocation 
                                    ? `No pilgrimage sites found in ${startLocation}`
                                    : "Please select a start location first"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Try selecting a different city or check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availableTemples.map(temple => (
                                <button 
                                    key={temple.id} 
                                    onClick={() => toggleTempleSelection(temple.id)} 
                                    className={`p-4 rounded-xl text-left transition-all border ${
                                        selectedTemples.includes(temple.id) 
                                            ? "bg-primary/10 border-primary ring-2 ring-primary/20" 
                                            : "bg-card border-border hover:bg-muted"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            selectedTemples.includes(temple.id) 
                                                ? "bg-primary text-primary-foreground" 
                                                : "bg-muted text-muted-foreground"
                                        }`}>
                                            {selectedTemples.includes(temple.id) ? (
                                                <span className="font-bold">{selectedTemples.indexOf(temple.id) + 1}</span>
                                            ) : (
                                                <Plus className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{temple.name}</p>
                                            <p className="text-sm text-muted-foreground">{temple.category}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {selectedTemples.length > 0 && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm font-medium text-foreground">
                                {selectedTemples.length} site{selectedTemples.length !== 1 ? "s" : ""} selected
                            </p>
                        </div>
                    )}
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
                            <Button variant="outline" size="sm" onClick={handleSaveItinerary}>
                                <Star className="h-4 w-4 mr-1.5" />
                                Favorite / Interested
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-1.5" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Day-by-Day Itinerary */}
                    <div className="space-y-8">
                        {itinerary.days.map((day, idx) => (
                            <DayItineraryCard
                                key={day.day}
                                dayItinerary={day}
                                dayIndex={idx}
                                onToggleLock={handleToggleLock}
                                onSelectRitual={handleSelectRitual}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                dragging={dragging}
                            />
                        ))}
                    </div>
                </>}
            </div>
        </main>
    </div>;
}