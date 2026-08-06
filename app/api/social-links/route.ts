import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().default("Link"),
  label: z.string().min(1),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const link = await prisma.socialLink.create({ data: data as any });
    return NextResponse.json(link, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create link" }, { status: 400 });
  }
}
