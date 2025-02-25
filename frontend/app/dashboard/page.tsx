"use client";
import useUser from "@/hooks/use-user";
import { Skeleton } from "@/shadcn/ui/skeleton";

function Dashboard() {
    const { user } = useUser();

    return (
        <div className="text-black">
            {user ? <h1 className="font-bold text-4xl font-anton text-background">Welcome back, {user.name}</h1> : <Skeleton className="w-100 h-15 bg-gray-200"/>}
        </div>
    );
}

export default Dashboard;