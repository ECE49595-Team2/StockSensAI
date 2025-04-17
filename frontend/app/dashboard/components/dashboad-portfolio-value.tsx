import { COUCHDB_URL_AUTH } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import nano from "nano";

type BuyingPower = [number, string][]

type PortfolioDoc = {
    buying_power: BuyingPower;
};

export async function PortfolioValueWidget() {
    try {
        const client = nano(COUCHDB_URL_AUTH);
        const portfolioDb = client.db.use("portfolio");

        const session = await client.relax({
            db: "_session",
            method: "GET",
        });

        const userId = session?.userCtx.name;
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        const results = await portfolioDb.find({
            selector: {
                user: userId,
            },
        });

        results.docs.forEach((doc) => {
            const portfolioDoc = doc as unknown as PortfolioDoc;
            const totalValue = portfolioDoc.buying_power[0][0] || 0;


            return (
                <Card className="p-4 block overflow-hidden col-span-2">
                    <h1 className="text-md font-bold text-gray-500">Portfolio</h1>
                    <p
                        className={`text-4xl font-bold slide-up ${totalValue < 0 ? "text-red-500" : "text-green-500"
                            }`}
                    >
                        ${totalValue.toFixed(2)}
                    </p>
                </Card>
            );

        });
    } catch (error) {
        console.error("Error fetching portfolio value:", error);
        return (
            <Card className="p-4 block overflow-hidden col-span-2">
                <h1 className="text-md font-bold text-gray-500">Portfolio</h1>
                <p className="text-red-500">Error loading portfolio value</p>
            </Card>
        );
    }
}