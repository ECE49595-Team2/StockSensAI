export async function POST(req: Request, { params }: { params: Promise<{ symbol: string, id: string }> }) {
    const queries = await params;
    const symbol = queries.symbol;
    const id = queries.id;
    const { quantity } = await req.json();
    const algoUrl = `http://localhost:8000/buy?portfolio_id=${id}&symbol=${symbol}&quantity=${quantity}`;

    const response = await fetch(algoUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Response from algorithm:", response);

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to execute algorithm" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ symbol: string, id: string }> }) {
    const queries = await params;
    const symbol = queries.symbol;
    const id = queries.id;
    const { quantity } = await req.json();
    const algoUrl = `http://localhost:8000/sell?portfolio_id=${id}&symbol=${symbol}&quantity=${quantity}`;

    const response = await fetch(algoUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Response from algorithm:", response);

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to execute algorithm" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}