import { useEffect, useRef, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { templeLocations } from "@/data/itineraryData";
import { temples } from "@/data/mockData";
import type { ItineraryStop } from "@/data/itineraryData";

interface ItineraryMapProps {
    stops: ItineraryStop[];
    startCoords?: { lat: number; lng: number };
    onTempleSelect?: (templeId: string) => void;
}

export function ItineraryMap({ stops, startCoords, onTempleSelect }: ItineraryMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapboxToken, setMapboxToken] = useState<string>("");
    const [showTokenInput, setShowTokenInput] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapboxToken || !mapContainer.current || mapLoaded) return;

        const loadMap = async () => {
            try {
                const mapboxgl = await import("mapbox-gl");
                await import("mapbox-gl/dist/mapbox-gl.css");

                mapboxgl.default.accessToken = mapboxToken;

                const map = new mapboxgl.default.Map({
                    container: mapContainer.current!,
                    style: "mapbox://styles/mapbox/light-v11",
                    center: startCoords ? [startCoords.lng, startCoords.lat] : [78.9629, 22.5937],
                    zoom: startCoords ? 6 : 4,
                });

                map.addControl(new mapboxgl.default.NavigationControl(), "top-right");

                map.on("load", () => {
                    // Add start marker
                    if (startCoords) {
                        new mapboxgl.default.Marker({ color: "#22c55e" })
                            .setLngLat([startCoords.lng, startCoords.lat])
                            .setPopup(new mapboxgl.default.Popup().setHTML("<strong>Start Location</strong>"))
                            .addTo(map);
                    }

                    // Add temple markers
                    stops.forEach((stop, index) => {
                        const location = templeLocations.find((l) => l.templeId === stop.templeId);
                        const temple = temples.find((t) => t.id === stop.templeId);

                        if (location && temple) {
                            const el = document.createElement("div");
                            el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm cursor-pointer shadow-lg";
                            el.textContent = (index + 1).toString();
                            el.style.border = stop.isLocked ? "3px solid #f59e0b" : "2px solid white";

                            el.addEventListener("click", () => {
                                onTempleSelect?.(stop.templeId);
                            });

                            new mapboxgl.default.Marker(el)
                                .setLngLat([location.lng, location.lat])
                                .setPopup(
                                    new mapboxgl.default.Popup({ offset: 25 }).setHTML(
                                        `<div class="p-2">
                    <strong>${temple.name}</strong><br/>
                    <span class="text-sm text-gray-600">${temple.city}</span><br/>
                    <span class="text-xs">${stop.arrivalTime} - ${stop.departureTime}</span>
                    </div>`
                                    )
                                )
                                .addTo(map);
                        }
                    });

                    // Draw route lines
                    if (stops.length > 1) {
                        const coordinates: [number, number][] = [];

                        if (startCoords) {
                            coordinates.push([startCoords.lng, startCoords.lat]);
                        }

                        stops.forEach((stop) => {
                            const location = templeLocations.find((l) => l.templeId === stop.templeId);
                            if (location) {
                                coordinates.push([location.lng, location.lat]);
                            }
                        });

                        map.addSource("route", {
                            type: "geojson",
                            data: {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "LineString",
                                    coordinates,
                                },
                            },
                        });

                        map.addLayer({
                            id: "route",
                            type: "line",
                            source: "route",
                            layout: {
                                "line-join": "round",
                                "line-cap": "round",
                            },
                            paint: {
                                "line-color": "#f97316",
                                "line-width": 4,
                                "line-dasharray": [2, 1],
                            },
                        });
                    }

                    setMapLoaded(true);
                });

                return () => map.remove();
            } catch (error) {
                console.error("Error loading map:", error);
            }
        };

        loadMap();
    }, [mapboxToken, stops, startCoords, mapLoaded, onTempleSelect]);

    if (showTokenInput && !mapboxToken) {
        return (
            <div className="h-[400px] bg-muted rounded-xl flex items-center justify-center border border-border">
                <div className="text-center p-6 max-w-md">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">Interactive Map</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Enter your Mapbox public token to enable the interactive map with route visualization.
                    </p>
                    <div className="space-y-3">
                        <div className="text-left">
                            <Label htmlFor="mapbox-token" className="text-sm">Mapbox Public Token</Label>
                            <Input
                                id="mapbox-token"
                                type="text"
                                placeholder="pk.eyJ1..."
                                className="mt-1"
                                onChange={(e) => setMapboxToken(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setShowTokenInput(false)}
                            className="w-full"
                            disabled={!mapboxToken}
                        >
                            Load Map
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Get your token at{" "}
                            <a
                                href="https://mapbox.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                mapbox.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border">
            <div ref={mapContainer} className="absolute inset-0" />
            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="animate-pulse text-muted-foreground">Loading map...</div>
                </div>
            )}
        </div>
    );
}
