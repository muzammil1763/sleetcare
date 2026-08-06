import {
  Cpu,
  Radio,
  Settings2,
  Server,
  Activity,
  Wifi,
  Gauge,
  Shield,
  Network,
  ThermometerSun,
  Zap,
  HardDrive,
  Code2,
  CircuitBoard,
  Settings,
  Package,
  Wrench,
} from "lucide-react";

export type Service = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: keyof typeof serviceIcons;
  image?: string;
  active: boolean;
  useCases: string[];
  benefits: string[];
};

export const serviceIcons = { 
  Cpu, 
  Radio, 
  Settings2, 
  Server, 
  Activity, 
  Wifi, 
  Shield, 
  Network,
  Code2,
  CircuitBoard,
  Settings,
  Package,
  Wrench,
};

export const initialServices: Service[] = [
  {
    id: "svc-iot-integration",
    name: "IoT Integration",
    slug: "iot-integration",
    tagline: "Connect every device, every protocol.",
    description:
      "End-to-end IoT integration across MQTT, OPC-UA, Modbus and proprietary stacks. We unify legacy and modern equipment into a single observable fabric.",
    icon: "Network",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
    active: true,
    useCases: ["Manufacturing line digitization", "Multi-vendor sensor unification", "Edge-to-cloud pipelines"],
    benefits: ["Reduce integration time by 60%", "Vendor-agnostic architecture", "Real-time data normalization"],
  },
  {
    id: "svc-monitoring",
    name: "Smart Monitoring Systems",
    slug: "smart-monitoring",
    tagline: "Real-time observability for physical operations.",
    description:
      "Deploy production-grade telemetry with anomaly detection, configurable thresholds and alerting routed to the right teams.",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    active: true,
    useCases: ["Cold-chain monitoring", "Industrial asset health", "Energy consumption tracking"],
    benefits: ["Sub-second alerting", "Predictive failure detection", "SLA-grade dashboards"],
  },
  {
    id: "svc-automation",
    name: "Automation Solutions",
    slug: "automation",
    tagline: "Closed-loop control at industrial scale.",
    description:
      "Programmable automation pipelines with safety interlocks, rollback and full audit trails for regulated environments.",
    icon: "Settings2",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    active: true,
    useCases: ["HVAC orchestration", "Process automation", "Smart grid load balancing"],
    benefits: ["24/7 autonomous operation", "Compliance-ready audit logs", "Reduced operating cost"],
  },
  {
    id: "svc-device-mgmt",
    name: "Device Management",
    slug: "device-management",
    tagline: "Provision, update, secure — at fleet scale.",
    description:
      "Zero-touch provisioning, OTA firmware, certificate rotation and device posture management for fleets up to 1M endpoints.",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    active: false,
    useCases: ["Fleet OTA rollouts", "Certificate lifecycle", "Remote diagnostics"],
    benefits: ["Zero-touch provisioning", "Cryptographic identity per device", "Rollback-safe firmware"],
  },
];

export type Product = {
  id: string;
  name: string;
  category: "Sensors" | "Controllers" | "Devices" | "Gateways";
  price: number;
  stock: number;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
  icon: keyof typeof productIcons;
  image?: string;
  images?: string[];
  active?: boolean;
  order?: number;
};

export const productIcons = { Cpu, Radio, Server, Wifi, Gauge, ThermometerSun, Zap, HardDrive, Activity, Network };

