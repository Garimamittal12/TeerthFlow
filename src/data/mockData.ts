// Mock data for TeerthFlow

export interface State {
    id: string;
    name: string;
    templeCount: number;
    image: string;
    description: string;
    featured: boolean;
}

export interface Temple {
    id: string;
    name: string;
    stateId: string;
    city: string;
    category: string;
    established: string;
    description: string;
    deity: string;
    architecture: string;
    timings: string;
    festivals: string[];
    images: string[];
    totalCapacity: number;
    deviceId: string;
}

export interface Device {
    id: string;
    templeId: string;
    isConnected: boolean;
    lastPing: string;
    signalStrength: "Excellent" | "Good" | "Fair" | "Poor";
}

export interface CrowdData {
    templeId: string;
    currentCount: number;
    crowdLevel: "Low" | "Medium" | "High" | "Extreme";
    nextHourPrediction: number;
    lastUpdated: string;
    history: { time: string; count: number }[];
}

// Threshold configuration
export const CROWD_THRESHOLDS = {
    low: 50,
    medium: 150,
    high: 250,
    extreme: 400,
};

export const getCrowdLevel = (count: number): CrowdData["crowdLevel"] => {
    if (count < CROWD_THRESHOLDS.low) return "Low";
    if (count < CROWD_THRESHOLDS.medium) return "Medium";
    if (count < CROWD_THRESHOLDS.high) return "High";
    return "Extreme";
};

// States data
export const states: State[] = [
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        templeCount: 12,
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
        description: "Land of sacred rivers and ancient temples including Kashi Vishwanath",
        featured: true,
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        templeCount: 8,
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        description: "Royal state with magnificent temple architecture and rich heritage",
        featured: true,
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        templeCount: 15,
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
        description: "Home to Shirdi Sai Baba Temple and Siddhivinayak",
        featured: true,
    },
    {
        id: "gujarat",
        name: "Gujarat",
        templeCount: 10,
        image: "https://images.unsplash.com/photo-1621427642826-e92c2dca668e?w=800&q=80",
        description: "Spiritual land of Somnath and Dwarka temples",
        featured: true,
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        templeCount: 20,
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
        description: "Temple state with spectacular Dravidian architecture",
        featured: false,
    },
    {
        id: "karnataka",
        name: "Karnataka",
        templeCount: 14,
        image: "https://images.unsplash.com/photo-1590766940554-634f82dde4c7?w=800&q=80",
        description: "Land of Hampi ruins and ancient temple complexes",
        featured: false,
    },
];

