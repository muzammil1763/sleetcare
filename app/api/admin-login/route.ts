import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    console.log("[admin-login-api] Checking credentials for:", normalizedEmail);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log("[admin-login-api] User not found");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.status === "Suspended") {
      console.log("[admin-login-api] User suspended");
      return NextResponse.json({ error: "Account suspended" }, { status: 401 });
    }

    // Check if user is Admin
    if (user.role !== "Admin") {
      console.log("[admin-login-api] Non-admin attempted login:", user.role);
      return NextResponse.json({ error: "Only Admin users can access this panel" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("[admin-login-api] Invalid password");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("[admin-login-api] Admin validated, proceeding with auth");

    // User is valid Admin, return success
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error("[admin-login-api] Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