export const initialProducts: Product[] = [
  {
    id: "p-001",
    name: "EdgeCore G7 Gateway",
    category: "Gateways",
    price: 1299,
    stock: 42,
    icon: "Server",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
      "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    shortDesc: "Multi-protocol industrial gateway with edge compute.",
    description: "EdgeCore G7 brings 8-core ARM compute, dual 2.5GbE and isolated industrial I/O into a DIN-rail-ready chassis.",
    specs: [
      { label: "CPU", value: "ARM Cortex-A72 8-core" },
      { label: "Memory", value: "8 GB LPDDR4" },
      { label: "Storage", value: "128 GB eMMC" },
      { label: "Protocols", value: "MQTT, OPC-UA, Modbus" },
      { label: "Operating Temp", value: "-40°C to 75°C" },
    ],
  },
  {
    id: "p-002",
    name: "Pulse T1 Temperature Sensor",
    category: "Sensors",
    price: 89,
    stock: 380,
    icon: "ThermometerSun",
    image: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80"
    ],
    shortDesc: "Industrial-grade temperature sensor, ±0.1°C accuracy.",
    description: "Calibrated wide-range temperature sensor with LoRaWAN backhaul and 7-year battery life.",
    specs: [
      { label: "Range", value: "-50°C to 200°C" },
      { label: "Accuracy", value: "±0.1°C" },
      { label: "Protocol", value: "LoRaWAN 1.0.4" },
      { label: "Battery", value: "7 years typical" },
    ],
  },
  {
    id: "p-003",
    name: "Vibe X3 Vibration Sensor",
    category: "Sensors",
    price: 219,
    stock: 156,
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80",
      "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=800&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80"
    ],
    shortDesc: "3-axis predictive maintenance vibration sensor.",
    description: "Tri-axis MEMS accelerometer with on-device FFT and anomaly scoring for rotating equipment.",
    specs: [
      { label: "Axes", value: "3" },
      { label: "Sample Rate", value: "25.6 kHz" },
      { label: "Range", value: "±16 g" },
      { label: "Connectivity", value: "BLE 5.2 / Wi-SUN" },
    ],
  },
  {
    id: "p-004",
    name: "Nexus C9 Controller",
    category: "Controllers",
    price: 749,
    stock: 64,
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    shortDesc: "Programmable IoT controller with deterministic I/O.",
    description: "Real-time controller with 16 isolated digital and 8 analog channels for closed-loop control.",
    specs: [
      { label: "Digital I/O", value: "16 isolated" },
      { label: "Analog", value: "8 ch / 16-bit" },
      { label: "Cycle Time", value: "<1 ms" },
      { label: "Runtime", value: "IEC 61131-3" },
    ],
  },
  {
    id: "p-005",
    name: "AirSense P5 Particulate Sensor",
    category: "Sensors",
    price: 134,
    stock: 220,
    icon: "Gauge",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&q=80",
    shortDesc: "PM1.0 / PM2.5 / PM10 air quality sensor.",
    description: "Laser-based particulate measurement for facility air quality and HVAC optimization.",
    specs: [
      { label: "Particles", value: "PM1, PM2.5, PM10" },
      { label: "Resolution", value: "0.1 µg/m³" },
      { label: "Interface", value: "UART / I²C" },
    ],
  },
  {
    id: "p-006",
    name: "GridLink P2 Power Meter",
    category: "Devices",
    price: 459,
    stock: 88,
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    shortDesc: "3-phase power meter with sub-cycle telemetry.",
    description: "Class 0.5S 3-phase meter with Modbus TCP and harmonic analysis up to 50th order.",
    specs: [
      { label: "Class", value: "0.5S" },
      { label: "Phases", value: "3" },
      { label: "Harmonics", value: "Up to 50th" },
      { label: "Comm", value: "Modbus TCP/RTU" },
    ],
  },
  {
    id: "p-007",
    name: "Beacon W4 Wireless AP",
    category: "Gateways",
    price: 389,
    stock: 110,
    icon: "Wifi",
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80",
    shortDesc: "Industrial Wi-Fi 6 access point, IP67 rated.",
    description: "Outdoor-rated Wi-Fi 6 access point built for harsh industrial deployments.",
    specs: [
      { label: "Standard", value: "Wi-Fi 6 (802.11ax)" },
      { label: "Throughput", value: "3.0 Gbps" },
      { label: "Rating", value: "IP67" },
      { label: "PoE", value: "802.3bt" },
    ],
  },
  {
    id: "p-008",
    name: "Flux R2 Relay Module",
    category: "Controllers",
    price: 189,
    stock: 245,
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&q=80",
    shortDesc: "8-channel solid-state relay with telemetry.",
    description: "Network-controllable SSR module with per-channel current sensing and trip protection.",
    specs: [
      { label: "Channels", value: "8" },
      { label: "Rating", value: "30 A / 277 VAC" },
      { label: "Protocol", value: "MQTT / REST" },
    ],
  },
  {
    id: "p-009",
    name: "Sentinel D1 Door Sensor",
    category: "Sensors",
    price: 49,
    stock: 540,
    icon: "Radio",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    shortDesc: "Tamper-evident door & window sensor.",
    description: "Magnetic contact sensor with tamper detection and 5-year battery life.",
    specs: [
      { label: "Battery", value: "5 years" },
      { label: "Range", value: "500 m line-of-sight" },
      { label: "Protocol", value: "Zigbee 3.0" },
    ],
  },
  {
    id: "p-010",
    name: "DataVault S2 Edge Storage",
    category: "Devices",
    price: 899,
    stock: 36,
    icon: "HardDrive",
    image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&q=80",
    shortDesc: "Ruggedized edge storage with timeseries DB.",
    description: "2 TB NVMe edge appliance with built-in TSDB for offline-first deployments.",
    specs: [
      { label: "Storage", value: "2 TB NVMe" },
      { label: "DB", value: "Timeseries native" },
      { label: "Cert", value: "MIL-STD-810H" },
    ],
  },
  {
    id: "p-011",
    name: "MeshLink Z3 Coordinator",
    category: "Gateways",
    price: 329,
    stock: 72,
    icon: "Network",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    shortDesc: "Zigbee/Thread mesh coordinator.",
    description: "Multi-radio coordinator supporting Zigbee 3.0 and Thread 1.3 with up to 250 children.",
    specs: [
      { label: "Radios", value: "Zigbee, Thread" },
      { label: "Children", value: "250" },
      { label: "Backhaul", value: "GbE / LTE" },
    ],
  },
  {
    id: "p-012",
    name: "Pulse H2 Humidity Sensor",
    category: "Sensors",
    price: 79,
    stock: 410,
    icon: "Gauge",
    image: "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=800&q=80",
    shortDesc: "Industrial humidity & dew point sensor.",
    description: "Capacitive RH sensor with onboard dew point calculation and IP65 housing.",
    specs: [
      { label: "Range", value: "0–100% RH" },
      { label: "Accuracy", value: "±1.5%" },
      { label: "Rating", value: "IP65" },
    ],
  },
  {
    id: "p-013",
    name: "Forge K1 Industrial PC",
    category: "Devices",
    price: 1899,
    stock: 22,
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
    shortDesc: "Fanless industrial PC for SCADA workloads.",
    description: "Fanless x86 industrial PC with TPM 2.0, redundant power and -20°C to 60°C operation.",
    specs: [
      { label: "CPU", value: "Intel Atom x6425E" },
      { label: "RAM", value: "16 GB ECC" },
      { label: "TPM", value: "2.0" },
    ],
  },
  {
    id: "p-014",
    name: "Nimbus L1 LoRa Gateway",
    category: "Gateways",
    price: 549,
    stock: 58,
    icon: "Wifi",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    shortDesc: "8-channel LoRaWAN gateway, outdoor.",
    description: "Carrier-grade outdoor LoRaWAN gateway with GPS sync and IP67 enclosure.",
    specs: [
      { label: "Channels", value: "8" },
      { label: "Backhaul", value: "LTE Cat-4 / GbE" },
      { label: "GPS", value: "u-blox" },
    ],
  },
  {
    id: "p-015",
    name: "Aegis F1 Firewall Appliance",
    category: "Devices",
    price: 1249,
    stock: 30,
    icon: "Server",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
    shortDesc: "OT-aware firewall for industrial networks.",
    description: "Deep packet inspection for industrial protocols with allowlist policy engine.",
    specs: [
      { label: "Throughput", value: "1 Gbps DPI" },
      { label: "Protocols", value: "Modbus, DNP3, OPC-UA" },
      { label: "Form", value: "DIN-rail" },
    ],
  },
];

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: number;
};

