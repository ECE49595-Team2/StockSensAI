import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const authSession = (await cookieStore).get("AuthSession")?.value;

  if (!authSession) {
    const url = new URL(req.url);
    url.pathname = "/"; // Redirect to the homepage
    url.searchParams.set("unauthorized", "true"); // Add the unauthorized query parameter
    return NextResponse.redirect(url);
  } else {
    return NextResponse.next(); // Allow authenticated users to proceed
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply to protected routes
};