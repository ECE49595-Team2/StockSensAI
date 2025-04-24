import { NextResponse } from "next/server";
import nano from "nano";
import { COUCHDB_URL_AUTH } from "@/app/env";

export async function GET(_: Request, { params }: { params: Promise<{ email: string }> }): Promise<NextResponse> {

    const queries = await params;
    const email = queries.email;
    const client = nano(COUCHDB_URL_AUTH);
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