// Itinerary and ritual timing data for TeerthFlow

export interface RitualTiming {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
    priority: "must-see" | "recommended" | "optional";
}

export interface TempleLocation {
    templeId: string;
    lat: number;
    lng: number;
    ritualTimings: RitualTiming[];
    avgVisitDuration: number; // in minutes
    bestVisitTime: string;
    expectedWaitTime: number; // in minutes based on crowd
}

export interface ItineraryStop {
    id: string;
    templeId: string;
    templeName: string;
    day: number;
    arrivalTime: string;
    departureTime: string;
    selectedRitual?: RitualTiming;
    isLocked: boolean;
    travelTimeFromPrevious: number; // in minutes
    distance: number; // in km
}

export interface DayItinerary {
    day: number;
    date: string;
    stops: ItineraryStop[];
    totalTravelTime: number;
    totalDistance: number;
}

export interface Itinerary {
    id: string;
    startDate: string;
    endDate: string;
    startLocation: string;
    startCoords: { lat: number; lng: number };
    days: DayItinerary[];
    createdAt: string;
}

export interface AlternativeRecommendation {
    templeId: string;
    templeName: string;
    city: string;
    distance: number; // km from selected site
    travelTime: number; // minutes
    crowdLevel: "Low" | "Medium" | "High" | "Critical";
    currentCount: number;
    expectedWaitTime: number; // minutes
    ritualMatch: boolean;
    matchingRituals: RitualTiming[];
    score: number; // ranking score
    hasPriorityAccess: boolean;
}

// Temple locations with coordinates and ritual timings
export const templeLocations: TempleLocation[] = [
    {
        templeId: "temple_001",
        lat: 25.3109,
        lng: 83.0107,
        ritualTimings: [
            {
                name: "Mangala Aarti",
                startTime: "03:00",
                endTime: "04:00",
                description: "Early morning aarti ceremony",
                priority: "must-see",
            },
            {
                name: "Bhog Aarti",
                startTime: "11:15",
                endTime: "12:00",
                description: "Midday food offering ceremony",
                priority: "recommended",
            },
            {
                name: "Sandhya Aarti",
                startTime: "19:00",
                endTime: "19:45",
                description: "Evening aarti at sunset",
                priority: "must-see",
            },
            {
                name: "Shringar Aarti",
                startTime: "21:00",
                endTime: "21:30",
                description: "Night decoration ceremony",
                priority: "optional",
            },
        ],
        avgVisitDuration: 90,
        bestVisitTime: "Early morning (3-5 AM)",
        expectedWaitTime: 45,
    },
    {
        templeId: "temple_002",
        lat: 26.7922,
        lng: 82.1998,
        ritualTimings: [
            {
                name: "Mangala Aarti",
                startTime: "06:00",
                endTime: "06:45",
                description: "Morning aarti ceremony",
                priority: "must-see",
            },
            {
                name: "Rajbhog Aarti",
                startTime: "12:00",
                endTime: "12:30",
                description: "Royal feast offering",
                priority: "recommended",
            },
            {
                name: "Sandhya Aarti",
                startTime: "18:30",
                endTime: "19:00",
                description: "Evening prayers",
                priority: "must-see",
            },
        ],
        avgVisitDuration: 120,
        bestVisitTime: "Morning (6-8 AM)",
        expectedWaitTime: 60,
    },
    {
        templeId: "temple_003",
        lat: 26.8982,
        lng: 75.8082,
        ritualTimings: [
            {
                name: "Morning Aarti",
                startTime: "08:00",
                endTime: "08:30",
                description: "Temple opening ceremony",
                priority: "recommended",
            },
            {
                name: "Evening Aarti",
                startTime: "18:00",
                endTime: "18:30",
                description: "Sunset prayers",
                priority: "recommended",
            },
        ],
        avgVisitDuration: 45,
        bestVisitTime: "Morning (8-10 AM)",
        expectedWaitTime: 15,
    },
    {
        templeId: "temple_004",
        lat: 19.0176,
        lng: 72.8562,
        ritualTimings: [
            {
                name: "Kakad Aarti",
                startTime: "05:30",
                endTime: "06:00",
                description: "Dawn aarti ceremony",
                priority: "must-see",
            },
            {
                name: "Madhyan Aarti",
                startTime: "12:00",
                endTime: "12:30",
                description: "Midday prayers",
                priority: "optional",
            },
            {
                name: "Dhoop Aarti",
                startTime: "18:30",
                endTime: "19:00",
                description: "Evening incense ceremony",
                priority: "recommended",
            },
            {
                name: "Shej Aarti",
                startTime: "21:30",
                endTime: "22:00",
                description: "Night closing ceremony",
                priority: "optional",
            },
        ],
        avgVisitDuration: 60,
        bestVisitTime: "Early morning (5:30-7 AM)",
        expectedWaitTime: 30,
    },
    {
        templeId: "temple_005",
        lat: 20.8880,
        lng: 70.4012,
        ritualTimings: [
            {
                name: "Mangala Aarti",
                startTime: "06:00",
                endTime: "07:00",
                description: "Sunrise temple opening",
                priority: "must-see",
            },
            {
                name: "Aarti at Noon",
                startTime: "12:00",
                endTime: "12:30",
                description: "Midday prayers",
                priority: "recommended",
            },
            {
                name: "Sandhya Aarti",
                startTime: "19:00",
                endTime: "19:45",
                description: "Evening aarti with sea view",
                priority: "must-see",
            },
            {
                name: "Sound & Light Show",
                startTime: "20:00",
                endTime: "21:00",
                description: "Historical narrative show",
                priority: "recommended",
            },
        ],
        avgVisitDuration: 90,
        bestVisitTime: "Evening (6-8 PM)",
        expectedWaitTime: 20,
    },
];

