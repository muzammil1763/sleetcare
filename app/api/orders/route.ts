import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const orderSchema = z.object({
  customer: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentScreenshot: z.string().nullable().optional(),
  deliveryCharges: z.number().optional(),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })),
  shippingAddress: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(q ? { OR: [{ customer: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (e) {
    console.error("Orders GET error:", e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, email, phone, items, shippingAddress, paymentMethod, paymentScreenshot, deliveryCharges } = orderSchema.parse(body);

    // Fetch product prices
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price ?? 0) * item.qty;
    }, 0);

    const shipping = deliveryCharges ?? 0;
    const total = subtotal + shipping;

    const itemCount = items.reduce((n, i) => n + i.qty, 0);

    // Find user by email to link order
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    const order = await prisma.order.create({
      data: {
        customer,
        email,
        phone: phone || null,
        total: total,
        items: itemCount,
        date: new Date().toISOString(),
        status: "Pending",
        shippingAddress: shippingAddress ? { ...shippingAddress, deliveryCharges: shipping } : { deliveryCharges: shipping },
        paymentMethod: paymentMethod || "cod",
        paymentScreenshot: paymentScreenshot || null,
        userId: user?.id,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: products.find((p) => p.id === item.productId)?.price ?? 0,
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    });

    // Decrement stock
    await Promise.all(
      items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        })
      )
    );

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: customer,
      customerEmail: email,
      status: "Pending",
      items: order.orderItems.map(i => ({ name: i.product.name, qty: i.qty, price: i.price })),
      subtotal,
      deliveryCharges: shipping,
      total,
      paymentMethod: paymentMethod || "cod",
      shippingAddress: shippingAddress as any,
      isGuest: !user?.id,
    }).catch(err => console.error("Confirmation email failed:", err));

    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create order" }, { status: 400 });
  }
}
