import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { email: string } }) {
    const queries = await params;
    const email = queries.email;

    const stringifiedEmail = JSON.stringify(email);
    const response = await fetch(`${COUCHDB_URL}/portfolio/_design/queries/_view/allPortfolios?key=${encodeURIComponent(stringifiedEmail)}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
        }
    });
    console.log("response", response);

    if (!response.ok) {
        return NextResponse.error();
    }
    
    const data = await response.json();

    const portfolios = data.rows[0].value;
    return NextResponse.json(portfolios);
}