import { Skeleton } from "@/shadcn/ui/skeleton";
import { Suspense } from "react";
import { BalanceWidget } from "./components/dashboard-balance";
import DashboardWelcome from "./components/dashboard-welcome";
import { AdviserWidget } from "./components/dashboard-adviser";
import { cookies } from "next/headers";
import { COUCHDB_URL } from "../env";
import nano from "nano";
import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";
import GoToPortfoliosButton from "./portfolios/go-to-button";
import { Bot } from "lucide-react";
import { DashboardChart } from "./components/dashboard-chart";

async function Dashboard() {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        // Redirect to login if AuthSession cookie is not present
        return <p className="text-red-500">You must be logged in to view this page.</p>;
    }
    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession.value}`,
            },
        },
    });
    const email = (await client.session()).userCtx.name;
    if (!email || email === "null" || email === "admin") {
        // Redirect to login if user is not authenticated
        return <p className="text-red-500">You must be logged in to view this page.</p>;
    }
    const portfoliosDb = client.db.use("portfolio");
    const portfolios = await portfoliosDb.find({
        selector: {
            user: email,
        },
    });
    if (!portfolios || portfolios.docs.length === 0) {
        return <div className="flex-1 flex-col justify-center flex items-center">
            <DashboardWelcome firstTime />
            <Card className="p-4">
                <CardTitle>Make your first portfolio to get started learning!</CardTitle>
                <CardContent className="flex flex-col flex-1 items-center justify-center">
                    <GoToPortfoliosButton />
                </CardContent>
            </Card>
        </div>;
    }

    return (
        <div className="text-black max-w-4xl mx-auto">
            <DashboardWelcome />
            <div className="grid grid-cols-4 gap-4 mt-4">
                <Suspense fallback={<Skeleton className="w-full h-30 bg-gray-200 col-span-2" />}>
                    <BalanceWidget />
                </Suspense>
                <Suspense fallback={<Skeleton className="w-full bg-gray-200 col-span-2 p-8">
                    <Bot />
                    <h1 className="text-md font-bold text-gray-500">Adviser</h1>
                    <p className="text-4xl font-bold slide-up">Loading...</p>
                </Skeleton>}>
                    <AdviserWidget />
                </Suspense>
                <DashboardChart />
            </div>
        </div>
    );
}

export default Dashboard;