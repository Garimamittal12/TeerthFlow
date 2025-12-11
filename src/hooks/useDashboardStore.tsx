import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ActionType = "Reschedule" | "Swap Today Visit" | "Swap Evening Visit";

interface DashboardAction {
    id: string;
    type: ActionType;
    templeId?: string;
    templeName?: string;
    timestamp: string;
}

interface SavedItinerary {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    days: DayItinerary[];
    visitedTemples: Record<string, boolean>;
}

interface DashboardState {
    selectedActions: DashboardAction[];
    history: DashboardAction[];
    savedItineraries: SavedItinerary[];
}

interface DashboardContextValue extends DashboardState {
    recordAction: (type: ActionType, templeId?: string, templeName?: string) => void;
    clearHistory: () => void;
    saveItinerary: (itinerary: Itinerary, name: string) => void;
    toggleVisited: (itineraryId: string, templeId: string) => void;
    deleteItinerary: (itineraryId: string) => void;
}

const storageKey = "teerthflow-dashboard";

const defaultState: DashboardState = {
    selectedActions: [],
    history: [],
    savedItineraries: [],
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const loadState = (): DashboardState => {
    if (typeof window === "undefined") return defaultState;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return defaultState;
    try {
        const parsed = JSON.parse(stored) as DashboardState;
        return {
            ...defaultState,
            ...parsed,
            userInfo: { ...defaultState.userInfo, ...parsed.userInfo },
        };
    } catch {
        return defaultState;
    }
};

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DashboardState>(() => loadState());

    useEffect(() => {
        setState(loadState());
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state]);

    const recordAction = (type: ActionType, templeId?: string, templeName?: string) => {
        const timestamp = new Date().toISOString();
        const newEntry: DashboardAction = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type,
            templeId,
            templeName,
            timestamp,
        };

        setState((prev) => {
            const selectedActions = prev.selectedActions.some((action) => action.type === type && action.templeId === templeId)
                ? prev.selectedActions
                : [...prev.selectedActions, newEntry];

            return {
                ...prev,
                selectedActions,
                history: [newEntry, ...prev.history].slice(0, 100),
            };
        });
    };

    const clearHistory = () => {
        setState((prev) => ({ ...prev, history: [] }));
    };

    const saveItinerary = (itinerary: Itinerary, name: string) => {
        const visitedTemples: Record<string, boolean> = {};
        itinerary.days.forEach((day) =>
            day.stops.forEach((stop) => {
                visitedTemples[stop.templeId] = visitedTemples[stop.templeId] ?? false;
            })
        );

        const newSaved: SavedItinerary = {
            id: `saved_${Date.now()}`,
            name,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate,
            createdAt: new Date().toISOString(),
            days: itinerary.days,
            visitedTemples,
        };

        setState((prev) => ({
            ...prev,
            savedItineraries: [newSaved, ...prev.savedItineraries].slice(0, 20),
        }));
    };

    const toggleVisited = (itineraryId: string, templeId: string) => {
        setState((prev) => ({
            ...prev,
            savedItineraries: prev.savedItineraries.map((itin) =>
                itin.id === itineraryId
                    ? {
                        ...itin,
                        visitedTemples: {
                            ...itin.visitedTemples,
                            [templeId]: !itin.visitedTemples[templeId],
                        },
                    }
                    : itin
            ),
        }));
    };

    const deleteItinerary = (itineraryId: string) => {
        setState((prev) => ({
            ...prev,
            savedItineraries: prev.savedItineraries.filter((itin) => itin.id !== itineraryId),
        }));
    };

    const value = useMemo(
        () => ({
            ...state,
            recordAction,
            clearHistory,
            saveItinerary,
            toggleVisited,
            deleteItinerary,
        }),
        [state],
    );

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboardStore = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardStore must be used within DashboardProvider");
    }
    return context;
};

