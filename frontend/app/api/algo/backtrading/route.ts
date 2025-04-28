import { ALGO_URL } from "@/app/env";

export async function POST(req: Request) {
    const { id, symbol, isBacktrading } = await req.json();
    console.log("Received request to toggle backtrading:", { id, symbol, isBacktrading });
    const endpoint = isBacktrading ? "start_strategy" : "stop_strategy";

    const response = await fetch(`${ALGO_URL}/${endpoint}?portfolio_id=${id}&symbol=${symbol}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Response from algorithm:", response.ok);

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to execute algorithm" }), { status: 500 });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}