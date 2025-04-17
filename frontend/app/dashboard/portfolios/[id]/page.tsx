import StockChart from "./charts/chart";
import PortfolioName  from "./portfolio-name";
import PortfolioSidebar from "./sidebar/sidebar";
import SidebarName from "./sidebar/sidebar-name";

async function PortfolioDetails({ params }: { params: Promise<{ id: string }> }) {
    const queries = await params;
    const id = queries.id;

    return (
        <div className="mt-3 text-black flex flex-1 flex-col overflow-hidden">
            <PortfolioName id={id} />
            <PortfolioSidebar id={id}>
                <div className="flex flex-col gap-2 w-full flex-1 overflow-y-auto">
                    <SidebarName />
                    <StockChart id={id} />
                </div>
            </PortfolioSidebar>
        </div>
    );
}

export default PortfolioDetails;