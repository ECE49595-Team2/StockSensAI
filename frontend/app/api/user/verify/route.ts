import { COUCHDB_URL } from "@/app/env";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(): Promise<NextResponse> {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get("AuthSession")?.value;

  if (!cookie) {
    return NextResponse.json(
      { error: "No AuthSession cookie found" },
      { status: 404 }
    );
  }

  // Use GET to check the session details
  const response: Response = await fetch(`${COUCHDB_URL}/_session`, {
    method: "GET",
    headers: {
      Cookie: `AuthSession=${cookie}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to validate session` },
      { status: 401 }
    );
  } else {
    const sessionData = await response.json();
    return NextResponse.json({ success: true, session: sessionData, cookie: cookie }, { status: 200 });
  }
}