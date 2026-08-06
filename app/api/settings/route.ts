import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all settings as a key-value object
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    const obj: Record<string, string> = {};
    settings.forEach((s) => { obj[s.key] = s.value; });
    return NextResponse.json(obj);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST — upsert multiple settings at once
// Body: { key: value, key2: value2, ... }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const ops = Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await Promise.all(ops);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to save settings" }, { status: 400 });
  }
}
