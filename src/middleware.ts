import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes (adjust if you want different rules)
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("token")?.value ||
      request.cookies.get("auth-token")?.value;

    // If not logged in, redirect to login page
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
