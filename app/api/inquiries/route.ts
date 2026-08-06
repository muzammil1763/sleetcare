import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        date: { startsWith: "INQUIRY:" },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, message, type, itemName, itemId, qty } = body;

    console.log("=== INQUIRY API DEBUG ===");
    console.log("Full body:", JSON.stringify(body, null, 2));
    console.log("itemName value:", itemName);
    console.log("itemName type:", typeof itemName);
    console.log("itemName length:", itemName?.length);

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Encode all inquiry data in the `date` field as a JSON string prefixed with "INQUIRY:"
    const inquiryData = JSON.stringify({
      type: type ?? "service",
      itemId: itemId ?? "",
      itemName: itemName ?? "",
      phone: phone ?? "",
      company: company ?? "",
      message: message ?? "",
      qty: qty ?? 1,
      submittedAt: new Date().toISOString(),
    });

    console.log("Inquiry data to save:", inquiryData);

    const order = await prisma.order.create({
      data: {
        customer: name,
        email,
        status: "Pending",
        total: 0,
        items: qty ?? 0,
        date: `INQUIRY:${inquiryData}`,
      },
    });

    console.log("Inquiry saved with ID:", order.id);
    console.log("Saved date field:", order.date);

    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    console.error("Inquiry API error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to save inquiry" }, { status: 400 });
  }
}
