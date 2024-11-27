import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/auth";

const AuthRoutes = ["/login", "/register"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  ADMIN: [/^\/admin/], // Matches all routes under "/admin"
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();

  // Allow access to public routes (login/register)
  if (AuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!user || !user._id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to the root `/` route for authenticated users
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Handle role-based access
  if (pathname.startsWith("/admin")) {
    // Allow access only if the user has the "ADMIN" role
    if (user?.role === "admin") {
      return NextResponse.next();
    }
    // Redirect unauthorized users to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Default: allow access to other routes
  return NextResponse.next();
}

// Define paths that should be checked by middleware
export const config = {
  matcher: ["/", "/admin/:path*", "/login", "/register"],
};
