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

// States data - templeCount reflects actual temples in the temples array
export const states: State[] = [
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        templeCount: 2, // Kashi Vishwanath, Ayodhya Ram Mandir
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
        description: "Land of sacred rivers and ancient temples including Kashi Vishwanath",
        featured: true,
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        templeCount: 1, // Birla Mandir
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        description: "Royal state with magnificent temple architecture and rich heritage",
        featured: true,
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        templeCount: 1, // Siddhivinayak Temple
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
        description: "Home to Shirdi Sai Baba Temple and Siddhivinayak",
        featured: true,
    },
    {
        id: "gujarat",
        name: "Gujarat",
        templeCount: 1, // Somnath Temple
        image: "https://images.unsplash.com/photo-1621427642826-e92c2dca668e?w=800&q=80",
        description: "Spiritual land of Somnath and Dwarka temples",
        featured: true,
    },
    // Additional Indian states (with generic counts for now)
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800&q=80",
        description: "Coastal state known for Tirupati Balaji and ancient seaports",
        featured: false,
    },
    {
        id: "arunachal-pradesh",
        name: "Arunachal Pradesh",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1601379329542-058a8805daa7?w=800&q=80",
        description: "Land of the rising sun with serene monasteries and valleys",
        featured: false,
    },
    {
        id: "assam",
        name: "Assam",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1619726079028-4e269f5d4e97?w=800&q=80",
        description: "Home to Kamakhya Temple and lush tea gardens",
        featured: false,
    },
    {
        id: "bihar",
        name: "Bihar",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1583054994298-cc68ddaca862?w=800&q=80",
        description: "Spiritual land of Bodh Gaya and ancient universities",
        featured: false,
    },
    {
        id: "chhattisgarh",
        name: "Chhattisgarh",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603267667299-f9ebe83c7e9b?w=800&q=80",
        description: "State of dense forests, waterfalls and folk traditions",
        featured: false,
    },
    {
        id: "goa",
        name: "Goa",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f5?w=800&q=80",
        description: "Coastal paradise with temples and churches by the sea",
        featured: false,
    },
    {
        id: "haryana",
        name: "Haryana",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1535576431023-9b96c0a7e230?w=800&q=80",
        description: "Historic land of Kurukshetra and ancient tirthas",
        featured: false,
    },
    {
        id: "himachal-pradesh",
        name: "Himachal Pradesh",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
        description: "Dev Bhoomi with hill temples and Himalayan shrines",
        featured: false,
    },
    {
        id: "jharkhand",
        name: "Jharkhand",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1549213821-077d3a6e8e4a?w=800&q=80",
        description: "State of forests, waterfalls and the Baidyanath Jyotirlinga",
        featured: false,
    },
    {
        id: "karnataka",
        name: "Karnataka",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1583397869582-04e4143b9d3a?w=800&q=80",
        description: "Rich in temple architecture from Hampi to Udupi",
        featured: false,
    },
    {
        id: "kerala",
        name: "Kerala",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&q=80",
        description: "God’s Own Country with famous temples like Sabarimala and Guruvayur",
        featured: false,
    },
    {
        id: "madhya-pradesh",
        name: "Madhya Pradesh",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603268814614-83c635b5c2b5?w=800&q=80",
        description: "Heart of India with Khajuraho and Mahakaleshwar Jyotirlinga",
        featured: false,
    },
    {
        id: "manipur",
        name: "Manipur",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1604815755514-9b4c5b3b5bea?w=800&q=80",
        description: "Northeastern state with serene lakes and Vaishnavite temples",
        featured: false,
    },
    {
        id: "meghalaya",
        name: "Meghalaya",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&q=80",
        description: "Abode of clouds with sacred groves and waterfalls",
        featured: false,
    },
    {
        id: "mizoram",
        name: "Mizoram",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&q=80",
        description: "Scenic hills and valleys with vibrant cultural traditions",
        featured: false,
    },
    {
        id: "nagaland",
        name: "Nagaland",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603267667299-f9ebe83c7e9b?w=800&q=80",
        description: "Hill state known for rich tribal heritage and festivals",
        featured: false,
    },
    {
        id: "odisha",
        name: "Odisha",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603268221664-5e3cc3c0a60a?w=800&q=80",
        description: "Sacred land of Jagannath Puri and Sun Temple Konark",
        featured: false,
    },
    {
        id: "punjab",
        name: "Punjab",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&q=80",
        description: "Land of the Golden Temple and vibrant spiritual traditions",
        featured: false,
    },
    {
        id: "sikkim",
        name: "Sikkim",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1611162458324-df891c7ba1a9?w=800&q=80",
        description: "Himalayan state with monasteries and serene mountain vistas",
        featured: false,
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1593757147298-e064ed1419b8?w=800&q=80",
        description: "Temple-rich state with Dravidian architecture from Madurai to Rameswaram",
        featured: false,
    },
    {
        id: "telangana",
        name: "Telangana",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1603268221664-5e3cc3c0a60a?w=800&q=80",
        description: "Home to Yadadri, Bhadrachalam and rich Kakatiya heritage",
        featured: false,
    },
    {
        id: "tripura",
        name: "Tripura",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1601379329542-058a8805daa7?w=800&q=80",
        description: "Northeastern state with ancient Tripura Sundari temple",
        featured: false,
    },
    {
        id: "uttarakhand",
        name: "Uttarakhand",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
        description: "Dev Bhoomi with Char Dham and many Himalayan tirthas",
        featured: false,
    },
    {
        id: "west-bengal",
        name: "West Bengal",
        templeCount: 0,
        image: "https://images.unsplash.com/photo-1524498250077-390f9e378fcf?w=800&q=80",
        description: "Land of Dakshineswar, Kalighat and rich spiritual movements",
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

// Generate historical data for crowd - ensures last point matches currentCount
const generateHistory = (currentCount: number): { time: string; count: number }[] => {
    const history = [];
    const now = new Date();

    // Generate 23 hours of history with variations
    for (let i = 23; i >= 1; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        const variation = Math.floor(Math.random() * 100) - 50;
        const count = Math.max(0, currentCount + variation);
        history.push({
            time: time.toISOString(),
            count,
        });
    }

    // Add current point as the last entry to sync with currentCount
    history.push({
        time: now.toISOString(),
        count: currentCount,
    });

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
