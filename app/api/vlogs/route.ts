import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const vlogSchema = z.object({
  title:       z.string().min(1),
  description: z.string().default(""),
  videoUrl:    z.string().min(1),
  thumbnail:   z.string().optional(),
  active:      z.boolean().default(true),
  order:       z.number().default(0),
});

export async function GET() {
  try {
    const vlogs = await prisma.vlog.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(vlogs);
  } catch (e) {
    console.error("GET /api/vlogs error:", e);
    return NextResponse.json({ error: "Failed to fetch vlogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = vlogSchema.parse(body);
    const vlog = await prisma.vlog.create({
      data: {
        title:       parsed.title,
        description: parsed.description,
        videoUrl:    parsed.videoUrl,
        thumbnail:   parsed.thumbnail,
        active:      parsed.active,
        order:       parsed.order,
      },
    });
    return NextResponse.json(vlog, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/vlogs error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to create vlog" }, { status: 400 });
  }
}
