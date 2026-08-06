import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  // Unstitched suit fields
  fabric: z.string().optional(),
  pieces: z.number().int().optional(),
  embroidery: z.string().optional(),
  occasion: z.string().optional(),
  season: z.string().optional(),
  color: z.string().optional(),
  videoUrl: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (e) {
    console.error("GET /api/products/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const { specs, images, ...rest } = data;
    const updateData: any = { ...rest };
    if (specs !== undefined) updateData.specs = specs;
    if (images !== undefined) updateData.images = images;
    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json(product);
  } catch (e: any) {
    console.error("PUT /api/products/[id] error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to update product" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/products/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
