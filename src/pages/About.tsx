import { Header } from "@/components/Header";
import { MapPin, Users, Wifi, TrendingUp } from "lucide-react";

const features = [
    {
        icon: MapPin,
        title: "Discover Temples",
        description: "Explore sacred destinations across all Indian states with detailed information about each temple.",
    },
    {
        icon: Users,
        title: "Real-time Crowd Data",
        description: "Get live crowd updates powered by IoT sensors to plan your visit at the perfect time.",
    },
    {
        icon: Wifi,
        title: "Live Device Status",
        description: "Monitor connected devices and ensure you always have accurate, up-to-date information.",
    },
    {
        icon: TrendingUp,
        title: "Smart Predictions",
        description: "AI-powered predictions help you anticipate crowd levels for the next hour.",
    },
];

export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center animate-fade-in">
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                                About <span className="text-gradient">TeerthFlow</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Empowering pilgrims with technology to make their spiritual journeys
                                more informed, comfortable, and meaningful.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-16">
                    <div className="container">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">
                                Our Mission
                            </h2>
                            <p className="text-muted-foreground text-center leading-relaxed">
                                TeerthFlow bridges ancient spirituality with modern technology. We provide
                                real-time crowd monitoring, historical data analysis, and smart predictions
                                to help millions of pilgrims plan their visits efficiently. Our IoT-powered
                                platform ensures you can experience divine darshan without unnecessary waiting.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 bg-muted/30">
                    <div className="container">
                        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-12 text-center">
                            What We Offer
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="card-elevated p-6 text-center animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16">
                    <div className="container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="font-display text-4xl font-bold text-primary">6+</p>
                                <p className="text-muted-foreground">States Covered</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl font-bold text-primary">50+</p>
                                <p className="text-muted-foreground">Pilgrimage Sites Monitored</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl font-bold text-primary">24/7</p>
                                <p className="text-muted-foreground">Live Updates</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl font-bold text-primary">100K+</p>
                                <p className="text-muted-foreground">Happy Pilgrims</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