export const initialOrders: Order[] = [
  {
    id: "ORD-10042",
    customer: "Northwind Energy",
    email: "ops@northwind.io",
    date: "2025-04-12",
    status: "Delivered",
    total: 12490,
    items: 8,
  },
  {
    id: "ORD-10041",
    customer: "Helix Manufacturing",
    email: "procurement@helix.co",
    date: "2025-04-11",
    status: "Shipped",
    total: 5870,
    items: 4,
  },
  {
    id: "ORD-10040",
    customer: "Polaris Cold Storage",
    email: "facilities@polaris.com",
    date: "2025-04-10",
    status: "Processing",
    total: 3245,
    items: 12,
  },
  {
    id: "ORD-10039",
    customer: "Vector Robotics",
    email: "supply@vector.tech",
    date: "2025-04-09",
    status: "Pending",
    total: 18920,
    items: 6,
  },
  {
    id: "ORD-10038",
    customer: "Atlas Utilities",
    email: "buyer@atlas-grid.com",
    date: "2025-04-08",
    status: "Delivered",
    total: 7430,
    items: 9,
  },
  {
    id: "ORD-10037",
    customer: "Forge Steelworks",
    email: "it@forgesteel.com",
    date: "2025-04-07",
    status: "Cancelled",
    total: 2110,
    items: 3,
  },
  {
    id: "ORD-10036",
    customer: "Mercer Logistics",
    email: "ops@mercer.com",
    date: "2025-04-06",
    status: "Delivered",
    total: 9850,
    items: 7,
  },
  {
    id: "ORD-10035",
    customer: "Solis AgriTech",
    email: "farm@solis.ag",
    date: "2025-04-05",
    status: "Shipped",
    total: 4290,
    items: 14,
  },
];

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Operator" | "Viewer";
  status: "Active" | "Suspended";
  lastActive: string;
};

