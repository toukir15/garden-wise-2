import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let server actions through — they are POST requests identified by Next-Action header
  if (request.headers.has("Next-Action")) {
    return NextResponse.next();
  }

  // Public routes — always allow
  if (AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  // No token → redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = decodeJwtPayload(accessToken);

  // Invalid/expired token → redirect to login
  if (!user?._id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin routes require admin role
  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/admin/:path*", "/login", "/register"],
};
