import { ALGO_URL } from "@/app/env";

export async function POST(req: Request) {
    const { id, singleOrMulti, symbol }: {
        id: string;
        singleOrMulti: "single" | "multiple";
        symbol: string;
    } = await req.json();

    const algoUrl = `${ALGO_URL}/${singleOrMulti}_day_performance?portfolio_id=${id}${singleOrMulti == "multiple" ? `&symbol=${symbol}` : ""}`;

    const response = await fetch(algoUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log("Response from algorithm:", response.body);
    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to execute algorithm" }), { status: 500 });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}