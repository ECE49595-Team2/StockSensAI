import { COUCHDB_URL, COUCHDB_URL_AUTH } from "@/app/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nano from "nano";


export async function POST(req: Request): Promise<NextResponse> {
    const { email, password } = await req.json();

    const response = await fetch(`${COUCHDB_URL}/_session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: email,
            password: password,
        }),
        credentials: "include",
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const rawCookie = response.headers.get("set-cookie");
    const authSessionMatch = rawCookie!.match(/AuthSession=([^;]+)/);
    const res = NextResponse.json({ success: true });
    if (authSessionMatch) {
        res.cookies.set({
            name: "AuthSession",
            path: "/",
            value: authSessionMatch[1],
            httpOnly: true
        });
    }

    return res;
}

export async function PUT(req: Request): Promise<NextResponse> {
    const { email, password, name } = await req.json();

    const client = nano(COUCHDB_URL_AUTH);
    const usersDb = client.use("_users");
    const prefsDb = client.use("prefs");

    try {
        await usersDb.insert({
            _id: `org.couchdb.user:${email}`,
            name: email,
            password: password,
            roles: ["user"],
            type: "user",
        } as { _id: string; name: string; password: string; roles: string[]; type: string });


        await prefsDb.insert({
            _id: email,
            prefs: {
                name: name,
                llmSettings: {
                    model: "DeepSeekV3",
                    fullPerspective: false,
                }
            }
        } as { _id: string; prefs: { name: string } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred when signing up" }, { status: error instanceof Error && "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500 });
    }
}

export async function DELETE(): Promise<NextResponse> {
    const cookieStore = cookies();
    const cookie = (await cookieStore).get("AuthSession")?.value;

    if (!cookie) {
        return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const client = nano({
        url: COUCHDB_URL_AUTH,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${cookie}`,
            },
        },
    });

    try {
        await client.request({
            method: "DELETE",
            path: `/_session`,
            headers: {
                Cookie: `AuthSession=${cookie}`,
            },
        });
        const res = NextResponse.json({ success: true });
        res.headers.set("Set-Cookie", "AuthSession=; Max-Age=0; Path=/; HttpOnly");
        return res;
    } catch {
        return NextResponse.json({ error: "Failed to logout" }, { status: 401 });
    }
}