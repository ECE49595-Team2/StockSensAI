"use server";
import { COUCHDB_URL } from "@/app/env";
import nano from "nano";
import { Card } from "@/shadcn/ui/card";
import StockChart_Client, { Transaction } from "./chart_client";
import { cookies } from "next/headers";

async function StockChart({ id }: { id: string }) {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        return <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Position history</h1>
            <p className="text-4xl font-bold slide-up">N/a</p>
        </Card>;
    }

    try {
        const client = nano({
            url: COUCHDB_URL,
            requestDefaults: {
                headers: {
                    Cookie: `AuthSession=${authSession.value}`,
                },
            },
        });
        const db = client.db.use("portfolio");
        const result = await db.find({
            selector: {
                _id: id,
            },
            limit: 1,
        });
        const portfolioDoc = result.docs[0] as unknown as { transactions: { [symbol: string]: Transaction[] } };
        if (!portfolioDoc) {
            return <div>Portfolio not found</div>;
        }
        const transactions = portfolioDoc.transactions as unknown as { [symbol: string]: Transaction[] };

        return (
            <Card className="p-4">
                <h1 className="text-md font-bold text-gray-500">Position history</h1>
                <StockChart_Client transactions={transactions} />
            </Card>
        );

    } catch (error) {
        console.error("Error fetching portfolio transactions:", error);
        return <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Position history</h1>
            <p className="text-4xl font-bold slide-up">N/a</p>
        </Card>;
    }
}

export default StockChart;


