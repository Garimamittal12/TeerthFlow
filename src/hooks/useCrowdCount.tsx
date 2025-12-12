import { useState, useEffect, useRef, useCallback } from "react";

interface CountResponse {
    count?: number;
    // Handle different possible response formats
    [key: string]: any;
}

interface UseCrowdCountOptions {
    apiUrl: string;
    templeId: string;
    enabled?: boolean;
    pollInterval?: number; // in milliseconds
}

export function useCrowdCount({ 
    apiUrl, 
    templeId, 
    enabled = true,
    pollInterval = 5000 // Poll every 5 seconds by default
}: UseCrowdCountOptions) {
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchCount = useCallback(async () => {
        if (!enabled || templeId !== "temple_001") {
            return;
        }

        setIsLoading(true);
        setError(null);

        // Try multiple URL strategies
        const urlsToTry: string[] = [];
        
        // Add proxy URL if in development
        if (import.meta.env.DEV) {
            urlsToTry.push(`/api/count`);
        }
        
        // Add direct URL
        const directUrl = apiUrl.startsWith("http") ? apiUrl : `http://${apiUrl}`;
        urlsToTry.push(directUrl);

        let lastError: Error | null = null;

        // Try each URL until one works
        for (const url of urlsToTry) {
            try {
                console.log(`[CrowdCount] Attempting to fetch from: ${url}`);
                // Create AbortController for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
                
                const response = await fetch(url, {
                    method: "GET",
                    mode: "cors", // Explicitly set CORS mode
                    credentials: "omit", // Don't send credentials
                    headers: {
                        "Accept": "application/json, text/plain, */*",
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Try to parse as text first, then JSON
                const contentType = response.headers.get("content-type");
                let newCount: number | null = null;

                if (contentType && contentType.includes("application/json")) {
                    // Try JSON parsing
                    const data: CountResponse = await response.json();
                    newCount = typeof data === "number" 
                        ? data 
                        : data.count ?? data.Count ?? data.COUNT ?? data.value ?? data.Value ?? null;
                } else {
                    // Try text parsing (might be just a number as text)
                    const text = await response.text();
                    const parsed = parseFloat(text.trim());
                    if (!isNaN(parsed)) {
                        newCount = parsed;
                    } else {
                        // Try to parse as JSON even if content-type says otherwise
                        try {
                            const data = JSON.parse(text);
                            newCount = typeof data === "number" 
                                ? data 
                                : data.count ?? data.Count ?? data.COUNT ?? data.value ?? data.Value ?? null;
                        } catch {
                            throw new Error("Invalid response format: could not parse count");
                        }
                    }
                }

                if (newCount !== null && typeof newCount === "number" && !isNaN(newCount)) {
                    console.log(`[CrowdCount] Successfully fetched count: ${newCount} from ${url}`);
                    setCount(newCount);
                    setIsOnline(true);
                    setLastUpdated(new Date().toISOString());
                    setError(null);
                    setIsLoading(false);
                    return; // Success, exit function
                } else {
                    throw new Error("Invalid response format: count not found or invalid");
                }
            } catch (err: any) {
                lastError = err;
                console.error(`Error fetching from ${url}:`, err);
                // Continue to next URL
                continue;
            }
        }

        // If we get here, all URLs failed
        // Don't clear the count - keep the last successful value
        setIsOnline(false);
        setIsLoading(false);
        
        // Only set error if we don't have any previous count (first time failure)
        // If we have a previous count, just mark as offline but keep showing the data
        if (lastError) {
            if (lastError.name === "AbortError") {
                setError(count === null ? "Request timeout - API server may be slow or unreachable" : null);
            } else if (lastError.message?.includes("Failed to fetch") || lastError.message?.includes("NetworkError")) {
                setError(count === null ? "Network error: Unable to connect to API at 10.128.103.124. Ensure the server is running and accessible on your network." : null);
            } else if (lastError.message?.includes("CORS")) {
                setError(count === null ? "CORS error: The API server needs to allow cross-origin requests from this domain." : null);
            } else if (lastError.message) {
                setError(count === null ? lastError.message : null);
            } else {
                setError(count === null ? "Failed to fetch crowd count from API" : null);
            }
        } else {
            setError(count === null ? "Failed to connect to API server" : null);
        }
    }, [apiUrl, enabled, templeId]);

    useEffect(() => {
        if (!enabled || templeId !== "temple_001") {
            return;
        }

        // Fetch immediately
        fetchCount();

        // Set up polling interval
        intervalRef.current = setInterval(() => {
            fetchCount();
        }, pollInterval);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [apiUrl, templeId, enabled, pollInterval, fetchCount]);

    return {
        count,
        isLoading,
        isOnline,
        error,
        lastUpdated,
        refetch: fetchCount,
    };
}

