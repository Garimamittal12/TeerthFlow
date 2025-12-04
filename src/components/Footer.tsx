import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card/80 mt-auto relative overflow-hidden">
            {/* Decorative top border */}
            <div className="temple-divider" />

            <div className="container py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-gold shadow-sm border border-gold/30">
                            <span className="font-devanagari text-sm font-bold text-primary-foreground">त</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-lg font-semibold text-foreground leading-tight">
                                TeerthFlow
                            </span>
                            <span className="text-[9px] text-muted-foreground tracking-wider">तीर्थ यात्रा</span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-8 text-sm" aria-label="Footer navigation">
                        <Link
                            to="/"
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Contact
                        </Link>
                    </nav>

                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        Made with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> for pilgrims
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40 text-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} TeerthFlow — तीर्थ फ्लो | Empowering spiritual journeys across India
                    </p>
                </div>
            </div>
        </footer>
    );
}
