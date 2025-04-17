import { COUCHDB_URL_AUTH } from "@/app/env";
import nano from "nano";
import PortfolioSidebarClient from "./sidebar_client";
import { redirect } from "next/navigation";

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
    const portfolioDoc = result.docs[0] as unknown as any;
    if (!portfolioDoc) {
        redirect("/dashboard/portfolios?error=true");
    }
    console.log("portfolioDoc", result);
    let stocks: Stocks = portfolioDoc.positions as unknown as Stocks;

    return (
        <div className="flex flex-row max-h-screen h-full gap-4 ">
            <div className="flex flex-col w-1/4 min-w-[300px] bg-background rounded-lg p-4 gap-3">
                <PortfolioSidebarClient stocks={stocks} />
            </div>
            {children}
        </div>
    )
}

export default PortfolioSidebar;