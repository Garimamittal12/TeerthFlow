import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { user, signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const validateForm = () => {
        try {
            authSchema.parse({ email, password });
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: { email?: string; password?: string } = {};
                err.errors.forEach((e) => {
                    if (e.path[0] === "email") newErrors.email = e.message;
                    if (e.path[0] === "password") newErrors.password = e.message;
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const { error } = isLogin
            ? await signIn(email, password)
            : await signUp(email, password);

        setIsSubmitting(false);

        if (error) {
            let message = error.message;
            if (error.message.includes("Invalid login credentials")) {
                message = "Invalid email or password. Please try again.";
            } else if (error.message.includes("User already registered")) {
                message = "This email is already registered. Please sign in instead.";
            }
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } else {
            toast({
                title: isLogin ? "Welcome back!" : "Account created!",
                description: isLogin
                    ? "You have successfully signed in."
                    : "Your account has been created successfully.",
            });
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Decorative Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-gold shadow-lg flex items-center justify-center border border-gold/30">
                                <span className="font-devanagari text-3xl font-bold text-primary-foreground">त</span>
                            </div>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                            {isLogin ? "Welcome Back" : "Join TeerthFlow"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isLogin
                                ? "Sign in to access your account and explore pilgrimage sites."
                                : "Create an account to explore pilgrimage sites and get crowd alerts"}
                        </p>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-background border-border focus:border-primary"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-background border-border focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-primary to-saffron-dark hover:from-primary/90 hover:to-saffron-dark/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isLogin ? "Signing in..." : "Creating account..."}
                                    </>
                                ) : (
                                    <>
                                        <User className="mr-2 h-4 w-4" />
                                        {isLogin ? "Sign In" : "Create Account"}
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Toggle Auth Mode */}
                        <div className="mt-6 pt-6 border-t border-border text-center">
                            <p className="text-muted-foreground">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                }}
                                className="mt-1 text-primary hover:text-primary/80 font-semibold transition-colors"
                            >
                                {isLogin ? "Create one now" : "Sign in instead"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
