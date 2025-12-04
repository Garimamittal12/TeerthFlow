import { useState, useMemo } from "react";
import { Search, ChevronDown, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { State } from "@/data/mockData";

interface SearchSelectProps {
    states: State[];
    placeholder?: string;
}

export function SearchSelect({ states, placeholder = "Search states..." }: SearchSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filteredStates = useMemo(() => {
        if (!search) return states;
        return states.filter((state) =>
            state.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [states, search]);

    const handleSelect = (stateId: string) => {
        setIsOpen(false);
        setSearch("");
        navigate(`/state/${stateId}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div
                className={cn(
                    "flex items-center gap-3 px-4 py-3 bg-card rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                    isOpen ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
                )}
                onClick={() => setIsOpen(!isOpen)}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label="Select a state"
            >
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    aria-label="Search states"
                />
                <ChevronDown
                    className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </div>

            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-xl overflow-hidden z-50 animate-scale-in"
                    role="listbox"
                >
                    <div className="max-h-64 overflow-y-auto">
                        {filteredStates.length === 0 ? (
                            <div className="px-4 py-8 text-center text-muted-foreground">
                                No states found
                            </div>
                        ) : (
                            filteredStates.map((state) => (
                                <button
                                    key={state.id}
                                    onClick={() => handleSelect(state.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                                    role="option"
                                    aria-selected={false}
                                >
                                    <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
                                        <img
                                            src={state.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">{state.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span>{state.templeCount} temples</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
