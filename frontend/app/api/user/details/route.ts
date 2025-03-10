import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";

export async function POST(req: Request)
{
    const { email } = await req.json();
    const response = await fetch(`${COUCHDB_URL}/_users/org.couchdb.user:${email}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}`,
        }
    });

    if (!response.ok) {
        return new Response(JSON.stringify({}), { status: 500 });
    }
    const userDetails = await response.json();
    return new Response(JSON.stringify(userDetails), { status: 200 });
}