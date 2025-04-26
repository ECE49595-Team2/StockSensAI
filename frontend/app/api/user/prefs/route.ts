import { COUCHDB_URL } from "@/app/env";
import { NextResponse } from "next/server";
import nano from "nano";
import { cookies } from "next/headers";

export async function GET()
{
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession.value}`,
            },
        },
    });
    const email = (await client.session()).userCtx.name;
    const db = client.db.use("prefs");

    const result = await db.find({
        selector: {
            _id: email,
        },
    });

    const userDetails = result.docs[0] as unknown as { prefs: { name: string, balance: number } };

    return NextResponse.json(userDetails.prefs, { status: 200 });
}

export async function POST(req: Request): Promise<NextResponse> {
    const settings = await req.json();
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession.value}`,
            },
        },
    });
    const email = (await client.session()).userCtx.name;
    const db = client.db.use("prefs");
    const existingDoc = await db.get(email).catch(() => null);
    if (existingDoc) {
        // Update existing document
        try {
            await db.insert({
                ...existingDoc,
                prefs: settings,
            } as Record<string, unknown>);
            return NextResponse.json({ success: true }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }

    try {
        await db.insert({
            _id: email,
            prefs: settings,
        } as Record<string, unknown>);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}