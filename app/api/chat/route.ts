import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Build dynamic context from DB ─────────────────────────────────────────
async function buildContext(): Promise<string> {
  try {
    const [products, services, settings] = await Promise.all([
      prisma.product.findMany({ select: { name: true, category: true, price: true, stock: true, shortDesc: true, description: true } }),
      prisma.service.findMany({ where: { active: true }, select: { name: true, tagline: true, description: true, useCases: true, benefits: true } }),
      prisma.siteSettings.findMany(),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });

    const productList = products.map((p) =>
      `- ${p.name} (${p.category}): $${p.price} | ${p.shortDesc}`
    ).join("\n");

    const serviceList = services.map((s) =>
      `- ${s.name}: ${s.tagline}\n  Description: ${s.description}\n  Use Cases: ${s.useCases.join(", ")}\n  Benefits: ${s.benefits.join(", ")}`
    ).join("\n\n");

    return `
COMPANY: ${settingsMap.company_name || "Sleet Care"}
TAGLINE: ${settingsMap.company_tagline || "100% natural skincare crafted for the modern customer."}
EMAIL: ${settingsMap.contact_email || "hello@sleetcare.com"}
PHONE: ${settingsMap.contact_phone || "+92 300 1234567"}
WHATSAPP: ${settingsMap.contact_whatsapp || ""}
ADDRESS: ${settingsMap.contact_address || ""}

ABOUT:
Sleet Care is a premium natural skincare fashion brand offering curated collections of lawn, chiffon, khaddar, silk, linen, and organza suits. We are dedicated to the modern customer who values elegance, quality, and individuality.

WHAT WE DO:
We provide 100% natural skincare across all fabric types and occasions — from casual lawn to bridal silk. Each suit is crafted with care, featuring intricate embroideries, fine fabrics, and timeless designs.

COLLECTIONS:
- Lawn: Lightweight summer suits, breathable and vibrant
- Chiffon: Sheer and graceful suits for formal occasions
- Khaddar: Warm and textured suits for winter
- Silk: Luxurious suits for weddings and grand occasions
- Linen: Crisp and elegant suits for all seasons
- Organza: Delicate suits with intricate embroidery

PRODUCTS (${products.length} total):
${productList || "Embroidered Lawn, Chiffon Formal, Khaddar Winter, Bridal Silk"}

WHY CHOOSE US:
- Premium fabrics sourced from trusted mills
- Intricate hand-crafted embroideries
- Wide size range from XS to 3XL
- Nationwide delivery within 2–4 days
- Easy 30-day returns
- Dedicated customer support

PAGES ON WEBSITE:
- Home: Featured collections and new arrivals
- Shop (/shop): Browse all suits
- Products (/products): Full catalog with filters
- About (/about): Our story and values
- Contact (/contact): Get in touch

HOW TO CONTACT:
- Contact page: /contact
- WhatsApp: available via the chat button on the website
- Email: ${settingsMap.contact_email || "hello@sleetcare.com"}
`;
  } catch {
    return `Sleet Care is a premium natural skincare fashion brand offering lawn, chiffon, khaddar, silk, linen, and organza suits. Contact us at hello@sleetcare.com.`;
  }
}

// ── POST /api/chat ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] };

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const context = await buildContext();

    const systemPrompt = `You are the Sleet Care AI assistant — a helpful, knowledgeable, and friendly chatbot for the Sleet Care website. Sleet Care is a premium natural skincare fashion brand.

Use the following company information to answer questions accurately:

${context}

INSTRUCTIONS:
- Be concise, helpful, and professional
- Answer questions about our suits, collections, fabrics, pricing, delivery, and returns
- For sizing questions, mention that suits are natural skincare and can be tailored to any size
- For pricing inquiries, direct users to the products page or contact form
- If asked something outside our scope, politely redirect to relevant collections
- Always encourage users to contact the team for specific requirements
- Use emojis sparingly for a professional tone
- Keep responses under 200 words unless detailed explanation is needed
- Format lists with bullet points when appropriate`;

    const apiBase = process.env.AI_API_BASE || "https://api.ai.cc/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";
    const apiKey = process.env.OPENROUTER_API_KEY || "";

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://sleetcare.com",
        "X-Title": "Sleet Care AI Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[chat] API error:", response.status, err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error("[chat] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
