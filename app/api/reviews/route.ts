import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(60),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional().default(""),
  body: z.string().min(5).max(1000),
});

// GET /api/reviews?productId=xxx  — reviews for a product
// GET /api/reviews?recent=true    — latest 8 approved reviews across all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const recent = searchParams.get("recent");

    if (recent === "true") {
      const reviews = await (prisma as any).review.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      });
      return NextResponse.json(reviews);
    }

    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const reviews = await (prisma as any).review.findMany({
      where: { productId, approved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (e) {
    console.error("Reviews GET error:", e);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews — submit a review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    // Basic spam check — no duplicate email+product within 24h
    const existing = await (prisma as any).review.findFirst({
      where: {
        productId: data.productId,
        email: data.email.toLowerCase(),
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product recently." }, { status: 409 });
    }

    const review = await (prisma as any).review.create({
      data: {
        productId: data.productId,
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        rating: data.rating,
        title: data.title?.trim() ?? "",
        body: data.body.trim(),
        approved: true,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("Review POST error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to submit review" }, { status: 500 });
  }
}
