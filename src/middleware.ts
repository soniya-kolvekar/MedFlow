import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('medflow-role')?.value;
  const path = request.nextUrl.pathname;

  // 1. If user is NOT logged in and trying to access a protected route
  if (!role && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If user IS logged in and trying to access auth pages (login/signup)
  if (role && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // 3. Role-based routing (Prevent roles from accessing other dashboards)
  if (role && path.startsWith('/dashboard')) {
    // Exact match for their own dashboard is fine
    if (path.startsWith(`/dashboard/${role}`)) {
      return NextResponse.next();
    }
    
    // If they try to access another role's dashboard, bounce them back to theirs
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
