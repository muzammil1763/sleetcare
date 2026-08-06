import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  icon: z.string().default("Server"),
  image: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().default(0),
  useCases: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);
    const service = await prisma.service.create({ data: data as any });
    return NextResponse.json(service, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create service" }, { status: 400 });
  }
}
