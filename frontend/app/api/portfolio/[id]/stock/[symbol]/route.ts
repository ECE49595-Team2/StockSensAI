import { COUCHDB_URL_AUTH } from "@/app/env";
import nano from "nano";

type Portfolio = {
    _id: string;
    date_created: string;
    user: string;
    name: string;
    transactions: object[];
    buying_power: number[][];
    positions: { [key: string]: number };
    account_value_history: object[];
    strategy_id: string;
};

export async function POST(req: Request, { params }: { params: Promise<{ symbol: string, id: string }> }) {
    const queries = await params;
    const symbol = queries.symbol;
    const id = queries.id;

    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("portfolio");

    try {
        const existingDoc: Portfolio = await db.get(id) as unknown as Portfolio;
        if (!existingDoc) {
            return new Response(JSON.stringify({ error: "Portfolio not found" }), { status: 404 });
        }

        const updatedDoc = {
            ...existingDoc,
            positions: {
                ...existingDoc.positions,
                [symbol]: (existingDoc.positions[symbol] || 0) + 1,
            },
        };

        await db.insert(updatedDoc);

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to update portfolio" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}