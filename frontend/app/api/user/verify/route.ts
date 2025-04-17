import { COUCHDB_URL } from "@/app/env";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import nano from "nano";

export async function GET() {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get("AuthSession")?.value;

  if (!cookie) {
    return NextResponse.json(
      { error: "No AuthSession cookie found" },
      { status: 404 }
    );
  }

  // Create a Nano client instance pointing to your CouchDB URL
  const client = nano(COUCHDB_URL);

  try {
    // Use the client's session endpoint, passing the cookie in the header.
    // Nano's session method will call the _session endpoint and return session details.
    const session = await client.request({
      path: "_session",
      method: "GET",
      headers: { Cookie: `AuthSession=${cookie}` },
    });

    // Check if there's a valid user returned in the session info.
    if (session?.userCtx?.name) {
      return NextResponse.json(
        { message: "User verified successfully", email: session.userCtx.name },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401, headers: { "Set-Cookie": "AuthSession=; Max-Age=0; Path=/; HttpOnly" } }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}