import { COUCHDB_URL, COUCHDB_URL_AUTH } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { cookies } from "next/headers";
import nano from "nano";
import { redirect } from "next/navigation";


export async function BalanceWidget() {
    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("prefs");
    const cookie = (await cookies()).get("AuthSession")?.value;
    if (!cookie) {
        redirect("/?unauthorized=true");
    }

    const response = await fetch(`${COUCHDB_URL}/_session`, {
        method: "GET",
        cache: "default",
        credentials: "include",
        headers: {
            cookie: `AuthSession=${cookie}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch session.");
    }
    const session = await response.json();
    const userId = session?.userCtx?.name;
    if (!userId) {
        redirect("/?unauthorized=true");
    }

    const results = await db.find({
        selector: {
            _id: userId,
        },
    });

    const responseJson: { _id: string; _rev: string; prefs: { balance: number; } } = results.docs[0] as unknown as { _id: string; _rev: string; prefs: { balance: number; } };

    if (!responseJson) {
        return <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Balance</h1>
            <p className="text-4xl font-bold slide-up">N/a</p>
        </Card>
    }
    if (!responseJson.prefs.balance) {
        responseJson.prefs.balance = 0;
    }

    return (
        <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Balance</h1>
            <p className="text-4xl font-bold slide-up">${responseJson.prefs.balance}</p>
        </Card>
    );

}