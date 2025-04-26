"use server";
import { COUCHDB_URL } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { Bot } from "lucide-react";
import nano from "nano";
import { cookies } from "next/headers";

export async function AdviserWidget() {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        return <p className="text-red-500">You must be logged in to view this widget.</p>;
    }
    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession.value}`,
            },
        },
    });

    const db = client.db.use("prefs");
    const userSession = await client.session();
    const userEmail = userSession.userCtx.name;
    const userPrefs = await db.get(userEmail).catch(() => null) as { prefs: { llmSettings: { model: string } } } | null;
    if (!userPrefs) {
        return <p className="text-red-500">User preferences not found.</p>;
    }
    const model = userPrefs.prefs.llmSettings?.model;
    if (!model) {
        return <p className="text-red-500">LLM model not found in user preferences.</p>;
    }

    const portfolioDb = client.db.use("portfolio");
    const result = await portfolioDb.find({
        selector: {
            user: userEmail,
        },
    });
    const portfolio = result.docs[0] as unknown as { positions: { [key: string]: number } } | null;
    console.log("Portfolio:", result);
    if (!portfolio) {
        return <p className="text-red-500">Portfolio not found.</p>;
    }
    const positions = portfolio.positions;
    if (!positions || Object.keys(positions).length === 0) {
        return (<Card className="p-4 block overflow-hidden col-span-2 w-full">
            <Bot />
            <h1 className="text-md font-bold text-gray-500">Adviser</h1>
            <p>No stocks owned yet.</p>
        </Card>);
    }
    const llmResponse = await fetch("http://localhost:8011/summary", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            positions: Object.entries(positions).map(([symbol, quantity]) => ({ symbol, quantity })),
            model: model,
        }),
    });
    if (!llmResponse.ok) {
        return <p className="text-red-500">Failed to fetch advice from LLM.</p>;
    }
    const adviceData = await llmResponse.json() as { response: string } | null;
    const advice: string = adviceData?.response || "No advice available";

    return (
        <Card className="p-4 block overflow-hidden col-span-2 w-full">
            <Bot />
            <h1 className="text-md font-bold text-gray-500">Adviser</h1>
            <p className="text-xl font-bold slide-up">{advice}</p>
        </Card>
    );
}