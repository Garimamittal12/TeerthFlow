import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("skeleton animate-pulse", className)}
            aria-hidden="true"
        />
    );
}

export function StateCardSkeleton() {
    return (
        <div className="card-elevated overflow-hidden">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
        </div>
    );
}

export function TempleCardSkeleton() {
    return (
        <div className="card-elevated overflow-hidden">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
        </div>
    );
}
