import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Info, Mail, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "About", path: "/about", icon: Info },
    { label: "Contact", path: "/contact", icon: Mail },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
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
                <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary"
                                >
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/auth">
                            <Button
                                className="rounded-xl bg-gradient-to-r from-primary to-saffron-dark hover:from-primary/90 hover:to-saffron-dark/90 text-primary-foreground font-medium shadow-md"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
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
