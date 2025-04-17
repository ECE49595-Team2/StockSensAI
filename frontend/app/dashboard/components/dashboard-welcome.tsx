"use client";
import { useUser } from "@/hooks/use-user";
import User from "@/models/user-model";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { useEffect } from "react";


function DashboardWelcome() {
    const user = useUser((state) => state.user) as User;

    useEffect(() => {
    }, [user?.name, user?.email]);

    return (
        <>
            {user ? <h1 className="font-bold text-4xl font-anton text-background">Welcome back, {user.name}</h1> : <Skeleton className="w-100 h-10 bg-gray-200" />}
        </>
    );
}

export default DashboardWelcome;