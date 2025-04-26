import { NextResponse } from "next/server";
import nano from "nano";
import { COUCHDB_URL } from "@/app/env";
import { parse } from "cookie";

export async function GET(req: Request): Promise<NextResponse> {

    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${parse(req.headers.get('cookie') || '').AuthSession}`,
            },
        },
    });
    const email = (await client.session()).userCtx.name;
    const db = client.db.use("portfolio");

    const result = await db.find({
        selector: {
            user: email
        }
    });

    if (!result.docs || result.docs.length === 0) {
        return NextResponse.json(
            { error: "No portfolios found" },
            { status: 404 }
        );
    }

    return NextResponse.json(result.docs, { status: 200 });

}