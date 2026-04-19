import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth/cookies";

const PROTECTED_PREFIXES = ["/dashboard", "/agent", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Old route → new route redirect (per architectural decision: rename scenenaries → experiences)
  if (pathname === "/scenenaries" || pathname.startsWith("/scenenaries/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/scenenaries/, "/experiences");
    return NextResponse.redirect(url, 308);
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    // Deeper role checks happen in the page itself (cookie presence is enough at edge).
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/scenenaries/:path*",
    "/scenenaries",
    "/dashboard/:path*",
    "/dashboard",
    "/agent/:path*",
    "/agent",
    "/admin/:path*",
    "/admin",
  ],
};
