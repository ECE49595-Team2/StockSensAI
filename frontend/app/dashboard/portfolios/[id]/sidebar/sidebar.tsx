import { COUCHDB_URL_AUTH } from "@/app/env";
import nano from "nano";
import PortfolioSidebarClient from "./sidebar_client";
import { redirect } from "next/navigation";
import { LucideFrown } from "lucide-react";

type StockData = number;
type Stocks = {
    [symbol: string]: StockData;
};

async function PortfolioSidebar({ children, id }: { children: React.ReactNode, id: string }) {

    const client = nano(COUCHDB_URL_AUTH);
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
        <div className="flex flex-row max-h-screen h-full gap-4 ">
            <div className="flex flex-col w-1/4 min-w-[300px] bg-background rounded-lg p-4 gap-3">
                <PortfolioSidebarClient id={id} stocks={stocks} />
            </div>
            {Object.keys(stocks).length === 0 ? 
            <div className="flex flex-col flex-1 justify-center items-center gap-5">
                <LucideFrown size={'5rem'} color="grey"/>
                <h1 className="text-2xl font-bold text-gray-500">No stocks found</h1>
                <p className="text-gray-500">Add stocks to your portfolio to see them here.</p>
            </div> 
            : children
            }
        </div>
    )
}

export default PortfolioSidebar;