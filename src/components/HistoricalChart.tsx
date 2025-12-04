import { useMemo } from "react";
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
import { CROWD_THRESHOLDS } from "@/data/mockData";

interface HistoricalChartProps {
    data: { time: string; count: number }[];
    capacity: number;
}

export function HistoricalChart({ data, capacity }: HistoricalChartProps) {
    const chartData = useMemo(() => {
        return data.map((item) => ({
            ...item,
            time: new Date(item.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const count = payload[0].value;
            let level = "Low";
            if (count >= CROWD_THRESHOLDS.extreme) level = "Extreme";
            else if (count >= CROWD_THRESHOLDS.high) level = "High";
            else if (count >= CROWD_THRESHOLDS.medium) level = "Medium";

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

    return (
        <div className="w-full h-72" role="img" aria-label="Historical crowd data chart">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="crowdGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(18, 100%, 60%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(18, 100%, 60%)" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(214, 32%, 91%)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
                        tickLine={false}
                        axisLine={{ stroke: "hsl(214, 32%, 91%)" }}
                        interval="preserveStartEnd"
                    />

                    <YAxis
                        tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Threshold lines */}
                    <ReferenceLine
                        y={CROWD_THRESHOLDS.medium}
                        stroke="hsl(43, 100%, 50%)"
                        strokeDasharray="5 5"
                        label={{ value: "Medium", fontSize: 10, fill: "hsl(43, 100%, 50%)" }}
                    />
                    <ReferenceLine
                        y={CROWD_THRESHOLDS.high}
                        stroke="hsl(18, 100%, 60%)"
                        strokeDasharray="5 5"
                        label={{ value: "High", fontSize: 10, fill: "hsl(18, 100%, 60%)" }}
                    />
                    <ReferenceLine
                        y={capacity}
                        stroke="hsl(0, 84%, 60%)"
                        strokeDasharray="5 5"
                        label={{ value: "Capacity", fontSize: 10, fill: "hsl(0, 84%, 60%)" }}
                    />

                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(18, 100%, 60%)"
                        strokeWidth={2}
                        fill="url(#crowdGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Accessible summary */}
            <div className="sr-only">
                Chart showing visitor count over the last 24 hours.
                Current count: {chartData[chartData.length - 1]?.count ?? 0}.
                Maximum capacity: {capacity}.
            </div>
        </div>
    );
}
