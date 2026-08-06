import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const slaStatsSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
});

// GET all SLA stats
export async function GET() {
  try {
    const stats = await prisma.slaStats.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[SLA_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch SLA stats" },
      { status: 500 }
    );
  }
}

// POST create new SLA stat
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = slaStatsSchema.parse(body);

    const stat = await prisma.slaStats.create({
      data: {
        label: validatedData.label,
        value: validatedData.value,
        order: validatedData.order ?? 0,
        active: validatedData.active ?? true,
      },
    });

    return NextResponse.json(stat);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[SLA_STATS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create SLA stat" },
      { status: 500 }
    );
  }
}
