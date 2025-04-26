"use server";
import { COUCHDB_URL } from "@/app/env";
import nano from "nano";
import { redirect } from "next/navigation";
import { LucideFrown } from "lucide-react";
import { cookies } from "next/headers";
import StocksContainerClient from "./stocks-container-client";
import AddStockButton from "./add-stock-button";

type StockData = number;
type Stocks = {
    [symbol: string]: StockData;
};

async function StocksContainer({ children, id }: { children: React.ReactNode, id: string }) {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        redirect("/?unauthorized=true");
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
        const portfolioDoc = result.docs[0] as unknown as { positions: { [symbol: string]: StockData } };
        if (!portfolioDoc) {
            redirect("/dashboard/portfolios?error=true");
        }
        const stocks: Stocks = portfolioDoc.positions as unknown as Stocks;

        return (
            <div className="flex flex-col gap-4 flex-1">

                {
                    Object.keys(stocks).length !== 0 && <StocksContainerClient id={id} stocks={stocks} />
                }

                {
                    Object.keys(stocks).length === 0 ?
                        <div className="flex flex-col flex-1 justify-center items-center gap-5 p-10">
                            <LucideFrown size={'5rem'} color="grey" />
                            <h1 className="text-2xl font-bold text-gray-500">No stocks found</h1>
                            <p className="text-gray-500">Add stocks to your portfolio to see them here.</p>
                            <AddStockButton id={id} />
                        </div>
                        : children
                }
            </div>
        )
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        return (
            <div className="flex flex-col flex-1 justify-center items-center gap-5">
                <LucideFrown size={'5rem'} color="grey" />
                <h1 className="text-2xl font-bold text-red">Error fetching portfolio</h1>
                <p className="text-red">Please try again later.</p>
            </div>
        );
    }
}

export default StocksContainer;