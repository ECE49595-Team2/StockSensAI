import PortfolioName  from "./portfolio-name";
import PortfolioSidebar from "./sidebar";

async function PortfolioDetails({ params }: { params: { id: string } }) {
    const queries = await params;
    const id = queries.id;

    return (
        <div className="text-black flex flex-1 flex-col">
            <PortfolioName />
            <PortfolioSidebar id={id}>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold font-geist-mono text-background">Stock Name</h1>
                </div>
            </PortfolioSidebar>
        </div>
    );
}

export default PortfolioDetails;