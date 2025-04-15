import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { email: string } })
{
    const queries = await params;
    const email = queries.email;

    const stringifiedEmail = JSON.stringify(`org.couchdb.user:${email}`);
    const response = await fetch(`${COUCHDB_URL}/_users/_design/queries/_view/userPrefs?key=${encodeURIComponent(stringifiedEmail)}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}`,
        }
    });

    if (!response.ok) {
        console.log(response);
        return NextResponse.error();
    }
    const userDetails = await response.json();
    return NextResponse.json(userDetails);
}