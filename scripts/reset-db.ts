import * as dotenv from "dotenv";
dotenv.config();

// Set the database URL before importing PrismaClient
process.env.DATABASE_URL = process.env.DATABASE_URL || "";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Resetting database...");
  console.log("📡 Connecting to:", process.env.DATABASE_URL?.split("@")[1]?.split("/")[0]);
  
  try {
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log("🧹 Deleting all data...");
    
    await prisma.orderItem.deleteMany();
    console.log("   ✅ Deleted all order items");
    
    await prisma.order.deleteMany();
    console.log("   ✅ Deleted all orders");
    
    await prisma.product.deleteMany();
    console.log("   ✅ Deleted all products");
    
    await prisma.service.deleteMany();
    console.log("   ✅ Deleted all services");
    
    await prisma.user.deleteMany();
    console.log("   ✅ Deleted all users");
    
    await prisma.socialLink.deleteMany();
    console.log("   ✅ Deleted all social links");
    
    await prisma.siteSettings.deleteMany();
    console.log("   ✅ Deleted all site settings");
    
    console.log("\n🎉 Database reset complete!");
    console.log("💡 Run 'npm run db:seed' to populate with fresh data");
    
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Confirmation prompt
const args = process.argv.slice(2);
const forceFlag = args.includes('--force') || args.includes('-f');

if (!forceFlag) {
  console.log("⚠️  WARNING: This will DELETE ALL DATA in your database!");
  console.log("💡 To proceed, run: npm run db:reset -- --force");
  console.log("💡 Or use the shorthand: npm run db:reset -- -f");
  process.exit(0);
}

resetDatabase();