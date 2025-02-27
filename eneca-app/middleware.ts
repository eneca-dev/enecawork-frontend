import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Array of public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/pending-verification",
  "/password-reset-sent",
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // If the user is on the root path, redirect based on authentication status
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/main", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow access to public routes without authentication
  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and tries to access auth pages, redirect to main
    if (token) {
      return NextResponse.redirect(new URL("/main", request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - check for authentication
  if (!token) {
    // Save the original URL to redirect after login
    const searchParams = new URLSearchParams()
    searchParams.set("from", pathname)
    return NextResponse.redirect(new URL(`/login?${searchParams.toString()}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

