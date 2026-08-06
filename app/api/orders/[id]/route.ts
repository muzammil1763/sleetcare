import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]).optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { orderItems: { include: { product: true } } },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { orderItems: { include: { product: true } } },
    });
    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update order" }, { status: 400 });
  }
}
