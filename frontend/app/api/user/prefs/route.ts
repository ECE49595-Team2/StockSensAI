import { COUCHDB_URL } from "@/app/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
    const { email } = data;

    const response = await fetch(`${COUCHDB_URL}/_users/org.couchdb.user:${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("user:password")}`,
        },
    });
    const user = await response.json();
    return NextResponse.json(user);

}