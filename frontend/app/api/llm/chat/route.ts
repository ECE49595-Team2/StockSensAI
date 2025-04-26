import { COUCHDB_URL } from "@/app/env";
import nano from "nano";
import { cookies } from "next/headers";

type Message = {
    role: "user" | "assistant";
    content: string;
}

export async function POST(request: Request) {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        return new Response("Unauthorized", { status: 401 });
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
        return new Response("User preferences not found", { status: 404 });
    }
    if (!userPrefs.prefs || !userPrefs.prefs.llmSettings || !userPrefs.prefs.llmSettings.model) {
        return new Response("LLM settings not found in user preferences", { status: 400 });
    }
    const model = userPrefs.prefs.llmSettings.model;

    const messages: Message[] = await request.json() as Message[];
    const url = "http://localhost:8011/chat";

    console.log("Sending messages:", messages);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversation: messages,
            model: model,
        }),
    });

    if (!response.ok) {
        return new Response("Failed to fetch chat response", { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}