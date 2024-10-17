import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/auth";

const AuthRoutes = ["/login", "/register"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  ADMIN: [/^\/admin/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();

  // Safely check if the user object exists
  if (!user || !user._id) {
    // Allow access to login and register pages even if not authenticated
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated, allow access to the root `/` route
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Handle role-based routes (e.g., admin routes)
  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    const routes = roleBasedRoutes[user?.role as Role];

    // If the user has the correct role for the route, allow access
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  // If the user is authenticated but not authorized for the route, redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}

// Define paths that should be checked by middleware
export const config = {
  matcher: ["/admin/:page*", "/", "/login", "/register"],
};
