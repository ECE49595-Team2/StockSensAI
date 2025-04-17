import { COUCHDB_URL_AUTH } from "@/app/env";
import { Skeleton } from "@/shadcn/ui/skeleton";
import nano from "nano";

async function PortfolioName({ id }: { id: string }) {
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
        return <h1 className="font-bold text-4xl font-anton text-background">Portfolio</h1>;
    }
    const portfolio = portfolioDoc as unknown as { name: string };
    console.log("portfolioDoc", result);

    if (!portfolio || !portfolio.name) {
        return <Skeleton className="h-10 w-1/2" />;
    }

    return (
        <div className="w-full"> 
            <h1 className="font-bold text-4xl font-anton text-background">{portfolio.name}</h1>
        </div>
    );
}

export default PortfolioName;