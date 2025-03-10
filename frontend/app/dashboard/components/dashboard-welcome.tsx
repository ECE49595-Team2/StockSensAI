"use client";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/shadcn/ui/skeleton";

function DashboardWelcome() {
    const user = useUser((state) => state.user);

    return (
        <>
            {user ? <h1 className="font-bold text-4xl font-anton text-background">Welcome back, {user.name}</h1> : <Skeleton className="w-100 h-10 bg-gray-200" />}
        </>
    );
}

export default DashboardWelcome;