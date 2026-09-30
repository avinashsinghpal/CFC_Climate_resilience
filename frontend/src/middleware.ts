import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that strictly require OFFICIAL role
const OFFICIAL_ROUTES = [
  "/dashboard/official",
  "/alerts",
  "/forecast",
  "/sensors",
  "/integrity",
];

// Routes that require any authenticated user
const AUTH_REQUIRED_ROUTES = [
  "/dashboard/public",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("fcap_token")?.value;
  const role = request.cookies.get("fcap_role")?.value;

  const isOfficialRoute = OFFICIAL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRequiredRoute = AUTH_REQUIRED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If user is already logged in and visits /login or /register, redirect to their role dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    if (role === "OFFICIAL") {
      return NextResponse.redirect(new URL("/dashboard/official", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/public", request.url));
    }
  }

  // Official route protection
  if (isOfficialRoute) {
    if (!token) {
      // Unauthenticated -> redirect to login with return path
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "OFFICIAL") {
      // Authenticated but wrong role (e.g. PUBLIC) -> redirect to unauthorized
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // General auth required route protection (e.g. /dashboard/public)
  if (isAuthRequiredRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg (metadata icons)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
