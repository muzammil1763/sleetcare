import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendOrderStatusEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]).optional(),
  paymentScreenshot: z.string().optional(),
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

    // Fetch old status before update (to detect status change)
    const oldOrder = await prisma.order.findUnique({
      where: { id: params.id },
      select: { status: true, email: true, customer: true, userId: true },
    });

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { orderItems: { include: { product: true } } },
    });

    // Send status update email only if status actually changed
    if (data.status && oldOrder && data.status !== oldOrder.status) {
      const sa = order.shippingAddress as any;
      const subtotal = order.orderItems.reduce((s, i) => s + i.price * i.qty, 0);
      const deliveryCharges = sa?.deliveryCharges ?? 0;

      try {
        await sendOrderStatusEmail({
          orderId: order.id,
          customerName: order.customer,
          customerEmail: order.email,
          status: order.status,
          items: order.orderItems.map(i => ({ name: i.product.name, qty: i.qty, price: i.price })),
          subtotal,
          deliveryCharges,
          total: order.total,
          paymentMethod: order.paymentMethod || "cod",
          shippingAddress: sa,
          isGuest: !oldOrder.userId,
        });
        console.log("Status email sent to:", order.email);
      } catch (emailErr) {
        console.error("Status email failed:", emailErr);
      }
    }

    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update order" }, { status: 400 });
  }
}
