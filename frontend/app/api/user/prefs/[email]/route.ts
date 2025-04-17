import { COUCHDB_URL, COUCHDB_URL_AUTH } from "@/app/env";
import { NextResponse } from "next/server";
import nano from "nano";

export async function GET(_: Request, { params }: { params: { email: string } })
{
    const queries = await params;
    const email = queries.email;

    const client = nano(COUCHDB_URL);
    const db = client.db.use("prefs");
    let userDetails;

    const result = await db.find({
        selector: {
            _id: email,
        },
    });

    userDetails = result.docs[0] as unknown as any;

    return NextResponse.json(userDetails.prefs, { status: 200 });
}