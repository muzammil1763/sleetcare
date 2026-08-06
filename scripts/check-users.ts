import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, status: true, role: true, password: true },
  });
  console.log("Users in DB:", users.length);
  users.forEach((u) => {
    console.log(`  ${u.email} | ${u.role} | ${u.status} | hash: ${u.password.slice(0, 20)}...`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