// Helper function to generate temple location if not found
export const getTempleLocation = (templeId: string, cityName: string): TempleLocation | null => {
    // Check if location already exists
    const existing = templeLocations.find(l => l.templeId === templeId);
    if (existing) return existing;
    
    // Find city coordinates from majorCities
    const city = majorCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (!city) return null;
    
    // Generate a location near the city center with slight variation
    const lat = city.lat + (Math.random() - 0.5) * 0.1; // ±0.05 degrees (~5km)
    const lng = city.lng + (Math.random() - 0.5) * 0.1;
    
    // Default ritual timings
    const defaultRituals: RitualTiming[] = [
        {
            name: "Morning Aarti",
            startTime: "06:00",
            endTime: "07:00",
            description: "Morning prayer ceremony",
            priority: "must-see",
        },
        {
            name: "Afternoon Aarti",
            startTime: "12:00",
            endTime: "12:30",
            description: "Midday prayers",
            priority: "recommended",
        },
        {
            name: "Evening Aarti",
            startTime: "18:00",
            endTime: "19:00",
            description: "Evening prayer ceremony",
            priority: "must-see",
        },
    ];
    
    return {
        templeId,
        lat,
        lng,
        ritualTimings: defaultRituals,
        avgVisitDuration: 60,
        bestVisitTime: "Morning (6-8 AM)",
        expectedWaitTime: 20,
    };
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
};

// Estimate travel time (assuming avg speed 50 km/h for India)
export const estimateTravelTime = (distanceKm: number): number => {
    return Math.round(distanceKm * 1.5); // ~40 km/h average with traffic
};

// Get expected wait time based on crowd level
export const getExpectedWaitTime = (crowdLevel: string): number => {
    switch (crowdLevel) {
        case "Low":
            return 10;
        case "Medium":
            return 25;
        case "High":
            return 45;
        case "Critical":
            return 90;
        default:
            return 20;
    }
};

// Major cities in India for start location (including cities with pilgrimage sites)
export const majorCities = [
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    // Cities with pilgrimage sites
    { name: "Ayodhya", lat: 26.7922, lng: 82.1998 },
    { name: "Mathura", lat: 27.4924, lng: 77.6737 },
    { name: "Vrindavan", lat: 27.5706, lng: 77.7000 },
    { name: "Tirupati", lat: 13.6288, lng: 79.4192 },
    { name: "Srikalahasti", lat: 13.7500, lng: 79.7000 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
    { name: "Madurai", lat: 9.9252, lng: 78.1198 },
    { name: "Rameswaram", lat: 9.2881, lng: 79.3129 },
    { name: "Thanjavur", lat: 10.7867, lng: 79.1378 },
    { name: "Palani", lat: 10.4500, lng: 77.5200 },
    { name: "Puri", lat: 19.8135, lng: 85.8315 },
    { name: "Konark", lat: 19.8876, lng: 86.0945 },
    { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { name: "Kedarnath", lat: 30.7353, lng: 79.0669 },
    { name: "Badrinath", lat: 30.7448, lng: 79.4932 },
    { name: "Gangotri", lat: 30.9944, lng: 78.9403 },
    { name: "Yamunotri", lat: 31.0150, lng: 78.4600 },
    { name: "Haridwar", lat: 29.9457, lng: 78.1642 },
    { name: "Katra", lat: 32.9915, lng: 74.9318 },
    { name: "Pahalgam", lat: 34.0151, lng: 75.3188 },
    { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
    { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
    { name: "Anandpur Sahib", lat: 31.2350, lng: 76.5000 },
    { name: "Dwarka", lat: 22.2403, lng: 68.9686 },
    { name: "Veraval", lat: 20.8880, lng: 70.4012 },
    { name: "Shirdi", lat: 19.7610, lng: 74.4770 },
];
