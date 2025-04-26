import { COUCHDB_URL_AUTH } from "@/app/env";
import { Skeleton } from "@/shadcn/ui/skeleton";
import nano from "nano";

async function PortfolioName({ id }: { id: string }) {
    try {
        const client = nano(COUCHDB_URL_AUTH);
        const db = client.db.use("portfolio");
        const result = await db.find({
            selector: {
                _id: id,
            },
            limit: 1,
        });
        const portfolioDoc = result.docs[0] as unknown as { name: string, description: string };
        if (!portfolioDoc) {
            return <h1 className="font-bold text-4xl font-anton text-background">Portfolio</h1>;
        }
        const portfolio: { name: string, description: string } = portfolioDoc;

        if (!portfolio || !portfolio.name) {
            return <Skeleton className="h-10 w-1/2" />;
        }

        return (
            <div className="w-full">
                <h1 className="font-bold text-4xl font-anton text-background">{portfolio.name}</h1>
                <h3>{portfolio.description}</h3>
            </div>
        );
    } catch (error) {
        console.error("Error fetching portfolio name:", error);
        return <h1 className="font-bold text-4xl font-anton text-red">Error fetching portfolio name</h1>;
    }
}

export default PortfolioName;