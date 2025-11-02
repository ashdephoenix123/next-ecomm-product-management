// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. Get the authentication token from the cookies
  // !!! UPDATE 'auth-token' with the actual name of your cookie
  const token = request.cookies.get("auth-token")?.value;

  // 2. Get the path the user is trying to access
  const { pathname } = request.nextUrl;

  // 3. Define your public paths (pages that don't require login)
  const publicPaths = ["/login"];

  // Check if the current path is one of the public paths
  const isPublicPath = publicPaths.includes(pathname);

  // --- Start of Logic ---

  // Requirement 2: If the user IS logged in and tries to access a public path
  // (like the login page), redirect them to the home page.
  if (token && isPublicPath) {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Requirement 1: If the user is NOT logged in and tries to access a
  // protected path, redirect them to the login page.
  if (!token && !isPublicPath) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If none of the above, the user is allowed to proceed.
  // (e.g., logged in and on a protected page, or not logged in and on a public page)
  return NextResponse.next();
}

// --- End of Logic ---

// 4. Config: Specify which paths the middleware should run on
// This matcher avoids running middleware on static files, images, etc.
// It runs on all pages *except* for API routes, _next/static, _next/image, etc.
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
};
