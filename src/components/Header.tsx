import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Info, Mail, User, LogOut, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "About", path: "/about", icon: Info },
    { label: "Itinerary", path: "/itinerary", icon: Calendar },
    { label: "Contact", path: "/contact", icon: Mail },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut, loading } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-lg">
            <div className="container flex h-16 items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
                    aria-label="TeerthFlow Home"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-gold shadow-md border border-gold/30">
                        <span className="font-devanagari text-xl font-bold text-primary-foreground">त</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-xl font-semibold text-foreground leading-tight">
                            TeerthFlow
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium tracking-wider">तीर्थ यात्रा</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.95rem] font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {/* Auth Button/Menu */}
                    {loading ? (
                        <div className="h-9 w-9 rounded-xl bg-muted animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl bg-primary/10 hover:bg-gold/25 text-primary"
                                        onClick={() => navigate("/dashboard")}
                                        aria-label="Open dashboard"
                                    >
                                        <User className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open your dashboard</TooltipContent>
                            </Tooltip>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                                onClick={handleSignOut}
                                aria-label="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link to="/auth">
                            <Button
                                variant="default"
                                size="sm"
                                className="rounded-xl bg-gradient-to-r from-primary to-saffron-dark hover:from-primary/90 hover:to-saffron-dark/90 text-primary-foreground font-medium shadow-md"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav
                    className="md:hidden border-t border-border/40 bg-card animate-fade-in"
                    aria-label="Mobile navigation"
                >
                    <div className="container py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {user && (
                            <Link
                                to="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    location.pathname === "/dashboard"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <User className="h-5 w-5" />
                                Dashboard
                            </Link>
                        )}

                        {/* Mobile Auth Link */}
                        {!user && (
                            <Link
                                to="/auth"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary/10 text-primary"
                            >
                                <User className="h-5 w-5" />
                                Sign In / Sign Up
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
