import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            className={cn(
                "relative h-9 w-9 rounded-xl transition-all duration-300",
                theme === "dark"
                    ? "bg-gold/10 hover:bg-gold/20 text-gold"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            <Sun className={cn(
                "h-4 w-4 transition-all duration-300",
                theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            )} />
            <Moon className={cn(
                "absolute h-4 w-4 transition-all duration-300",
                theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            )} />
        </Button>
    );
}
