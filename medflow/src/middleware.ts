import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("medflow-role")?.value;
  const path = request.nextUrl.pathname;

  // 1. If user is NOT logged in and trying to access a protected route
  if (!role && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If user IS logged in and trying to access auth pages (login/signup)
  if (role && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // 3. Role-based routing (Allow shared dashboard pages, protect other role-specific ones)
  if (role && path.startsWith('/dashboard')) {
    const roles = ['admin', 'doctor', 'lab', 'patient', 'pharmacy'];
    const pathSegments = path.split('/').filter(Boolean); // e.g., ["dashboard", "patients"]

    // If it's just /dashboard, redirect to their role dashboard
    if (pathSegments.length === 1) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    // Check if the first segment after /dashboard is another role's restricted dashboard
    const firstDashSegment = pathSegments[1];
    
    // In development mode, allow developers to view ANY dashboard freely to test UI.
    // In production, enforce role-based redirects.
    if (process.env.NODE_ENV !== 'development') {
      if (roles.includes(firstDashSegment) && firstDashSegment !== role) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
