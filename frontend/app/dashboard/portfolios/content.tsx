"use client";
import { useUser } from "@/hooks/use-user";
import Portfolio from "@/models/portfolio-model";
import { useEffect, useState } from "react";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import PortfoliosCard from "./card";
import { Paperclip } from "lucide-react";

interface PortfolioContentProps {
    edit: boolean;
}

function PortfolioContent({ edit }: PortfolioContentProps) {
    const user = useUser((state) => state.user);
    const [loading, isLoading] = useState<boolean>(true);
    const portfolios = usePortfoliosStore((state) => state.portfolios);
    const setPortfolios = usePortfoliosStore((state) => state.setPortfolios);
    const refreshKey = usePortfoliosStore((state) => state.refreshKey);

    useEffect(() => {
        if (user) {
            fetch("/api/user/portfolios/", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            }).then((response) => {
                response.json().then((result: Portfolio[]) => {
                    if (response.ok) {
                        if (Object.keys(result).length === 0) {
                            setPortfolios(new Map<string, Portfolio>()); // Set an empty Map
                            return;
                        }

                        // Sort portfolios in descending order by date_created
                        result.sort((a, b) => {
                            const aDate = a?.date_created ?? "";
                            const bDate = b?.date_created ?? "";
                            return bDate.localeCompare(aDate);
                        });

                        // Create a new Map instance to avoid direct mutation
                        const newPortfolios = new Map<string, Portfolio>();
                        result.forEach((portfolio: Portfolio) => {
                            newPortfolios.set(portfolio._id, portfolio);
                        });

                        setPortfolios(newPortfolios); // Update state with the new Map
                    }
                    isLoading(false);
                });
            });
        }
    }, [setPortfolios, isLoading, user?.email, refreshKey]);

    if (loading) {
        return <div>
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-t-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
        </div>;
    } else if (portfolios.size === 0) {
        return <div className="flex flex-2 flex-col justify-center items-center gap-4">
            <Paperclip size={'3rem'}/>
            <h1>Create your first portfolio</h1>
        </div>

    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {Array.from(portfolios.values()).map((portfolio) => (
                <PortfoliosCard key={portfolio._id} title={portfolio.name} description={portfolio.description} endpoint={portfolio._id} edit={edit} />
            ))}
        </div>

    );
}

export default PortfolioContent;