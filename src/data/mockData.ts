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
    crowdLevel: "Low" | "Medium" | "High" | "Critical";
    nextHourPrediction: number;
    lastUpdated: string;
    history: { time: string; count: number }[];
}

// Threshold configuration based on percentage of capacity
// 0-50% = Low, 51-80% = Medium, 81-90% = High, 91-100% = Critical
export const getCrowdLevel = (count: number, capacity: number): CrowdData["crowdLevel"] => {
    if (capacity === 0) return "Low"; // Safety check
    const percentage = (count / capacity) * 100;
    
    if (percentage <= 50) return "Low";
    if (percentage <= 80) return "Medium";
    if (percentage <= 90) return "High";
    return "Critical";
};

// States data - templeCount will be updated after temples array is defined
export const states: State[] = [
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        description: "Land of sacred rivers and ancient temples including Kashi Vishwanath",
        featured: true,
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/30/82/55/30825546fde839827ddd5b7d5c9f6f30.jpg",
        description: "Royal state with magnificent temple architecture and rich heritage",
        featured: true,
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
        description: "Home to Shirdi Sai Baba Temple and Siddhivinayak",
        featured: true,
    },
    {
        id: "gujarat",
        name: "Gujarat",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
        description: "Spiritual land of Somnath and Dwarka temples",
        featured: true,
    },
    // Additional Indian states (with generic counts for now)
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        description: "Coastal state known for Tirupati Balaji and ancient seaports",
        featured: true,
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
        id: "jammu-kashmir",
        name: "Jammu & Kashmir",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        description: "Paradise on Earth with Vaishno Devi and Amarnath Cave",
        featured: true,
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
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        description: "Sacred land of Jagannath Puri and Sun Temple Konark",
        featured: true,
    },
    {
        id: "punjab",
        name: "Punjab",
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
        description: "Land of the Golden Temple and vibrant spiritual traditions",
        featured: true,
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
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        description: "Temple-rich state with Dravidian architecture from Madurai to Rameswaram",
        featured: true,
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
        templeCount: 0, // Will be updated automatically
        image: "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        description: "Dev Bhoomi with Char Dham and many Himalayan tirthas",
        featured: true,
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
    // Andhra Pradesh Temples
    {
        id: "temple_006",
        name: "Tirumala Venkateswara Temple",
        stateId: "andhra-pradesh",
        city: "Tirupati",
        category: "Vishnu",
        established: "300 CE",
        description: "One of the richest and most visited temples in the world, dedicated to Lord Venkateswara. Located on the Tirumala hills, it attracts millions of devotees annually.",
        deity: "Lord Venkateswara (Balaji)",
        architecture: "Dravidian style with gopurams",
        timings: "2:30 AM - 1:00 AM (next day)",
        festivals: ["Brahmotsavam", "Vaikunta Ekadashi", "Rathasapthami"],
        images: [
            "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        ],
        totalCapacity: 2000,
        deviceId: "device_006",
    },
    {
        id: "temple_007",
        name: "Srikalahasti Temple",
        stateId: "andhra-pradesh",
        city: "Srikalahasti",
        category: "Shiva",
        established: "5th century CE",
        description: "Ancient temple dedicated to Lord Shiva, one of the Pancha Bhoota Sthalams representing the element of Vayu (air).",
        deity: "Lord Shiva (Vayu Linga)",
        architecture: "Dravidian architecture",
        timings: "6:00 AM - 9:00 PM",
        festivals: ["Maha Shivaratri", "Karthika Deepam", "Arudra Darshanam"],
        images: [
            "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        ],
        totalCapacity: 800,
        deviceId: "device_007",
    },
    {
        id: "temple_008",
        name: "Kanaka Durga Temple",
        stateId: "andhra-pradesh",
        city: "Vijayawada",
        category: "Lakshmi-Narayan",
        established: "8th century CE",
        description: "Famous temple dedicated to Goddess Kanaka Durga, located on Indrakeeladri hill overlooking the Krishna River.",
        deity: "Goddess Kanaka Durga",
        architecture: "Dravidian style",
        timings: "4:00 AM - 9:00 PM",
        festivals: ["Navaratri", "Dussehra", "Vijayadashami"],
        images: [
            "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        ],
        totalCapacity: 1200,
        deviceId: "device_008",
    },
    // Tamil Nadu Temples
    {
        id: "temple_009",
        name: "Meenakshi Amman Temple",
        stateId: "tamil-nadu",
        city: "Madurai",
        category: "Shiva",
        established: "6th century CE",
        description: "Historic temple complex dedicated to Goddess Meenakshi and Lord Sundareswarar. Famous for its stunning architecture and 14 gopurams.",
        deity: "Goddess Meenakshi & Lord Sundareswarar",
        architecture: "Dravidian architecture with 14 gopurams",
        timings: "5:00 AM - 12:30 PM, 4:00 PM - 9:30 PM",
        festivals: ["Meenakshi Thirukalyanam", "Chithirai Festival", "Navaratri"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 1500,
        deviceId: "device_009",
    },
    {
        id: "temple_010",
        name: "Ramanathaswamy Temple",
        stateId: "tamil-nadu",
        city: "Rameswaram",
        category: "Shiva",
        established: "12th century CE",
        description: "One of the twelve Jyotirlingas and one of the Char Dham pilgrimage sites. Famous for its long corridors and sacred water tanks.",
        deity: "Lord Shiva (Jyotirlinga)",
        architecture: "Dravidian style with longest temple corridors",
        timings: "5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        festivals: ["Maha Shivaratri", "Thirukalyanam", "Arudra Darshanam"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 1000,
        deviceId: "device_010",
    },
    {
        id: "temple_011",
        name: "Brihadeeswarar Temple",
        stateId: "tamil-nadu",
        city: "Thanjavur",
        category: "Shiva",
        established: "1010 CE",
        description: "UNESCO World Heritage Site, also known as the Big Temple. Built by Raja Raja Chola I, it's a masterpiece of Chola architecture.",
        deity: "Lord Shiva (Peruvudaiyar Kovil)",
        architecture: "Chola architecture with 216 ft vimana",
        timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
        festivals: ["Maha Shivaratri", "Aani Thirumanjanam", "Panguni Uthiram"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 900,
        deviceId: "device_011",
    },
    {
        id: "temple_012",
        name: "Murugan Temple",
        stateId: "tamil-nadu",
        city: "Palani",
        category: "Ganesha",
        established: "3rd century CE",
        description: "One of the six abodes of Lord Murugan (Arupadaiveedu), located on Palani hills. Famous for the Dhandayuthapani Swamy temple.",
        deity: "Lord Murugan (Dhandayuthapani)",
        architecture: "Dravidian style on hilltop",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Thaipusam", "Panguni Uthiram", "Kanda Shasti"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 700,
        deviceId: "device_012",
    },
    // Odisha Temples
    {
        id: "temple_013",
        name: "Jagannath Temple",
        stateId: "odisha",
        city: "Puri",
        category: "Vishnu",
        established: "12th century CE",
        description: "One of the Char Dham pilgrimage sites. Famous for the annual Rath Yatra festival where the deities are taken in grand chariots.",
        deity: "Lord Jagannath, Balabhadra, Subhadra",
        architecture: "Kalinga architecture",
        timings: "5:00 AM - 11:00 PM",
        festivals: ["Rath Yatra", "Snana Yatra", "Nabakalebara"],
        images: [
            "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        ],
        totalCapacity: 1800,
        deviceId: "device_013",
    },
    {
        id: "temple_014",
        name: "Konark Sun Temple",
        stateId: "odisha",
        city: "Konark",
        category: "Vishnu",
        established: "13th century CE",
        description: "UNESCO World Heritage Site, also known as the Black Pagoda. Built in the shape of a giant chariot dedicated to the Sun God.",
        deity: "Lord Surya (Sun God)",
        architecture: "Kalinga architecture, chariot-shaped",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Chandrabhaga Mela", "Magha Saptami", "Ratha Saptami"],
        images: [
            "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        ],
        totalCapacity: 600,
        deviceId: "device_014",
    },
    {
        id: "temple_015",
        name: "Lingaraj Temple",
        stateId: "odisha",
        city: "Bhubaneswar",
        category: "Shiva",
        established: "11th century CE",
        description: "One of the oldest and largest temples in Bhubaneswar, dedicated to Lord Shiva. A masterpiece of Kalinga architecture.",
        deity: "Lord Shiva (Lingaraj)",
        architecture: "Kalinga architecture with 180 ft tower",
        timings: "5:00 AM - 9:00 PM",
        festivals: ["Maha Shivaratri", "Ashokashtami", "Shivaratri"],
        images: [
            "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        ],
        totalCapacity: 1000,
        deviceId: "device_015",
    },
    // Uttarakhand Temples
    {
        id: "temple_016",
        name: "Kedarnath Temple",
        stateId: "uttarakhand",
        city: "Kedarnath",
        category: "Shiva",
        established: "8th century CE",
        description: "One of the twelve Jyotirlingas and part of the Char Dham. Located at 3,583 meters above sea level in the Himalayas.",
        deity: "Lord Shiva (Jyotirlinga)",
        architecture: "Stone architecture, Himalayan style",
        timings: "4:00 AM - 7:00 PM (seasonal)",
        festivals: ["Maha Shivaratri", "Kedarnath Yatra", "Shravan"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_016",
    },
    {
        id: "temple_017",
        name: "Badrinath Temple",
        stateId: "uttarakhand",
        city: "Badrinath",
        category: "Vishnu",
        established: "9th century CE",
        description: "One of the Char Dham and one of the 108 Divya Desams. Dedicated to Lord Badrinath (Vishnu), located in the Garhwal Himalayas.",
        deity: "Lord Badrinath (Vishnu)",
        architecture: "North Indian architecture",
        timings: "4:30 AM - 1:00 PM, 3:00 PM - 9:00 PM (seasonal)",
        festivals: ["Badri-Kedar Festival", "Mata Murti Ka Mela", "Janmashtami"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 800,
        deviceId: "device_017",
    },
    {
        id: "temple_018",
        name: "Gangotri Temple",
        stateId: "uttarakhand",
        city: "Gangotri",
        category: "Shiva",
        established: "18th century CE",
        description: "Part of the Char Dham, located at the source of the Ganges River. The temple is dedicated to Goddess Ganga.",
        deity: "Goddess Ganga",
        architecture: "Himalayan architecture",
        timings: "6:00 AM - 2:00 PM, 3:00 PM - 9:30 PM (seasonal)",
        festivals: ["Ganga Dussehra", "Akshaya Tritiya", "Diwali"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 400,
        deviceId: "device_018",
    },
    {
        id: "temple_019",
        name: "Yamunotri Temple",
        stateId: "uttarakhand",
        city: "Yamunotri",
        category: "Shiva",
        established: "19th century CE",
        description: "Part of the Char Dham, located at the source of the Yamuna River. The temple is dedicated to Goddess Yamuna.",
        deity: "Goddess Yamuna",
        architecture: "Himalayan architecture",
        timings: "6:00 AM - 8:00 PM (seasonal)",
        festivals: ["Yamuna Jayanti", "Akshaya Tritiya", "Diwali"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 350,
        deviceId: "device_019",
    },
    {
        id: "temple_020",
        name: "Haridwar Har Ki Pauri",
        stateId: "uttarakhand",
        city: "Haridwar",
        category: "Vishnu",
        established: "Ancient",
        description: "Sacred ghat on the banks of the Ganges River, considered one of the holiest places for Hindus. Famous for the Ganga Aarti.",
        deity: "Goddess Ganga",
        architecture: "Traditional ghat architecture",
        timings: "Open 24 hours",
        festivals: ["Kumbh Mela", "Ardh Kumbh", "Ganga Dussehra"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 2000,
        deviceId: "device_020",
    },
    // Jammu & Kashmir Temples
    {
        id: "temple_021",
        name: "Vaishno Devi Temple",
        stateId: "jammu-kashmir",
        city: "Katra",
        category: "Lakshmi-Narayan",
        established: "Ancient",
        description: "One of the most visited pilgrimage sites in India, located in the Trikuta Mountains. Devotees trek 13 km to reach the cave shrine.",
        deity: "Goddess Vaishno Devi",
        architecture: "Cave temple in mountains",
        timings: "Open 24 hours",
        festivals: ["Navaratri", "Diwali", "Sharad Purnima"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 1500,
        deviceId: "device_021",
    },
    {
        id: "temple_022",
        name: "Amarnath Cave Temple",
        stateId: "jammu-kashmir",
        city: "Pahalgam",
        category: "Shiva",
        established: "Ancient",
        description: "Sacred cave temple housing a naturally formed ice lingam of Lord Shiva. Located at 3,888 meters, accessible only during summer.",
        deity: "Lord Shiva (Ice Lingam)",
        architecture: "Natural cave",
        timings: "Seasonal (June-August)",
        festivals: ["Amarnath Yatra", "Shravan", "Maha Shivaratri"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 300,
        deviceId: "device_022",
    },
    {
        id: "temple_023",
        name: "Shankaracharya Temple",
        stateId: "jammu-kashmir",
        city: "Srinagar",
        category: "Shiva",
        established: "200 BCE",
        description: "Ancient temple dedicated to Lord Shiva, located on top of Shankaracharya Hill. Offers panoramic views of Srinagar and Dal Lake.",
        deity: "Lord Shiva",
        architecture: "Ancient stone architecture",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Maha Shivaratri", "Shravan", "Shivaratri"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 200,
        deviceId: "device_023",
    },
    // Punjab Temples
    {
        id: "temple_024",
        name: "Golden Temple (Harmandir Sahib)",
        stateId: "punjab",
        city: "Amritsar",
        category: "Lakshmi-Narayan",
        established: "1589 CE",
        description: "The holiest Gurdwara of Sikhism, also known as Darbar Sahib. The temple is covered in gold and surrounded by the Amrit Sarovar (holy pool).",
        deity: "Guru Granth Sahib",
        architecture: "Sikh architecture with gold plating",
        timings: "Open 24 hours",
        festivals: ["Guru Nanak Jayanti", "Baisakhi", "Diwali"],
        images: [
            "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
        ],
        totalCapacity: 3000,
        deviceId: "device_024",
    },
    {
        id: "temple_025",
        name: "Anandpur Sahib",
        stateId: "punjab",
        city: "Anandpur Sahib",
        category: "Lakshmi-Narayan",
        established: "1665 CE",
        description: "One of the most sacred places in Sikhism, where the Khalsa was founded. Home to Takht Sri Kesgarh Sahib.",
        deity: "Guru Granth Sahib",
        architecture: "Sikh architecture",
        timings: "4:00 AM - 10:00 PM",
        festivals: ["Hola Mohalla", "Baisakhi", "Guru Gobind Singh Jayanti"],
        images: [
            "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
        ],
        totalCapacity: 1200,
        deviceId: "device_025",
    },
    // Additional temples for existing states
    {
        id: "temple_026",
        name: "Dwarkadhish Temple",
        stateId: "gujarat",
        city: "Dwarka",
        category: "Vishnu",
        established: "15th-16th century CE",
        description: "One of the Char Dham and one of the 108 Divya Desams. Dedicated to Lord Krishna, located on the banks of the Gomti River.",
        deity: "Lord Krishna (Dwarkadhish)",
        architecture: "Chalukya architecture",
        timings: "6:30 AM - 1:00 PM, 5:00 PM - 9:30 PM",
        festivals: ["Janmashtami", "Holi", "Diwali"],
        images: [
            "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
        ],
        totalCapacity: 1000,
        deviceId: "device_026",
    },
    {
        id: "temple_027",
        name: "Shirdi Sai Baba Temple",
        stateId: "maharashtra",
        city: "Shirdi",
        category: "Ganesha",
        established: "1918 CE",
        description: "Famous temple dedicated to Sai Baba of Shirdi, attracting millions of devotees from all faiths. Known for miracles and spiritual healing.",
        deity: "Sai Baba",
        architecture: "Modern temple complex",
        timings: "4:00 AM - 11:30 PM",
        festivals: ["Ram Navami", "Vijayadashami", "Guru Purnima"],
        images: [
            "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
        ],
        totalCapacity: 2500,
        deviceId: "device_027",
    },
    {
        id: "temple_028",
        name: "Mathura Krishna Janmasthan",
        stateId: "uttar-pradesh",
        city: "Mathura",
        category: "Vishnu",
        established: "Ancient, rebuilt multiple times",
        description: "Birthplace of Lord Krishna, one of the most sacred places for Hindus. The temple complex includes the prison cell where Krishna was born.",
        deity: "Lord Krishna",
        architecture: "Modern reconstruction",
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:30 PM",
        festivals: ["Janmashtami", "Holi", "Krishna Jayanti"],
        images: [
            "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        ],
        totalCapacity: 1500,
        deviceId: "device_028",
    },
    {
        id: "temple_029",
        name: "Vrindavan ISKCON Temple",
        stateId: "uttar-pradesh",
        city: "Vrindavan",
        category: "Vishnu",
        established: "1975 CE",
        description: "Beautiful ISKCON temple dedicated to Lord Krishna and Radha. Known for its spiritual atmosphere and beautiful architecture.",
        deity: "Lord Krishna & Radha",
        architecture: "Modern temple with beautiful gardens",
        timings: "4:30 AM - 8:30 PM",
        festivals: ["Janmashtami", "Holi", "Radhashtami"],
        images: [
            "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        ],
        totalCapacity: 800,
        deviceId: "device_029",
    },
    // Additional temples for Varanasi
    {
        id: "temple_030",
        name: "Sankat Mochan Hanuman Temple",
        stateId: "uttar-pradesh",
        city: "Varanasi",
        category: "Ganesha",
        established: "16th century CE",
        description: "Famous temple dedicated to Lord Hanuman, believed to be established by Tulsidas. Known for its peaceful atmosphere and evening aarti.",
        deity: "Lord Hanuman",
        architecture: "Traditional North Indian style",
        timings: "5:00 AM - 10:00 PM",
        festivals: ["Hanuman Jayanti", "Tuesdays", "Saturdays"],
        images: [
            "https://i.pinimg.com/736x/bf/60/88/bf60886c58e4ffd17540c7f8e4f5d583.jpg",
        ],
        totalCapacity: 400,
        deviceId: "device_030",
    },
    {
        id: "temple_031",
        name: "Durga Temple",
        stateId: "uttar-pradesh",
        city: "Varanasi",
        category: "Lakshmi-Narayan",
        established: "18th century CE",
        description: "Beautiful temple dedicated to Goddess Durga, also known as Monkey Temple due to the many monkeys around it. Built in Nagara style.",
        deity: "Goddess Durga",
        architecture: "Nagara style with red stone",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Navaratri", "Durga Puja", "Dussehra"],
        images: [
            "https://i.pinimg.com/736x/bf/60/88/bf60886c58e4ffd17540c7f8e4f5d583.jpg",
        ],
        totalCapacity: 350,
        deviceId: "device_031",
    },
    {
        id: "temple_032",
        name: "Tulsi Manas Mandir",
        stateId: "uttar-pradesh",
        city: "Varanasi",
        category: "Vishnu",
        established: "1964 CE",
        description: "Modern temple dedicated to Lord Rama, built at the place where Tulsidas wrote the Ramcharitmanas. Features beautiful marble carvings of the Ramayana.",
        deity: "Lord Rama",
        architecture: "Modern architecture with marble",
        timings: "5:30 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        festivals: ["Ram Navami", "Diwali", "Vivah Panchami"],
        images: [
            "https://i.pinimg.com/736x/bf/60/88/bf60886c58e4ffd17540c7f8e4f5d583.jpg",
        ],
        totalCapacity: 300,
        deviceId: "device_032",
    },
    // Additional temples for Ayodhya
    {
        id: "temple_033",
        name: "Hanuman Garhi Temple",
        stateId: "uttar-pradesh",
        city: "Ayodhya",
        category: "Ganesha",
        established: "10th century CE",
        description: "Ancient temple dedicated to Lord Hanuman, located on a hillock. Believed to be the place where Hanuman guarded Ayodhya.",
        deity: "Lord Hanuman",
        architecture: "Fort-like structure with four gates",
        timings: "5:00 AM - 10:00 PM",
        festivals: ["Hanuman Jayanti", "Tuesdays", "Saturdays"],
        images: [
            "https://i.pinimg.com/736x/2d/82/fa/2d82fae369abadedee0718ed36e1b2d5.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_033",
    },
    {
        id: "temple_034",
        name: "Kanak Bhawan Temple",
        stateId: "uttar-pradesh",
        city: "Ayodhya",
        category: "Vishnu",
        established: "1891 CE",
        description: "Beautiful temple dedicated to Lord Rama and Goddess Sita, also known as Sone-ka-Ghar. Features golden idols of the deities.",
        deity: "Lord Rama & Goddess Sita",
        architecture: "Modern temple with golden idols",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Ram Navami", "Diwali", "Vivah Panchami"],
        images: [
            "https://i.pinimg.com/736x/2d/82/fa/2d82fae369abadedee0718ed36e1b2d5.jpg",
        ],
        totalCapacity: 400,
        deviceId: "device_034",
    },
    // Additional temples for Mathura
    {
        id: "temple_035",
        name: "Dwarkadhish Temple",
        stateId: "uttar-pradesh",
        city: "Mathura",
        category: "Vishnu",
        established: "1814 CE",
        description: "Beautiful temple dedicated to Lord Krishna, built by Seth Gokul Das Parikh. Known for its intricate carvings and architecture.",
        deity: "Lord Krishna (Dwarkadhish)",
        architecture: "Rajasthani and Mughal style",
        timings: "6:30 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        festivals: ["Janmashtami", "Holi", "Krishna Jayanti"],
        images: [
            "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        ],
        totalCapacity: 600,
        deviceId: "device_035",
    },
    {
        id: "temple_036",
        name: "Banke Bihari Temple",
        stateId: "uttar-pradesh",
        city: "Vrindavan",
        category: "Vishnu",
        established: "1864 CE",
        description: "One of the most famous temples in Vrindavan, dedicated to Lord Krishna in his Banke Bihari form. Known for unique darshan timings.",
        deity: "Lord Krishna (Banke Bihari)",
        architecture: "Traditional North Indian style",
        timings: "7:45 AM - 12:00 PM, 5:30 PM - 9:30 PM",
        festivals: ["Janmashtami", "Holi", "Radhashtami"],
        images: [
            "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        ],
        totalCapacity: 700,
        deviceId: "device_036",
    },
    {
        id: "temple_037",
        name: "Prem Mandir",
        stateId: "uttar-pradesh",
        city: "Vrindavan",
        category: "Vishnu",
        established: "2012 CE",
        description: "Modern white marble temple dedicated to Radha-Krishna and Sita-Ram. Known for its beautiful light shows and intricate carvings.",
        deity: "Radha-Krishna & Sita-Ram",
        architecture: "Modern white marble architecture",
        timings: "5:30 AM - 8:30 PM",
        festivals: ["Janmashtami", "Holi", "Radhashtami"],
        images: [
            "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
        ],
        totalCapacity: 900,
        deviceId: "device_037",
    },
    // Additional temples for Tirupati
    {
        id: "temple_038",
        name: "Padmavathi Temple",
        stateId: "andhra-pradesh",
        city: "Tirupati",
        category: "Lakshmi-Narayan",
        established: "11th century CE",
        description: "Temple dedicated to Goddess Padmavathi, consort of Lord Venkateswara. Located in Tiruchanur, part of the Tirupati temple complex.",
        deity: "Goddess Padmavathi",
        architecture: "Dravidian style",
        timings: "5:00 AM - 9:00 PM",
        festivals: ["Brahmotsavam", "Padmavathi Parinayam", "Navaratri"],
        images: [
            "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        ],
        totalCapacity: 800,
        deviceId: "device_038",
    },
    {
        id: "temple_039",
        name: "Kapila Theertham",
        stateId: "andhra-pradesh",
        city: "Tirupati",
        category: "Shiva",
        established: "Ancient",
        description: "Ancient cave temple dedicated to Lord Shiva, located at the foothills of Tirumala. Features a natural waterfall and sacred pond.",
        deity: "Lord Shiva",
        architecture: "Cave temple with natural waterfall",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Maha Shivaratri", "Karthika Deepam", "Shravan"],
        images: [
            "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
        ],
        totalCapacity: 300,
        deviceId: "device_039",
    },
    // Additional temples for Madurai
    {
        id: "temple_040",
        name: "Thirumalai Nayakkar Palace",
        stateId: "tamil-nadu",
        city: "Madurai",
        category: "Shiva",
        established: "17th century CE",
        description: "Historic palace complex with a temple dedicated to Lord Vishnu. Known for its Indo-Saracenic architecture and light shows.",
        deity: "Lord Vishnu",
        architecture: "Indo-Saracenic architecture",
        timings: "9:00 AM - 5:00 PM",
        festivals: ["Vaikunta Ekadashi", "Krishna Jayanti", "Diwali"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_040",
    },
    {
        id: "temple_041",
        name: "Koodal Azhagar Temple",
        stateId: "tamil-nadu",
        city: "Madurai",
        category: "Vishnu",
        established: "8th century CE",
        description: "One of the 108 Divya Desams, dedicated to Lord Vishnu in three forms - sitting, standing, and reclining. Beautiful Dravidian architecture.",
        deity: "Lord Vishnu (Koodal Azhagar)",
        architecture: "Dravidian architecture",
        timings: "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        festivals: ["Vaikunta Ekadashi", "Brahmotsavam", "Krishna Jayanti"],
        images: [
            "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
        ],
        totalCapacity: 600,
        deviceId: "device_041",
    },
    // Additional temples for Puri
    {
        id: "temple_042",
        name: "Gundicha Temple",
        stateId: "odisha",
        city: "Puri",
        category: "Vishnu",
        established: "11th century CE",
        description: "Garden house of Lord Jagannath, where the deities stay during Rath Yatra. Located 3 km from the main temple.",
        deity: "Lord Jagannath",
        architecture: "Kalinga architecture",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Rath Yatra", "Bahuda Yatra", "Sunabesa"],
        images: [
            "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_042",
    },
    {
        id: "temple_043",
        name: "Loknath Temple",
        stateId: "odisha",
        city: "Puri",
        category: "Shiva",
        established: "11th century CE",
        description: "Ancient temple dedicated to Lord Shiva, located near Jagannath Temple. One of the important Shiva temples in Puri.",
        deity: "Lord Shiva",
        architecture: "Kalinga architecture",
        timings: "5:00 AM - 9:00 PM",
        festivals: ["Maha Shivaratri", "Shravan", "Kartik Purnima"],
        images: [
            "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
        ],
        totalCapacity: 400,
        deviceId: "device_043",
    },
    // Additional temples for Haridwar
    {
        id: "temple_044",
        name: "Mansa Devi Temple",
        stateId: "uttarakhand",
        city: "Haridwar",
        category: "Lakshmi-Narayan",
        established: "17th century CE",
        description: "Famous temple dedicated to Goddess Mansa Devi, located on Bilwa Parvat. Accessible by cable car or trekking.",
        deity: "Goddess Mansa Devi",
        architecture: "Himalayan architecture",
        timings: "5:00 AM - 9:00 PM",
        festivals: ["Navaratri", "Chaitra Navratri", "Sharad Navratri"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 600,
        deviceId: "device_044",
    },
    {
        id: "temple_045",
        name: "Chandi Devi Temple",
        stateId: "uttarakhand",
        city: "Haridwar",
        category: "Lakshmi-Narayan",
        established: "1929 CE",
        description: "Temple dedicated to Goddess Chandi, located on Neel Parvat. Accessible by cable car. Built by Suchat Singh, the King of Kashmir.",
        deity: "Goddess Chandi",
        architecture: "Himalayan architecture",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Navaratri", "Chaitra Navratri", "Sharad Navratri"],
        images: [
            "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_045",
    },
    // Additional temples for Amritsar
    {
        id: "temple_046",
        name: "Durgiana Temple",
        stateId: "punjab",
        city: "Amritsar",
        category: "Lakshmi-Narayan",
        established: "1921 CE",
        description: "Hindu temple dedicated to Goddess Durga, also known as Lakshmi Narayan Temple. Built in the style of Golden Temple.",
        deity: "Goddess Durga",
        architecture: "Sikh-style architecture",
        timings: "6:00 AM - 10:00 PM",
        festivals: ["Navaratri", "Durga Puja", "Dussehra"],
        images: [
            "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
        ],
        totalCapacity: 800,
        deviceId: "device_046",
    },
    // Additional temples for Mumbai
    {
        id: "temple_047",
        name: "Babulnath Temple",
        stateId: "maharashtra",
        city: "Mumbai",
        category: "Shiva",
        established: "1780 CE",
        description: "Ancient temple dedicated to Lord Shiva, located on a hillock in South Mumbai. One of the oldest temples in Mumbai.",
        deity: "Lord Shiva",
        architecture: "Traditional temple architecture",
        timings: "5:00 AM - 10:00 PM",
        festivals: ["Maha Shivaratri", "Shravan", "Kartik Purnima"],
        images: [
            "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
        ],
        totalCapacity: 350,
        deviceId: "device_047",
    },
    {
        id: "temple_048",
        name: "Mahalaxmi Temple",
        stateId: "maharashtra",
        city: "Mumbai",
        category: "Lakshmi-Narayan",
        established: "1785 CE",
        description: "Famous temple dedicated to Goddess Mahalaxmi, located on the seashore. One of the most visited temples in Mumbai.",
        deity: "Goddess Mahalaxmi",
        architecture: "Traditional temple architecture",
        timings: "6:00 AM - 10:00 PM",
        festivals: ["Navaratri", "Lakshmi Puja", "Diwali"],
        images: [
            "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
        ],
        totalCapacity: 500,
        deviceId: "device_048",
    },
    // Additional temples for Jaipur
    {
        id: "temple_049",
        name: "Govind Dev Ji Temple",
        stateId: "rajasthan",
        city: "Jaipur",
        category: "Vishnu",
        established: "18th century CE",
        description: "Famous temple dedicated to Lord Krishna, located in the City Palace complex. The deity was brought from Vrindavan.",
        deity: "Lord Krishna",
        architecture: "Rajasthani architecture",
        timings: "5:00 AM - 12:00 PM, 5:00 PM - 9:00 PM",
        festivals: ["Janmashtami", "Holi", "Krishna Jayanti"],
        images: [
            "https://i.pinimg.com/1200x/30/82/55/30825546fde839827ddd5b7d5c9f6f30.jpg",
        ],
        totalCapacity: 600,
        deviceId: "device_049",
    },
    // Additional temples for Dwarka
    {
        id: "temple_050",
        name: "Rukmini Devi Temple",
        stateId: "gujarat",
        city: "Dwarka",
        category: "Vishnu",
        established: "12th century CE",
        description: "Temple dedicated to Goddess Rukmini, consort of Lord Krishna. Located 2 km from Dwarkadhish Temple.",
        deity: "Goddess Rukmini",
        architecture: "Chalukya architecture",
        timings: "6:00 AM - 8:00 PM",
        festivals: ["Janmashtami", "Holi", "Krishna Jayanti"],
        images: [
            "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
        ],
        totalCapacity: 400,
        deviceId: "device_050",
    },
];

// Update state templeCounts based on actual temples
states.forEach((state) => {
    state.templeCount = temples.filter((t) => t.stateId === state.id).length;
});

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
    // Andhra Pradesh devices
    {
        id: "device_006",
        templeId: "temple_006",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_007",
        templeId: "temple_007",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_008",
        templeId: "temple_008",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    // Tamil Nadu devices
    {
        id: "device_009",
        templeId: "temple_009",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_010",
        templeId: "temple_010",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_011",
        templeId: "temple_011",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_012",
        templeId: "temple_012",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    // Odisha devices
    {
        id: "device_013",
        templeId: "temple_013",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_014",
        templeId: "temple_014",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_015",
        templeId: "temple_015",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    // Uttarakhand devices
    {
        id: "device_016",
        templeId: "temple_016",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Fair",
    },
    {
        id: "device_017",
        templeId: "temple_017",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Fair",
    },
    {
        id: "device_018",
        templeId: "temple_018",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Fair",
    },
    {
        id: "device_019",
        templeId: "temple_019",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Fair",
    },
    {
        id: "device_020",
        templeId: "temple_020",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    // Jammu & Kashmir devices
    {
        id: "device_021",
        templeId: "temple_021",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_022",
        templeId: "temple_022",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Fair",
    },
    {
        id: "device_023",
        templeId: "temple_023",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    // Punjab devices
    {
        id: "device_024",
        templeId: "temple_024",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_025",
        templeId: "temple_025",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    // Additional devices
    {
        id: "device_026",
        templeId: "temple_026",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_027",
        templeId: "temple_027",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_028",
        templeId: "temple_028",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_029",
        templeId: "temple_029",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    // Additional devices for new temples
    {
        id: "device_030",
        templeId: "temple_030",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_031",
        templeId: "temple_031",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_032",
        templeId: "temple_032",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_033",
        templeId: "temple_033",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_034",
        templeId: "temple_034",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_035",
        templeId: "temple_035",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_036",
        templeId: "temple_036",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_037",
        templeId: "temple_037",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_038",
        templeId: "temple_038",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_039",
        templeId: "temple_039",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_040",
        templeId: "temple_040",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_041",
        templeId: "temple_041",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_042",
        templeId: "temple_042",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_043",
        templeId: "temple_043",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_044",
        templeId: "temple_044",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_045",
        templeId: "temple_045",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_046",
        templeId: "temple_046",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_047",
        templeId: "temple_047",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_048",
        templeId: "temple_048",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Excellent",
    },
    {
        id: "device_049",
        templeId: "temple_049",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
    },
    {
        id: "device_050",
        templeId: "temple_050",
        isConnected: true,
        lastPing: new Date().toISOString(),
        signalStrength: "Good",
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
        crowdLevel: "Critical",
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
    // Andhra Pradesh crowd data
    {
        templeId: "temple_006",
        currentCount: 1650,
        crowdLevel: "Critical",
        nextHourPrediction: 1800,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(1650),
    },
    {
        templeId: "temple_007",
        currentCount: 320,
        crowdLevel: "High",
        nextHourPrediction: 380,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(320),
    },
    {
        templeId: "temple_008",
        currentCount: 580,
        crowdLevel: "High",
        nextHourPrediction: 650,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(580),
    },
    // Tamil Nadu crowd data
    {
        templeId: "temple_009",
        currentCount: 920,
        crowdLevel: "High",
        nextHourPrediction: 1050,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(920),
    },
    {
        templeId: "temple_010",
        currentCount: 480,
        crowdLevel: "High",
        nextHourPrediction: 550,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(480),
    },
    {
        templeId: "temple_011",
        currentCount: 380,
        crowdLevel: "High",
        nextHourPrediction: 420,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(380),
    },
    {
        templeId: "temple_012",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    // Odisha crowd data
    {
        templeId: "temple_013",
        currentCount: 1200,
        crowdLevel: "Critical",
        nextHourPrediction: 1350,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(1200),
    },
    {
        templeId: "temple_014",
        currentCount: 220,
        crowdLevel: "Medium",
        nextHourPrediction: 280,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(220),
    },
    {
        templeId: "temple_015",
        currentCount: 420,
        crowdLevel: "High",
        nextHourPrediction: 480,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(420),
    },
    // Uttarakhand crowd data
    {
        templeId: "temple_016",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 220,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
    },
    {
        templeId: "temple_017",
        currentCount: 320,
        crowdLevel: "High",
        nextHourPrediction: 380,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(320),
    },
    {
        templeId: "temple_018",
        currentCount: 150,
        crowdLevel: "Medium",
        nextHourPrediction: 180,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(150),
    },
    {
        templeId: "temple_019",
        currentCount: 120,
        crowdLevel: "Medium",
        nextHourPrediction: 150,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(120),
    },
    {
        templeId: "temple_020",
        currentCount: 850,
        crowdLevel: "Critical",
        nextHourPrediction: 950,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(850),
    },
    // Jammu & Kashmir crowd data
    {
        templeId: "temple_021",
        currentCount: 680,
        crowdLevel: "Critical",
        nextHourPrediction: 750,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(680),
    },
    {
        templeId: "temple_022",
        currentCount: 95,
        crowdLevel: "Medium",
        nextHourPrediction: 120,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(95),
    },
    {
        templeId: "temple_023",
        currentCount: 75,
        crowdLevel: "Medium",
        nextHourPrediction: 95,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(75),
    },
    // Punjab crowd data
    {
        templeId: "temple_024",
        currentCount: 1850,
        crowdLevel: "Critical",
        nextHourPrediction: 2100,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(1850),
    },
    {
        templeId: "temple_025",
        currentCount: 480,
        crowdLevel: "High",
        nextHourPrediction: 550,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(480),
    },
    // Additional crowd data
    {
        templeId: "temple_026",
        currentCount: 420,
        crowdLevel: "High",
        nextHourPrediction: 480,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(420),
    },
    {
        templeId: "temple_027",
        currentCount: 1250,
        crowdLevel: "Critical",
        nextHourPrediction: 1400,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(1250),
    },
    {
        templeId: "temple_028",
        currentCount: 680,
        crowdLevel: "Critical",
        nextHourPrediction: 750,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(680),
    },
    {
        templeId: "temple_029",
        currentCount: 320,
        crowdLevel: "High",
        nextHourPrediction: 380,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(320),
    },
    // Crowd data for additional temples
    {
        templeId: "temple_030",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 220,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
    },
    {
        templeId: "temple_031",
        currentCount: 150,
        crowdLevel: "Medium",
        nextHourPrediction: 180,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(150),
    },
    {
        templeId: "temple_032",
        currentCount: 120,
        crowdLevel: "Medium",
        nextHourPrediction: 150,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(120),
    },
    {
        templeId: "temple_033",
        currentCount: 220,
        crowdLevel: "Medium",
        nextHourPrediction: 280,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(220),
    },
    {
        templeId: "temple_034",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 220,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
    },
    {
        templeId: "temple_035",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    {
        templeId: "temple_036",
        currentCount: 350,
        crowdLevel: "High",
        nextHourPrediction: 400,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(350),
    },
    {
        templeId: "temple_037",
        currentCount: 420,
        crowdLevel: "High",
        nextHourPrediction: 480,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(420),
    },
    {
        templeId: "temple_038",
        currentCount: 380,
        crowdLevel: "High",
        nextHourPrediction: 420,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(380),
    },
    {
        templeId: "temple_039",
        currentCount: 120,
        crowdLevel: "Medium",
        nextHourPrediction: 150,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(120),
    },
    {
        templeId: "temple_040",
        currentCount: 200,
        crowdLevel: "Medium",
        nextHourPrediction: 240,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(200),
    },
    {
        templeId: "temple_041",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    {
        templeId: "temple_042",
        currentCount: 220,
        crowdLevel: "Medium",
        nextHourPrediction: 260,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(220),
    },
    {
        templeId: "temple_043",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 220,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
    },
    {
        templeId: "temple_044",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    {
        templeId: "temple_045",
        currentCount: 240,
        crowdLevel: "High",
        nextHourPrediction: 280,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(240),
    },
    {
        templeId: "temple_046",
        currentCount: 380,
        crowdLevel: "High",
        nextHourPrediction: 420,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(380),
    },
    {
        templeId: "temple_047",
        currentCount: 150,
        crowdLevel: "Medium",
        nextHourPrediction: 180,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(150),
    },
    {
        templeId: "temple_048",
        currentCount: 240,
        crowdLevel: "High",
        nextHourPrediction: 280,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(240),
    },
    {
        templeId: "temple_049",
        currentCount: 280,
        crowdLevel: "High",
        nextHourPrediction: 320,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(280),
    },
    {
        templeId: "temple_050",
        currentCount: 180,
        crowdLevel: "Medium",
        nextHourPrediction: 220,
        lastUpdated: new Date().toISOString(),
        history: generateHistory(180),
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

// City-related helper functions
export interface City {
    name: string;
    stateId: string;
    templeCount: number;
    image: string;
}

// City images mapping
const cityImages: Record<string, string> = {
    // Uttar Pradesh
    "Varanasi": "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
    "Ayodhya": "https://i.pinimg.com/736x/2d/82/fa/2d82fae369abadedee0718ed36e1b2d5.jpg",
    "Mathura": "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
    "Vrindavan": "https://i.pinimg.com/736x/07/2c/a2/072ca21717894413ea0a5ae64437df39.jpg",
    // Rajasthan
    "Jaipur": "https://i.pinimg.com/1200x/30/82/55/30825546fde839827ddd5b7d5c9f6f30.jpg",
    // Maharashtra
    "Mumbai": "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
    "Shirdi": "https://i.pinimg.com/1200x/47/5d/5c/475d5cfa6e4186d063db269b89386a87.jpg",
    // Gujarat
    "Veraval": "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
    "Dwarka": "https://i.pinimg.com/1200x/f4/7d/4b/f47d4b0c77eb30099eba13ac18193c7b.jpg",
    // Andhra Pradesh
    "Tirupati": "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
    "Srikalahasti": "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
    "Vijayawada": "https://i.pinimg.com/1200x/a8/ca/4c/a8ca4c8e641f8143015eb0b248212df8.jpg",
    // Tamil Nadu
    "Madurai": "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
    "Rameswaram": "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
    "Thanjavur": "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
    "Palani": "https://i.pinimg.com/736x/55/a4/b4/55a4b4f04ad3a3a5a764657c135d0bcb.jpg",
    // Odisha
    "Puri": "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
    "Konark": "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
    "Bhubaneswar": "https://i.pinimg.com/1200x/99/36/7a/99367a1177a763a37dd46412e0b5fcc7.jpg",
    // Uttarakhand
    "Kedarnath": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Badrinath": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Gangotri": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Yamunotri": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Haridwar": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    // Jammu & Kashmir
    "Katra": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Pahalgam": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    "Srinagar": "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg",
    // Punjab
    "Amritsar": "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
    "Anandpur Sahib": "https://i.pinimg.com/736x/0e/6d/e0/0e6de0a646424eec7e0c0b2b1082c06c.jpg",
};

// Default city image fallback
const getCityImage = (cityName: string, stateId: string): string => {
    return cityImages[cityName] || states.find(s => s.id === stateId)?.image || "https://i.pinimg.com/1200x/4f/9f/71/4f9f71be73052048969ae7b84e86a605.jpg";
};

export const getCitiesByState = (stateId: string): Promise<City[]> => {
    return new Promise((resolve) => {
        const stateTemples = temples.filter((t) => t.stateId === stateId);
        const cityMap = new Map<string, number>();
        
        stateTemples.forEach((temple) => {
            const count = cityMap.get(temple.city) || 0;
            cityMap.set(temple.city, count + 1);
        });
        
        const cities: City[] = Array.from(cityMap.entries()).map(([name, templeCount]) => ({
            name,
            stateId,
            templeCount,
            image: getCityImage(name, stateId),
        }));
        
        setTimeout(() => resolve(cities), 200);
    });
};

export const getTemplesByCity = (stateId: string, cityName: string): Promise<Temple[]> => {
    return new Promise((resolve) => {
        const cityTemples = temples.filter(
            (t) => t.stateId === stateId && t.city.toLowerCase() === cityName.toLowerCase()
        );
        setTimeout(() => resolve(cityTemples), 200);
    });
};
