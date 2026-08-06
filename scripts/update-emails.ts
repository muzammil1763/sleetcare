import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const emailMap: Record<string, string> = {
  "elena@iotcore.io":  "elena@omnilynk.io",
  "marcus@iotcore.io": "marcus@omnilynk.io",
  "priya@iotcore.io":  "priya@omnilynk.io",
  "kenji@iotcore.io":  "kenji@omnilynk.io",
  "naomi@iotcore.io":  "naomi@omnilynk.io",
  "theo@iotcore.io":   "theo@omnilynk.io",
};

async function main() {
  for (const [oldEmail, newEmail] of Object.entries(emailMap)) {
    const user = await prisma.user.findUnique({ where: { email: oldEmail } });
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { email: newEmail } });
      console.log(`✅ ${oldEmail} → ${newEmail}`);
    } else {
      console.log(`⚠️  Not found: ${oldEmail}`);
    }
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
