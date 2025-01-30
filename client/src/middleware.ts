import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/auth";

const AuthRoutes = ["/login", "/register"];

// const roleBasedRoutes = {
//   ADMIN: [/^\/admin/],
// };

const authenticatedRoutes = ["/profile", "/"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();
  // Allow access to public routes (login/register)
  if (AuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }


  // Redirect unauthenticated users to login
  if (!user || !user._id) {
    return NextResponse.redirect(
      new URL(`/login`, request.url)
    );
  }
    // Allow access to the root `/` route for authenticated users
  if (authenticatedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Handle role-based access
  if (pathname.startsWith("/admin")&& user?.role === "admin") {
  
    // Redirect unauthorized users to home
    return NextResponse.next();
  }

  // Default: allow access to other routes
  return NextResponse.redirect(new URL("/login", request.url));
}

// Define paths that should be checked by middleware
export const config = {
  matcher: ["/", "/profile/:path*", "/admin/:path*", "/login", "/register"],
};