// Temples data
export const temples: Temple[] = [
    {
        id: "temple_001",
        name: "Kashi Vishwanath Temple",
        stateId: "uttar-pradesh",
        city: "Varanasi",
        category: "Shiva",
        established: "1780 CE (current structure)",
        description: "One of the most famous Hindu temples dedicated to Lord Shiva, located on the western bank of the holy river Ganga. It is one of the twelve Jyotirlingas and is considered to be the holiest of all Shiva temples.",
        deity: "Lord Shiva (Jyotirlinga)",
        architecture: "Nagara style with gold-plated spire",
        timings: "3:00 AM - 11:00 PM",
        festivals: ["Maha Shivaratri", "Dev Deepawali", "Kartik Purnima"],
        images: [
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
            "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80",
        ],
        totalCapacity: 500,
        deviceId: "device_001",
    },
    {
        id: "temple_002",
        name: "Ayodhya Ram Mandir",
        stateId: "uttar-pradesh",
        city: "Ayodhya",
        category: "Vishnu",
        established: "2024 CE",
        description: "The Ram Janmabhoomi temple marks the birthplace of Lord Rama. The newly constructed grand temple is a symbol of faith and devotion.",
        deity: "Lord Rama",
        architecture: "Nagara style with three floors",
        timings: "7:00 AM - 11:00 AM, 2:00 PM - 7:00 PM",
        festivals: ["Ram Navami", "Diwali", "Vivah Panchami"],
        images: [
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
        ],
        totalCapacity: 1000,
        deviceId: "device_002",
    },
    {
        id: "temple_003",
        name: "Birla Mandir",
        stateId: "rajasthan",
        city: "Jaipur",
        category: "Lakshmi-Narayan",
        established: "1988 CE",
        description: "A beautiful Hindu temple dedicated to Lord Vishnu and Goddess Lakshmi, made entirely of white marble.",
        deity: "Lakshmi-Narayan",
        architecture: "Modern temple with white marble",
        timings: "8:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
        festivals: ["Janmashtami", "Diwali", "Ekadashi"],
        images: [
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        ],
        totalCapacity: 300,
        deviceId: "device_003",
    },
    {
        id: "temple_004",
        name: "Siddhivinayak Temple",
        stateId: "maharashtra",
        city: "Mumbai",
        category: "Ganesha",
        established: "1801 CE",
        description: "One of the richest and most visited Ganesh temples in Mumbai, known for wish fulfillment.",
        deity: "Lord Ganesha",
        architecture: "Dome-shaped with gold plating",
        timings: "5:30 AM - 10:00 PM",
        festivals: ["Ganesh Chaturthi", "Maghi Ganesh Jayanti", "Sankashti Chaturthi"],
        images: [
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
        ],
        totalCapacity: 400,
        deviceId: "device_004",
    },
    {
        id: "temple_005",
        name: "Somnath Temple",
        stateId: "gujarat",
        city: "Veraval",
        category: "Shiva",
        established: "1951 CE (current structure)",
        description: "First among the twelve Jyotirlingas, believed to have been created by the Moon God. Rebuilt multiple times throughout history.",
        deity: "Lord Shiva (Jyotirlinga)",
        architecture: "Chalukya style of architecture",
        timings: "6:00 AM - 9:30 PM",
        festivals: ["Maha Shivaratri", "Kartik Purnima", "Shravan"],
        images: [
            "https://images.unsplash.com/photo-1621427642826-e92c2dca668e?w=800&q=80",
        ],
        totalCapacity: 600,
        deviceId: "device_005",
    },
];

// Devices data
export const devices: Device[] = [
    {
        id: "device_001",
        templeId: "temple_001",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_002",
        templeId: "temple_002",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_003",
        templeId: "temple_003",
        isConnected: false,
        lastPing: new Date(Date.now() - 3600000).toISOString(),
        signalStrength: "Poor",
    },
    {
        id: "device_004",
        templeId: "temple_004",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_005",
        templeId: "temple_005",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
];

// Generate historical data for crowd
const generateHistory = (baseCount: number): { time: string; count: number }[] => {
    const history = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        const variation = Math.floor(Math.random() * 100) - 50;
        const count = Math.max(0, baseCount + variation);
        history.push({
            time: time.toISOString(),
            count,
        });
    }

    return history;
};

// Crowd data
export const crowdData: CrowdData[] = [
    {
        templeId: "temple_001",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    {
        templeId: "temple_002",
        currentCount: 450,
        crowdLevel: "Extreme",
        nextHourPrediction: 480,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(450),
    },
    {
        templeId: "temple_003",
        currentCount: 45,
        crowdLevel: "Low",
        nextHourPrediction: 60,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(45),
    },
    {
        templeId: "temple_004",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 200,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
    },
    {
        templeId: "temple_005",
        currentCount: 120,
        crowdLevel: "Medium",
        nextHourPrediction: 150,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(120),
    },
];

// API simulation functions
export const getStates = (): Promise<State[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(states), 300);
    });
};

export const getStateById = (stateId: string): Promise<State | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(states.find((s) => s.id === stateId)), 200);
    });
};

export const getTemplesByState = (stateId: string): Promise<Temple[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(temples.filter((t) => t.stateId === stateId)), 300);
    });
};

export const getTempleById = (templeId: string): Promise<Temple | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(temples.find((t) => t.id === templeId)), 200);
    });
};

export const getDeviceById = (deviceId: string): Promise<Device | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(devices.find((d) => d.id === deviceId)), 200);
    });
};

export const getCrowdDataByTemple = (templeId: string): Promise<CrowdData | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(crowdData.find((c) => c.templeId === templeId)), 200);
    });
};
