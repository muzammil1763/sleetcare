import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            console.log("[auth] Invalid credentials format");
            return null;
          }

          const { email, password } = parsed.data;
          const normalizedEmail = email.toLowerCase();
          console.log("[auth] Looking up user:", normalizedEmail);

          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user) {
            console.log("[auth] User not found:", normalizedEmail);
            return null;
          }

          if (user.status === "Suspended") {
            console.log("[auth] User suspended:", normalizedEmail);
            return null;
          }

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            console.log("[auth] Wrong password for:", normalizedEmail);
            return null;
          }

          // Update last active (non-blocking)
          prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() },
          }).catch(() => {});

          console.log("[auth] Login success:", normalizedEmail, user.role);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `user-session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  trustHost: true,
});
