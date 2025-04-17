import { Skeleton } from "@/shadcn/ui/skeleton";
import { Suspense } from "react";
import { BalanceWidget } from "./components/dashboard-balance";
import DashboardWelcome from "./components/dashboard-welcome";
import { PortfolioValueWidget } from "./components/dashboad-portfolio-value";
import { AdviserWidget } from "./components/dashboard-adviser";
import { DashboardChart } from "./components/dashboard-chart";

function Dashboard() {
    
    return (
        <div className="text-black max-w-4xl mx-auto">
            <DashboardWelcome />
            <div className="grid grid-cols-4 gap-4 mt-4">
                <Suspense fallback={<Skeleton className="w-full h-30 bg-gray-200 col-span-2" />}>
                    <BalanceWidget />
                </Suspense>
                <Suspense fallback={<Skeleton className="w-full h-30 bg-gray-200 col-span-2" />}>
                    <PortfolioValueWidget />
                </Suspense>
                <Suspense fallback={<Skeleton className="w-full h-30 bg-gray-200 col-span-2" />}>
                    <AdviserWidget />
                </Suspense>
                <DashboardChart />
            </div>
        </div>
    );
}

export default Dashboard;