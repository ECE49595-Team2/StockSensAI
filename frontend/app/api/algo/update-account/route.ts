import { COUCHDB_URL } from "@/app/env";
import nano from "nano";
import { parse } from "cookie";
import { ALGO_URL } from "@/app/env";

export async function GET(req: Request): Promise<Response> {
    const cookies = parse(req.headers.get("cookie") || "");
    const authSession = cookies.AuthSession;

    if (!authSession) {
        return new Response("Unauthorized", { status: 401 });
    }

    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession}`,
            },
        },
    });

    const session = await client.session();
    if (!session || !session.userCtx || !session.userCtx.name) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.userCtx.name;
    console.log("User ID from session:", userId);

    const db = client.db.use("portfolio");
    const results = await db.find({
        selector: {
            user: userId,
        },
    });

    const portfolio_id: string = results.docs[0]._id;
    const algoResponse = await fetch(`${ALGO_URL}/update-account-history?portfolio_id=${portfolio_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolio_id: portfolio_id }),
    });

    if (!algoResponse.ok) {
        console.error("Failed to update account history:", algoResponse.statusText);
        return new Response("Failed to update account history", { status: algoResponse.status });
    }

    const { new_value }: { message: string, new_value: []} = await algoResponse.json();

    

    return new Response(JSON.stringify(new_value), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=86400" },
    });
}