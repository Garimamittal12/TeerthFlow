import { useMemo, useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { getCrowdLevel } from "@/data/mockData";

interface HistoricalChartProps {
    data: { time: string; count: number }[];
    capacity: number;
    isRealtime?: boolean; // Flag for backend realtime data
}

export function HistoricalChart({ data, capacity, isRealtime = false }: HistoricalChartProps) {
    const [chartData, setChartData] = useState<{ time: string; count: number }[]>([]);

    // Update chart data when data prop changes (supports real-time updates)
    useEffect(() => {
        const formattedData = data.map((item) => ({
            ...item,
            time: new Date(item.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
        }));
        setChartData(formattedData);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
        if (active && payload && payload.length) {
            const count = payload[0].value;
            const level = getCrowdLevel(count, capacity);

            return (
                <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold text-foreground">{count} visitors</p>
                    <p className="text-xs text-muted-foreground">Level: {level}</p>
                </div>
            );
        }
        return null;
    };

    const latestCount = chartData.length > 0 ? chartData[chartData.length - 1]?.count ?? 0 : 0;

    return (
        <div className="w-full h-72" role="img" aria-label="Historical crowd data chart">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="crowdGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        interval="preserveStartEnd"
                    />

                    <YAxis
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Threshold lines based on percentage */}
                    <ReferenceLine
                        y={capacity * 0.5}
                        stroke="hsl(var(--success))"
                        strokeDasharray="5 5"
                        label={{ value: "50% (Low)", fontSize: 10, fill: "hsl(var(--success))" }}
                    />
                    <ReferenceLine
                        y={capacity * 0.8}
                        stroke="hsl(var(--warning))"
                        strokeDasharray="5 5"
                        label={{ value: "80% (Medium)", fontSize: 10, fill: "hsl(var(--warning))" }}
                    />
                    <ReferenceLine
                        y={capacity * 0.9}
                        stroke="hsl(var(--saffron))"
                        strokeDasharray="5 5"
                        label={{ value: "90% (High)", fontSize: 10, fill: "hsl(var(--saffron))" }}
                    />
                    <ReferenceLine
                        y={capacity}
                        stroke="hsl(var(--destructive))"
                        strokeDasharray="5 5"
                        label={{ value: "100% (Critical)", fontSize: 10, fill: "hsl(var(--destructive))" }}
                    />

                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#crowdGradient)"
                        animationDuration={isRealtime ? 300 : 1000}
                        isAnimationActive={true}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Accessible summary */}
            <div className="sr-only">
                Chart showing visitor count over the last 24 hours.
                Current count: {latestCount}.
                Maximum capacity: {capacity}.
                {isRealtime && " This chart updates in real-time."}
            </div>
        </div>
    );
}
