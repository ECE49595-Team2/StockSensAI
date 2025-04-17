import { COUCHDB_URL_AUTH } from "@/app/env";
import { ChartConfig, ChartContainer } from "@/shadcn/ui/chart";
import nano from "nano";
import { Card } from "@/shadcn/ui/card";
import StockChart_Client from "./chart_client";

export const chartConfig = {
    timestamp: {
        label: "Time",
        color: "orange"
    },
    quantity: {
        label: "Quantity",
        color: "purple"
    },
} satisfies ChartConfig;

export type Transaction = {
    type: "Buy" | "Sell";
    quantity: number;
    price: number;
    date: string;
}

async function StockChart({ id }: { id: string }) {
    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("portfolio");
    const result = await db.find({
        selector: {
            _id: id,
        },
        limit: 1,
    });
    const portfolioDoc = result.docs[0] as unknown as any;
    if (!portfolioDoc) {
        return <div>Portfolio not found</div>;
    }
    const transactions = portfolioDoc.transactions as unknown as { [symbol: string]: Transaction[] };

    return (
        <Card className="flex shrink-1 grow-0 p-4">
            <h1 className="text-md font-bold text-gray-500">Position history</h1>
            <StockChart_Client transactions={transactions} />
        </Card>
    );
}

export default StockChart;


