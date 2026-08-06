import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  platform: z.string().optional(),
  url: z.string().url().optional(),
  icon: z.string().optional(),
  label: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const link = await prisma.socialLink.update({ where: { id: params.id }, data: data as any });
    return NextResponse.json(link);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update link" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.socialLink.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
