import { COUCHDB_URL_AUTH } from "@/app/env";
import { NextResponse } from "next/server";
import nano from "nano";

export async function GET(_: Request, { params }: { params: Promise<{ email: string }> })
{
    const queries = await params;
    const email = queries.email;

    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("prefs");

    const result = await db.find({
        selector: {
            _id: email,
        },
    });

    const userDetails = result.docs[0] as unknown as { prefs: { name: string, balance: number } };

    return NextResponse.json(userDetails.prefs, { status: 200 });
}