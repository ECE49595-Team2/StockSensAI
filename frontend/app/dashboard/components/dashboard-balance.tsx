import { COUCHDB_URL } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { cookies } from "next/headers";
import nano from "nano";
import { redirect } from "next/navigation";


export async function BalanceWidget() {
    try {
        const client = nano({
            url: COUCHDB_URL,
            requestDefaults: {
                headers: {
                    Cookie: `AuthSession=${(await cookies()).get("AuthSession")?.value}`,
                },
            },
        });
        const db = client.db.use("portfolio");
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
        if (!userId || userId === "null" || userId === "admin") {
            redirect("/?unauthorized=true");
        }

        console.log("BalanceWidget userId", userId);
        const results = await db.find({
            selector: {
                user: userId,
            },
        });

        const responseJson = results?.docs as unknown as { buying_power: [number, string][] }[];

        if (!responseJson) {
            return <Card className="p-4 block overflow-hidden col-span-2">
                <h1 className="text-md font-bold text-gray-500">Balance</h1>
                <p className="text-4xl font-bold slide-up">N/a</p>
            </Card>
        }

        let buyingPower: number | null | undefined = null as number | null | undefined;
        responseJson.forEach((doc) => {
            if (doc.buying_power && doc.buying_power.length > 0) {

                if (buyingPower === null) {
                    buyingPower = 0;
                }
                buyingPower! += doc.buying_power[doc.buying_power.length - 1][0];
            } else {
                buyingPower = null;
            }
        });
        console.log("BalanceWidget responseJson", responseJson);

        return (
            <Card className="p-4 block overflow-hidden col-span-2">
                <h1 className="text-md font-bold text-gray-500">Buying Power</h1>
                <p className="text-4xl font-bold slide-up">${buyingPower !== null && buyingPower !== undefined ? buyingPower.toFixed(2) : "N/a"}</p>
            </Card>
        );

    } catch (error) {
        console.error("Error fetching buying power:", error);
        return (
            <Card className="p-4 block overflow-hidden col-span-2">
                <h1 className="text-md font-bold text-gray-500">Buying Power</h1>
                <p className="text-4xl font-bold slide-up text-red-500">Error loading buying power</p>
            </Card>
        );
    }

}