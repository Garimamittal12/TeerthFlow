import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Calendar, Building2, Star, Image as ImageIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { CrowdMonitor } from "@/components/CrowdMonitor";
import { Button } from "@/components/ui/button";
import { RecommendationPanel } from "@/components/recommendations/RecommendationPanel";
import {
    getTempleById,
    getStateById,
    getDeviceById,
    getCrowdDataByTemple,
    type Temple,
    type State,
    type Device,
    type CrowdData,
} from "@/data/mockData";
import { useCrowdCount } from "@/hooks/useCrowdCount";

export default function TemplePage() {
    const { templeId } = useParams<{ templeId: string }>();
    const [temple, setTemple] = useState<Temple | null>(null);
    const [state, setState] = useState<State | null>(null);
    const [device, setDevice] = useState<Device | undefined>();
    const [crowd, setCrowd] = useState<CrowdData | undefined>();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Use API for temple_001
    const isTemple001 = templeId === "temple_001";
    const { isOnline: apiIsOnline, lastUpdated: apiLastUpdated } = useCrowdCount({
        apiUrl: "10.128.103.124/count",
        templeId: templeId || "",
        enabled: isTemple001,
        pollInterval: 1000, // Poll every 1 second for real-time updates
    });

    // Update device status for temple_001 based on API connection
    const updatedDevice = useMemo(() => {
        if (!device || !isTemple001) return device;
        return {
            ...device,
            isConnected: apiIsOnline,
            lastPing: apiLastUpdated || device.lastPing,
        };
    }, [device, isTemple001, apiIsOnline, apiLastUpdated]);

    useEffect(() => {
        if (!templeId) return;

        setLoading(true);
        getTempleById(templeId).then(async (templeData) => {
            if (!templeData) {
                setLoading(false);
                return;
            }

            setTemple(templeData);

            const [stateData, deviceData, crowdDataResult] = await Promise.all([
                getStateById(templeData.stateId),
                getDeviceById(templeData.deviceId),
                getCrowdDataByTemple(templeData.id),
            ]);

            setState(stateData || null);
            setDevice(deviceData);
            setCrowd(crowdDataResult);
            setLoading(false);
        });
    }, [templeId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-muted rounded" />
                        <div className="h-80 bg-muted rounded-3xl" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-64 bg-muted rounded-3xl" />
                            <div className="h-64 bg-muted rounded-3xl" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!temple) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-16">
                    <div className="text-center">
                        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                            Temple Not Found
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The temple you're looking for doesn't exist.
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
                {/* Hero Header */}
                <section className="relative h-80 md:h-96 overflow-hidden">
                    <img
                        src={temple.images[activeImage]}
                        alt={temple.name}
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 gradient-overlay" />

                    {/* Image thumbnails */}
                    {temple.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {temple.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === activeImage
                                            ? "bg-primary-foreground scale-125"
                                            : "bg-primary-foreground/50 hover:bg-primary-foreground/75"
                                        }`}
                                    aria-label={`View image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-end">
                        <div className="container pb-8">
                            <Breadcrumb
                                items={[
                                    { label: state?.name || "State", href: `/state/${temple.stateId}` },
                                    { label: temple.name },
                                ]}
                            />
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                                {temple.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{temple.city}, {state?.name}</span>
                                </div>
                                <span className="text-primary-foreground/40">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4" />
                                    <span>{temple.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Crowd Monitor */}
                            <CrowdMonitor temple={temple} device={updatedDevice || device} initialCrowd={crowd} />

                            {/* Nearby Recommendations based on live crowd */}
                            <div className="card-elevated p-6">
                                <h3 className="font-display text-lg font-semibold mb-4">
                                    Nearby Alternatives
                                </h3>
                                <RecommendationPanel
                                    selectedTempleId={temple.id}
                                    currentTime={new Date().toISOString().slice(11, 16)}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Temple Info Card */}
                            <div className="card-elevated p-6">
                                <h3 className="font-display text-lg font-semibold mb-4">About</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    {temple.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Deity</p>
                                            <p className="font-medium text-sm">{temple.deity}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Architecture</p>
                                            <p className="font-medium text-sm">{temple.architecture}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Timings</p>
                                            <p className="font-medium text-sm">{temple.timings}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Established</p>
                                            <p className="font-medium text-sm">{temple.established}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Festivals Card */}
                            <div className="card-elevated p-6">
                                <h3 className="font-display text-lg font-semibold mb-4">Major Festivals</h3>
                                <div className="flex flex-wrap gap-2">
                                    {temple.festivals.map((festival, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full"
                                        >
                                            {festival}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Device Details Card */}
                            {(updatedDevice || device) && (
                                <div className="card-elevated p-6">
                                    <h3 className="font-display text-lg font-semibold mb-4">IoT Device</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Device ID</span>
                                            <span className="font-mono">{(updatedDevice || device)!.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={(updatedDevice || device)!.isConnected ? "text-success" : "text-destructive"}>
                                                {(updatedDevice || device)!.isConnected ? "Online" : "Offline"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Signal</span>
                                            <span>{(updatedDevice || device)!.signalStrength}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Ping</span>
                                            <span>{new Date((updatedDevice || device)!.lastPing).toLocaleString()}</span>
                                        </div>
                                        {isTemple001 && (
                                            <div className="pt-2 mt-2 border-t border-border">
                                                <p className="text-xs text-muted-foreground">
                                                    Connected to hardware API
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
