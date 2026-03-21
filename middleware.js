import { NextResponse } from "next/server";
import { authConstants } from "@/lib/auth-constants";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname.startsWith("/admin/login");

  if (!isAdminPath || isLoginPath) {
    return NextResponse.next();
  }

  const hasSession = Boolean(
    request.cookies.get(authConstants.SESSION_COOKIE_NAME)?.value
  );

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
