import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const slaStatsSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
});

// PUT update SLA stat
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = slaStatsSchema.parse(body);

    const stat = await prisma.slaStats.update({
      where: { id: params.id },
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
    console.error("[SLA_STATS_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update SLA stat" },
      { status: 500 }
    );
  }
}

// DELETE SLA stat
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.slaStats.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SLA_STATS_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete SLA stat" },
      { status: 500 }
    );
  }
}
