import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  shortDesc: z.string(),
  description: z.string(),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  // Unstitched suit fields
  fabric: z.string().optional(),
  pieces: z.number().int().optional(),
  embroidery: z.string().optional(),
  occasion: z.string().optional(),
  season: z.string().optional(),
  color: z.string().optional(),
  videoUrl: z.string().optional(),
  icon: z.string().default("Package"),
  image: z.string().optional(),
  images: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== "All" ? { category } : {}),
        ...(q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { shortDesc: { contains: q, mode: "insensitive" } },
          ],
        } : {}),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error("GET /api/products error:", e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    const product = await prisma.product.create({ data: data as any });
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/products error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to create product" }, { status: 400 });
  }
}
