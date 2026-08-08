/**
 * clean-demo-data.ts
 *
 * Deletes all transactional / demo data while keeping:
 *   - Products
 *   - Categories
 *   - Admin users (role = "Admin")
 *   - Services, EngineeringServices, SocialLinks, SiteSettings, HomeStats, SlaStats, Vlogs
 *
 * Run with:
 *   npx ts-node --project tsconfig.seed.json scripts/clean-demo-data.ts
 *
 * Add --force to skip the confirmation prompt:
 *   npx ts-node --project tsconfig.seed.json scripts/clean-demo-data.ts --force
 */

import { PrismaClient } from "@prisma/client";
import * as readline from "readline";

const prisma = new PrismaClient();

async function confirm(message: string): Promise<boolean> {
  if (process.argv.includes("--force")) return true;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`\n${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function main() {
  console.log("\n========================================");
  console.log("  Sleet Care — Demo Data Cleaner");
  console.log("========================================");
  console.log("\nThis will permanently delete:");
  console.log("  • All orders and order items");
  console.log("  • All non-admin users (customers)");
  console.log("  • All inquiries");
  console.log("\nThis will KEEP:");
  console.log("  • Products");
  console.log("  • Categories");
  console.log("  • Admin users");
  console.log("  • Services, Settings, Social Links, etc.");

  const ok = await confirm("Are you sure you want to continue?");
  if (!ok) {
    console.log("\nAborted. Nothing was deleted.\n");
    process.exit(0);
  }

  console.log("\nCleaning...\n");

  // 1. Delete order items first (FK dependency)
  const deletedItems = await prisma.orderItem.deleteMany({});
  console.log(`✓ Deleted ${deletedItems.count} order items`);

  // 2. Delete all orders (includes inquiry orders)
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`✓ Deleted ${deletedOrders.count} orders`);

  // 3. Delete non-admin users (customers who registered on the site)
  const deletedUsers = await prisma.user.deleteMany({
    where: { role: { not: "Admin" } },
  });
  console.log(`✓ Deleted ${deletedUsers.count} customer accounts`);

  console.log("\n========================================");
  console.log("  Done! Database is clean.");
  console.log("========================================\n");

  // Summary of what remains
  const [products, categories, admins] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count({ where: { role: "Admin" } }),
  ]);

  console.log("Remaining data:");
  console.log(`  Products  : ${products}`);
  console.log(`  Categories: ${categories}`);
  console.log(`  Admins    : ${admins}`);
  console.log();
}

main()
  .catch((e) => {
    console.error("\n❌ Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
