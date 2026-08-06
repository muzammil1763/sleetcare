import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateImages() {
  console.log("Updating engineering service images...");

  const updates = [
    {
      slug: "firmware-development",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80", // Code/programming
    },
    {
      slug: "pcb-design-layout",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Circuit board
    },
    {
      slug: "reverse-engineering",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", // Technology/analysis
    },
    {
      slug: "pcb-assembly",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80", // Electronics assembly
    },
  ];

  for (const update of updates) {
    try {
      await prisma.engineeringService.update({
        where: { slug: update.slug },
        data: { image: update.image },
      });
      console.log("✓ Updated:", update.slug);
    } catch (error) {
      console.error("✗ Failed to update:", update.slug, error);
    }
  }

  console.log("✅ All images updated!");
  await prisma.$disconnect();
}

updateImages().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
