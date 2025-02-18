import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authSession = req.cookies.get("AuthSession"); // CouchDB Auth Cookie

  if (!authSession) {
    return NextResponse.redirect(new URL("/?unauthorized=true", req.url)); // Redirect unauthenticated users
  }

  return NextResponse.next(); // Continue to the page if authenticated
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply to protected routes
};