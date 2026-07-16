import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Hash, Clock, History, ListChecks, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const actionColors: Record<string, string> = {
    "Reschedule": "bg-primary/10 text-primary border-primary/20",
    "Swap Today Visit": "bg-gold/15 text-foreground border-gold/30",
    "Swap Evening Visit": "bg-secondary/10 text-secondary border-secondary/20",
};

export default function Dashboard() {
    const { selectedActions, history, savedItineraries, toggleVisited, deleteItinerary } = useDashboardStore();
    const { user } = useAuth();

    const displayName = user?.user_metadata?.name || user?.email || "Guest";
    const displayEmail = user?.email;
    const displayAvatar = user?.user_metadata?.avatar_url as string | undefined;
    const displayUid = user?.id;

    const renderInitials = () =>
        (displayName?.slice(0, 1).toUpperCase() || "U");

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-10">
                <div className="container space-y-8">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-primary">Personalized Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                            Welcome back, {displayName}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Your itineraries, visit swaps, and reschedule actions are saved to your account
                            (stored locally per user ID so they never mix with another pilgrim&apos;s data).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 shadow-md">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-xl font-semibold text-primary-foreground shadow-md">
                                        {displayAvatar ? (
                                            <img
                                                src={displayAvatar}
                                                alt={displayName}
                                                className="h-full w-full object-cover rounded-full"
                                            />
                                        ) : (
                                            renderInitials()
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">User</p>
                                        <p className="text-lg font-semibold text-foreground">{displayName}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-foreground">
                                    {displayEmail && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span>{displayEmail}</span>
                                        </div>
                                    )}
                                    {displayUid && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Hash className="h-4 w-4" />
                                            <span>{displayUid}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{user ? "Signed in" : "Not signed in"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ListChecks className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Selected Actions</h2>
                                </div>
                                {selectedActions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No actions selected yet. Try rescheduling or swapping a visit to see them here instantly.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedActions.map((action) => (
                                            <Badge
                                                key={action.id}
                                                variant="outline"
                                                className={actionColors[action.type] || "bg-muted text-foreground border-border"}
                                            >
                                                {action.type} – {action.templeName || action.templeId || "Temple"}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <History className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">Action History</h2>
                            </div>
                            {history.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No actions recorded yet. Your history will appear here as soon as you interact with visit options.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-border px-4 py-3 bg-card/70"
                                        >
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="font-semibold text-foreground">{item.type}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <span className="text-foreground font-medium">
                                                    {item.templeName || item.templeId || "Temple"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">Saved Itineraries</h2>
                            </div>

                            {savedItineraries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No itineraries saved yet. Favorite an itinerary from the planner to see it here.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {savedItineraries.map((itin) => {
                                        const allVisited = Object.values(itin.visitedTemples).every(Boolean);
                                        return (
                                            <div
                                                key={itin.id}
                                                className={cn(
                                                    "p-4 rounded-xl border border-border bg-card",
                                                    allVisited && "opacity-70"
                                                )}
                                            >
                                                <div className="flex items-center justify-between gap-3 mb-3">
                                                    <div>
                                                        <p className="text-lg font-semibold text-foreground">{itin.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {itin.startDate} → {itin.endDate}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {allVisited && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Visited
                                                            </Badge>
                                                        )}
                                                        <button
                                                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                                                            onClick={() => {
                                                                const confirmDelete = window.confirm("Delete this saved itinerary?");
                                                                if (confirmDelete) {
                                                                    deleteItinerary(itin.id);
                                                                }
                                                            }}
                                                            aria-label="Delete itinerary"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {itin.days.map((day) => (
                                                        <div key={`${itin.id}-${day.day}`} className="p-3 rounded-lg border border-border/60">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium text-foreground">Day {day.day}</span>
                                                                <span className="text-xs text-muted-foreground">{day.date}</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {day.stops.length === 0 && (
                                                                    <p className="text-xs text-muted-foreground">No temples assigned.</p>
                                                                )}
                                                                {day.stops.map((stop) => (
                                                                    <label
                                                                        key={stop.id}
                                                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!itin.visitedTemples[stop.templeId]}
                                                                            onChange={() => toggleVisited(itin.id, stop.templeId)}
                                                                        />
                                                                        <span className="text-sm text-foreground">{stop.templeName || stop.templeId}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

