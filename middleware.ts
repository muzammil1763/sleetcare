import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // protect all /admin routes - ONLY Admin role allowed
  if (pathname.startsWith("/admin")) {
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    
    if (!req.auth) {
      // Not authenticated - redirect to admin login
      const loginUrl = new URL(`${protocol}://${host}/admin-login`);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user role is Admin
    const userRole = (req.auth.user as any)?.role;
    
    // ONLY Admin role is allowed - block everyone else
    if (userRole !== "Admin") {
      // Redirect non-Admin users to their appropriate page
      if (userRole === "Viewer") {
        return NextResponse.redirect(new URL(`${protocol}://${host}/profile`));
      } else {
        // Editor or any other role - redirect to home
        return NextResponse.redirect(new URL(`${protocol}://${host}/`));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
