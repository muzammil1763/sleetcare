import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding engineering services and home stats...");

  // Seed Engineering Services
  const engineeringServices = [
    {
      name: "Firmware Development",
      slug: "firmware-development",
      description: "Custom embedded software for microcontrollers and IoT devices. We develop stable, optimized firmware for reliable device performance.",
      icon: "Code2",
      image: "/image.png",
      active: true,
      features: [
        "Real-time operating systems (RTOS)",
        "Low-power optimization",
        "OTA update support",
        "Protocol implementation (MQTT, HTTP, CoAP)",
      ],
      order: 0,
    },
    {
      name: "PCB Design and Layout",
      slug: "pcb-design-layout",
      description: "Professional PCB design optimized for performance and manufacturability. From schematic to production-ready files.",
      icon: "CircuitBoard",
      image: "/image.png",
      active: true,
      features: [
        "Multi-layer PCB design",
        "Signal integrity analysis",
        "EMI/EMC compliance",
        "Design for manufacturing (DFM)",
      ],
      order: 1,
    },
    {
      name: "Reverse Engineering",
      slug: "reverse-engineering",
      description: "Analysis and recreation of existing hardware and firmware. We help you understand, modify, or improve existing systems.",
      icon: "Settings",
      image: "/image.png",
      active: true,
      features: [
        "Circuit analysis and documentation",
        "Firmware extraction and analysis",
        "Protocol reverse engineering",
        "Legacy system modernization",
      ],
      order: 2,
    },
    {
      name: "PCB Assembly Services",
      slug: "pcb-assembly",
      description: "Full assembly and testing of PCB boards for your projects. From prototypes to production runs.",
      icon: "Package",
      image: "/image.png",
      active: true,
      features: [
        "SMT and through-hole assembly",
        "Automated optical inspection (AOI)",
        "Functional testing",
        "Quality assurance and documentation",
      ],
      order: 3,
    },
  ];

  for (const service of engineeringServices) {
    await prisma.engineeringService.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log("✓ Engineering services seeded");

  // Seed Home Stats
  const homeStats = [
    {
      key: "devices_deployed",
      value: "1000+",
      label: "Devices Deployed",
      icon: "Wifi",
    },
    {
      key: "uptime_sla",
      value: "98%",
      label: "Uptime SLA",
      icon: "Clock",
    },
    {
      key: "industries_served",
      value: "10+",
      label: "Industries Served",
      icon: "Globe",
    },
    {
      key: "happy_clients",
      value: "100+",
      label: "Happy Clients",
      icon: "TrendingUp",
    },
  ];

  for (const stat of homeStats) {
    await prisma.homeStats.upsert({
      where: { key: stat.key },
      update: stat,
      create: stat,
    });
  }

  console.log("✓ Home stats seeded");
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
