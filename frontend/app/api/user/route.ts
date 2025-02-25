import { COUCHDB_URL, COUCHDB_USER, COUCHDB_PASSWORD } from "@/app/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    const { email, password } = await req.json();

    console.log(COUCHDB_USER, COUCHDB_PASSWORD);

    // Authenticate with CouchDB
    const couchResponse = await fetch(`${COUCHDB_URL}/_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}`,
      },
      body: JSON.stringify({
        name: email,
        password: password,
      }),
    });
  
    if (!couchResponse.ok) {
      return NextResponse.json({ error: "Failed to login" }, { status: 401 });
    }
  
    // Extract the Set-Cookie header from CouchDB's response
    const setCookieHeader = couchResponse.headers.get("set-cookie");
  
    // Create a response for the client
    const res = NextResponse.json({ success: true });
    
    // If the header is present, forward it to the client
    if (setCookieHeader) {
      res.headers.set("Set-Cookie", setCookieHeader);
    }
    
    return res;
}

export async function PUT(req: Request): Promise<NextResponse> {
    const { email, password, name } = await req.json();

    const response: Response = await fetch(`${COUCHDB_URL}/_users/org.couchdb.user:${email}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${
                btoa("user:password")}`,
            },
        body: JSON.stringify({
            name: email,
            password: password,
            "..name": name,
            roles: ["user"],
            type: "user",
        })
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to signup" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(): Promise<NextResponse> {
    const cookieStore = cookies();
    const cookie = (await cookieStore).get("AuthSession")?.value;

    const couchResponse = await fetch(`${COUCHDB_URL}/_session`, {
        method: "DELETE",
        headers: {
            Cookie: `AuthSession=${cookie}`,
        },
    });

    if (!couchResponse.ok) {
        return NextResponse.json({ error: "Failed to logout" }, { status: 401 });
    } else {
        const res = NextResponse.json({ success: true });
        res.headers.set("Set-Cookie", "AuthSession=; Max-Age=0; Path=/; HttpOnly");
        return res;
    }
}