import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title:       z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl:    z.string().optional(),
  thumbnail:   z.string().optional(),
  active:      z.boolean().optional(),
  order:       z.number().optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vlog = await prisma.vlog.findUnique({ where: { id: params.id } });
    if (!vlog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(vlog);
  } catch {
    return NextResponse.json({ error: "Failed to fetch vlog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const vlog = await prisma.vlog.update({ where: { id: params.id }, data });
    return NextResponse.json(vlog);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update vlog" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.vlog.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete vlog" }, { status: 500 });
  }
}
