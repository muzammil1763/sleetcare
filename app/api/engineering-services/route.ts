import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const engineeringServiceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("Code2"),
  image: z.string().optional(),
  active: z.boolean().default(true),
  features: z.array(z.string()),
  order: z.number().default(0),
});

export async function GET() {
  try {
    const services = await prisma.engineeringService.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[ENGINEERING_SERVICES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch engineering services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = engineeringServiceSchema.parse(body);

    const service = await prisma.engineeringService.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        icon: validatedData.icon,
        image: validatedData.image,
        active: validatedData.active,
        features: validatedData.features,
        order: validatedData.order,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[ENGINEERING_SERVICES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create engineering service" },
      { status: 500 }
    );
  }
}