export const initialUsers: User[] = [
  { id: "u-01", name: "Elena Park",   email: "admin@majestic.com",    role: "Admin",    status: "Active",    lastActive: "2 min ago" },
  { id: "u-02", name: "Marcus Vale",  email: "manager@majestic.com",  role: "Operator", status: "Active",    lastActive: "1 h ago" },
  { id: "u-03", name: "Priya Shah",   email: "priya@majestic.com",    role: "Operator", status: "Active",    lastActive: "3 h ago" },
  { id: "u-04", name: "Kenji Otsu",   email: "kenji@majestic.com",    role: "Viewer",   status: "Active",    lastActive: "Yesterday" },
  { id: "u-05", name: "Naomi Reyes",  email: "naomi@majestic.com",    role: "Admin",    status: "Active",    lastActive: "Just now" },
  { id: "u-06", name: "Theo Lang",    email: "theo@majestic.com",     role: "Viewer",   status: "Suspended", lastActive: "12 d ago" },
];

export const salesTrend = [
  { month: "Nov", revenue: 84000 },
  { month: "Dec", revenue: 96500 },
  { month: "Jan", revenue: 112400 },
  { month: "Feb", revenue: 128900 },
  { month: "Mar", revenue: 142300 },
  { month: "Apr", revenue: 168200 },
];

export const ordersOverTime = [
  { week: "W1", orders: 42 },
  { week: "W2", orders: 58 },
  { week: "W3", orders: 49 },
  { week: "W4", orders: 71 },
  { week: "W5", orders: 64 },
  { week: "W6", orders: 88 },
];
