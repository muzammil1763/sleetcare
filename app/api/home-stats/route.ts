import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statsSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().default("Wifi"),
});

export async function GET() {
  try {
    const stats = await prisma.homeStats.findMany();
    
    // Return as object for easy access
    const statsObj = stats.reduce((acc, stat) => {
      acc[stat.key] = {
        value: stat.value,
        label: stat.label,
        icon: stat.icon,
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(statsObj);
  } catch (error) {
    console.error("[HOME_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch home stats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = statsSchema.parse(body);

    const stat = await prisma.homeStats.upsert({
      where: { key: validatedData.key },
      update: {
        value: validatedData.value,
        label: validatedData.label,
        icon: validatedData.icon,
      },
      create: {
        key: validatedData.key,
        value: validatedData.value,
        label: validatedData.label,
        icon: validatedData.icon,
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
    console.error("[HOME_STATS_POST]", error);
    return NextResponse.json(
      { error: "Failed to save home stats" },
      { status: 500 }
    );
  }
}
