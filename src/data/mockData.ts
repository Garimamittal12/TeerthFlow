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
        image: "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        description: "Land of sacred rivers and ancient temples including Kashi Vishwanath",
        featured: true,
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        templeCount: 1, // Birla Mandir
        image: "https://i.pinimg.com/1200x/30/82/55/30825546fde839827ddd5b7d5c9f6f30.jpg",
        description: "Royal state with magnificent temple architecture and rich heritage",
        featured: true,
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        templeCount: 1, // Siddhivinayak Temple
        image: "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
        description: "Home to Shirdi Sai Baba Temple and Siddhivinayak",
        featured: true,
    },
    {
        id: "gujarat",
        name: "Gujarat",
        templeCount: 1, // Somnath Temple
        image: "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
        description: "Spiritual land of Somnath and Dwarka temples",
        featured: true,
    },
    // Additional Indian states (with generic counts for now)
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        description: "Coastal state known for Tirupati Balaji and ancient seaports",
        featured: false,
    },
    {
        id: "arunachal-pradesh",
        name: "Arunachal Pradesh",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/ce/d3/9c/ced39c687e79ce55677bf4fd9db0df1a.jpg",
        description: "Land of the rising sun with serene monasteries and valleys",
        featured: false,
    },
    {
        id: "assam",
        name: "Assam",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/ea/00/1f/ea001fae9640b4c3770513db52e62a27.jpg",
        description: "Home to Kamakhya Temple and lush tea gardens",
        featured: false,
    },
    {
        id: "bihar",
        name: "Bihar",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/6b/d9/2b/6bd92b1c1f393ae82c1ddb46eb9ddbee.jpg",
        description: "Spiritual land of Bodh Gaya and ancient universities",
        featured: false,
    },
    {
        id: "chhattisgarh",
        name: "Chhattisgarh",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/0e/e0/ca/0ee0ca8b7c4137f371bd41331f0117d7.jpg",
        description: "State of dense forests, waterfalls and folk traditions",
        featured: false,
    },
    {
        id: "goa",
        name: "Goa",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/94/ec/19/94ec194f14f6dfa5c55163d57aa79c01.jpg",
        description: "Coastal paradise with temples and churches by the sea",
        featured: false,
    },
    {
        id: "haryana",
        name: "Haryana",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/bb/2b/34/bb2b34430b5280e5e133cbd273d329c2.jpg",
        description: "Historic land of Kurukshetra and ancient tirthas",
        featured: false,
    },
    {
        id: "himachal-pradesh",
        name: "Himachal Pradesh",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/55/d1/e6/55d1e657a1cb2330e15c030abea11069.jpg",
        description: "Dev Bhoomi with hill temples and Himalayan shrines",
        featured: false,
    },
    {
        id: "jharkhand",
        name: "Jharkhand",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/51/28/cf/5128cfb0d239542660dae651e74f260a.jpg",
        description: "State of forests, waterfalls and the Baidyanath Jyotirlinga",
        featured: false,
    },
    {
        id: "karnataka",
        name: "Karnataka",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/1c/94/ad/1c94ad6058ea0202ca69f2b75e356e1e.jpg",
        description: "Rich in temple architecture from Hampi to Udupi",
        featured: false,
    },
    {
        id: "kerala",
        name: "Kerala",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/60/51/fc/6051fc0b6b87c9c265b34669e0f06018.jpg",
        description: "God’s Own Country with famous temples like Sabarimala and Guruvayur",
        featured: false,
    },
    {
        id: "madhya-pradesh",
        name: "Madhya Pradesh",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/69/fd/ab/69fdabada964627c691ce8eb04ea8b32.jpg",
        description: "Heart of India with Khajuraho and Mahakaleshwar Jyotirlinga",
        featured: false,
    },
    {
        id: "manipur",
        name: "Manipur",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/72/fb/7e/72fb7e90996168f8a553dc9d03f72138.jpg",
        description: "Northeastern state with serene lakes and Vaishnavite temples",
        featured: false,
    },
    {
        id: "meghalaya",
        name: "Meghalaya",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/f5/82/43/f58243b7ef9172105eb6b062e4b74dea.jpg",
        description: "Abode of clouds with sacred groves and waterfalls",
        featured: false,
    },
    {
        id: "mizoram",
        name: "Mizoram",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/af/27/d5/af27d5b34c956e3242c4e0efbcc887fb.jpg",
        description: "Scenic hills and valleys with vibrant cultural traditions",
        featured: false,
    },
    {
        id: "nagaland",
        name: "Nagaland",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/62/a9/81/62a981660d30b24786192341218b4acd.jpg",
        description: "Hill state known for rich tribal heritage and festivals",
        featured: false,
    },
    {
        id: "odisha",
        name: "Odisha",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        description: "Sacred land of Jagannath Puri and Sun Temple Konark",
        featured: false,
    },
    {
        id: "punjab",
        name: "Punjab",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
        description: "Land of the Golden Temple and vibrant spiritual traditions",
        featured: false,
    },
    {
        id: "sikkim",
        name: "Sikkim",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/7a/d3/d1/7ad3d1a599f4020600d62402576e2b8d.jpg",
        description: "Himalayan state with monasteries and serene mountain vistas",
        featured: false,
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        description: "Temple-rich state with Dravidian architecture from Madurai to Rameswaram",
        featured: false,
    },
    {
        id: "telangana",
        name: "Telangana",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/7a/d3/d1/7ad3d1a599f4020600d62402576e2b8d.jpg",
        description: "Home to Yadadri, Bhadrachalam and rich Kakatiya heritage",
        featured: false,
    },
    {
        id: "tripura",
        name: "Tripura",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/95/02/e0/9502e048792f2e826883710cf4e9432f.jpg",
        description: "Northeastern state with ancient Tripura Sundari temple",
        featured: false,
    },
    {
        id: "uttarakhand",
        name: "Uttarakhand",
        templeCount: 0,
        image: "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        description: "Dev Bhoomi with Char Dham and many Himalayan tirthas",
        featured: false,
    },
    {
        id: "west-bengal",
        name: "West Bengal",
        templeCount: 0,
        image: "https://i.pinimg.com/736x/c9/cf/3c/c9cf3cb5182c6067033924e3277d1c5e.jpg",
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
            "https://i.pinimg.com/736x/bf/60/88/bf60886c58e4ffd17540c7f8e4f5d583.jpg"
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
            "https://i.pinimg.com/736x/2d/82/fa/2d82fae369abadedee0718ed36e1b2d5.jpg",
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
            "https://i.pinimg.com/1200x/24/d1/a8/24d1a869623c959cc25c977f9f19e379.jpg",
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
            "https://i.pinimg.com/736x/38/ee/8c/38ee8ca48a55456f405ea4da82c63a4e.jpg",
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
            "https://i.pinimg.com/736x/38/ee/8c/38ee8ca48a55456f405ea4da82c63a4e.jpg",
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
