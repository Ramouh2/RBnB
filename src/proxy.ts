import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, getSecret, verifySessionToken } from "@/lib/auth/session-token";

/**
 * Redirections optimistes RBnB (navigations GET uniquement) :
 * - /login avec une session valide → /dashboard
 * - /dashboard sans session valide → /login
 * L'autorisation réelle reste vérifiée côté serveur par chaque page protégée.
 * Les requêtes de Server Actions (POST) ne sont jamais redirigées : la chorégraphie
 * de LiquidLogin se termine avant la navigation vers le dashboard.
 */
export async function proxy(request: NextRequest) {
  if (request.method !== "GET") return NextResponse.next();

  const secret = getSecret();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = secret && token ? await verifySessionToken(token, secret) : null;
  const { pathname } = request.nextUrl;

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
