import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.engineeringService.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Engineering service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("[ENGINEERING_SERVICE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch engineering service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const service = await prisma.engineeringService.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[ENGINEERING_SERVICE_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update engineering service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.engineeringService.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Engineering service deleted" });
  } catch (error) {
    console.error("[ENGINEERING_SERVICE_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete engineering service" },
      { status: 500 }
    );
  }
}
