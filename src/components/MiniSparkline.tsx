import { useMemo } from "react";

interface MiniSparklineProps {
    data: number[];
    crowdLevel: "Low" | "Medium" | "High" | "Critical";
    className?: string;
}

const crowdColors = {
    Low: "#22c55e",
    Medium: "#eab308",
    High: "#FF6B35",
    Critical: "#ef4444",
};

export function MiniSparkline({ data, crowdLevel, className }: MiniSparklineProps) {
    const pathData = useMemo(() => {
        if (data.length < 2) return "";

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const width = 100;
        const height = 32;
        const padding = 2;

        const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        });

        return `M ${points.join(" L ")}`;
    }, [data]);

    const areaPath = useMemo(() => {
        if (data.length < 2) return "";

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const width = 100;
        const height = 32;
        const padding = 2;

        const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        });

        return `M ${padding},${height - padding} L ${points.join(" L ")} L ${100 - padding},${height - padding} Z`;
    }, [data]);

    const color = crowdColors[crowdLevel];

    return (
        <svg
            viewBox="0 0 100 32"
            className={className}
            preserveAspectRatio="none"
            aria-hidden="true"
            role="img"
            aria-label={`Crowd trend chart showing ${crowdLevel} levels`}
        >
            <defs>
                <linearGradient id={`gradient-${crowdLevel}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>

            <path
                d={areaPath}
                fill={`url(#gradient-${crowdLevel})`}
            />

            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Current value dot */}
            {data.length > 0 && (
                <circle
                    cx={100 - 2}
                    cy={32 - 2 - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * (32 - 4)}
                    r="3"
                    fill={color}
                    className="animate-pulse-soft"
                />
            )}
        </svg>
    );
}
