import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
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
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map once when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    let isMounted = true;
    let mapInstance: any = null;

    const initialize = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.default.accessToken = mapboxToken;

        mapInstance = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center: startCoords ? [startCoords.lng, startCoords.lat] : [78.9629, 22.5937],
          zoom: startCoords ? 6 : 4,
        });

        mapInstance.addControl(new mapboxgl.default.NavigationControl(), "top-right");

        mapInstance.on("load", () => {
          if (!isMounted) return;
          mapRef.current = mapInstance;
          setMapReady(true);
        });
      } catch (err) {
        console.error("Failed to load Mapbox:", err);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
      markersRef.current = [];
    };
    // note: intentionally NOT adding 'stops' here — we're initializing the map once
  }, [mapboxToken, mapContainer, startCoords]);

  // Whenever stops or startCoords change, update markers and route on the existing map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((m) => {
      try {
        m.remove();
      } catch (e) {
        /* ignore */
      }
    });
    markersRef.current = [];

    // Add start marker if available
    if (startCoords) {
      try {
        // Optionally center or fit bounds when start coords + stops are updated
        const startMarker = new (map as any).Marker({ color: "#f97316" })
          .setLngLat([startCoords.lng, startCoords.lat])
          .setPopup(new (map as any).Popup().setHTML("<strong>Start Location</strong>"))
          .addTo(map);
        markersRef.current.push(startMarker);
      } catch (e) {
        // If Mapbox API shape differs slightly on runtime import, handle gracefully
      }
    }

    // Add temple markers (numbered)
    stops.forEach((stop, index) => {
      const location = templeLocations.find((l) => l.templeId === stop.templeId);
      const temple = temples.find((t) => t.id === stop.templeId);

      if (!location || !temple) return;

      // create element
      const el = document.createElement("div");
      el.className =
        "flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm cursor-pointer shadow-lg";
      el.textContent = (index + 1).toString();
      el.style.border = stop.isLocked ? "3px solid #f97316" : "2px solid white";
      el.style.userSelect = "none";

      el.addEventListener("click", () => {
        onTempleSelect?.(stop.templeId);
      });

      const marker = new (map as any).Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new (map as any).Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
                <strong>${temple.name}</strong><br/>
                <span class="text-sm text-gray-600">${temple.city}</span><br/>
                <span class="text-xs">${stop.arrivalTime ?? ""} - ${stop.departureTime ?? ""}</span>
            </div>`
          )
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Draw or update route source + layer
    const coordinates: [number, number][] = [];
    if (startCoords) {
      coordinates.push([startCoords.lng, startCoords.lat]);
    }
    stops.forEach((stop) => {
      const location = templeLocations.find((l) => l.templeId === stop.templeId);
      if (location) coordinates.push([location.lng, location.lat]);
    });

    const sourceId = "itinerary-route";
    const layerId = "itinerary-route-layer";

    // If source exists, update data, else add source + layer
    if (map.getSource && map.getSource(sourceId)) {
      const src = map.getSource(sourceId) as any;
      try {
        src.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        });
      } catch (e) {
        // fallback: remove and re-add
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    }

    if (!map.getSource || !map.getSource(sourceId)) {
      // Add source
      try {
        map.addSource(sourceId, {
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

        // Add layer (style)
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
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
      } catch (err) {
        // mapbox might still be initializing; ignore but log
        console.warn("Could not add route source/layer:", err);
      }
    }

    // Optionally fit bounds to markers when many stops exist
    try {
      if (coordinates.length > 0 && (map as any).fitBounds) {
        const bounds = coordinates.reduce(
          (b, c) => {
            b.extend(c as any);
            return b;
          },
          new (window as any).mapboxgl && (window as any).mapboxgl.LngLatBounds
            ? new (window as any).mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
            : null
        );

        // only try fitBounds if bounds exists (avoid errors with multiple mapbox versions)
        if (bounds && (map as any).fitBounds) {
          try {
            (map as any).fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 400 });
          } catch (e) {
            // ignore if fitBounds fails due to missing LngLatBounds constructor on window
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // no cleanup here — markersRef will be cleared on next run or on unmount
  }, [stops, startCoords, mapReady, onTempleSelect]);

  // UI token entry
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
              <Label htmlFor="mapbox-token" className="text-sm">
                Mapbox Public Token
              </Label>
              <Input id="mapbox-token" type="text" placeholder="pk.eyJ1..." className="mt-1" onChange={(e) => setMapboxToken(e.target.value)} />
            </div>
            <Button onClick={() => setShowTokenInput(false)} className="w-full" disabled={!mapboxToken}>
              Load Map
            </Button>
            <p className="text-xs text-muted-foreground">
              Get your token at{" "}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-pulse text-muted-foreground">Loading map...</div>
        </div>
      )}
    </div>
  );
}
