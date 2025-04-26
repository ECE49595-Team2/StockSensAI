"use server";
import StockChart from "./charts/chart";
import NewsAnalysis from "./news-analysis/news-analysis";
import PortfolioName from "./portfolio-name";
import StocksContainer from "./stocks-container/stocks-container";
import SidebarName from "./stocks-container/sidebar-name";
import { Switch } from "@/shadcn/ui/switch";

async function PortfolioDetails({ params }: { params: Promise<{ id: string }> }) {
    const queries = await params;
    const id = queries.id;

    return (
        <div className="mt-3 text-black max-w-7xl w-full ml-auto mr-auto">
            <PortfolioName id={id} />
            <h1 className="text-3xl mt-6 mb-6 font-bold text-tertiary bg-secondary p-4 rounded-sm">Portfolio Value</h1>
            <div className="flex flex-row w-full gap-2">
                <h1>Toggle Backtrading</h1>
                <Switch
                    checked={false}
                    className="w-10 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                />
            </div>
            <h1 className="text-3xl mt-6 mb-6 font-bold text-tertiary bg-secondary p-4 rounded-sm">Stocks</h1>
            <StocksContainer id={id}>
                <div className="flex flex-col flex-1 gap-4 pb-10 w-full overflow-y-auto h-full">
                    <SidebarName />
                    <div className="flex flex-col gap-4 mt-4 w-full">
                        <StockChart id={id} />
                    </div>
                    <NewsAnalysis />
                </div>
            </StocksContainer>
        </div>
    );
}

export default PortfolioDetails;