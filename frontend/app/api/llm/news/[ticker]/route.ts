export async function GET(_: Request, { params }: { params: Promise<{ ticker: string }> }) {
    const queries = await params;
    const ticker = queries.ticker;
    const url = "http://localhost:8011/newsAnalysis";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
            model: "LLAMA",
            ageLim: 0
        }),
    });

    if (!response.ok) {
        return new Response("Failed to fetch news", { status: response.status });
    }

    const data = await response.json();
    console.log(data);

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=86400" },
    });
}