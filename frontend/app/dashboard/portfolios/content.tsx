"use client";
import { useUser } from "@/hooks/use-user";
import Portfolio from "@/models/portfolio-model";
import { useEffect } from "react";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import PortfoliosCard from "./card";

interface PortfolioContentProps {
    edit: boolean;
}

function PortfolioContent({ edit }: PortfolioContentProps) {
    const user = useUser((state) => state.user);
    const portfolios = usePortfoliosStore((state) => state.portfolios);
    const lastUpdated = usePortfoliosStore((state) => state.lastUpdated);
    const setPortfolios = usePortfoliosStore((state) => state.setPortfolios)

    useEffect(() => {
        if (user) {
            fetch(`/api/user/portfolios/${user.email}`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            }).then((response) => {
            response.json().then((result: object) => {
                    const entries: [string, Portfolio][] = Object.entries(result).map(([key, portfolio]) => {
                        const p = portfolio as Portfolio;
                        p.id = key;
                        return [key, p];
                    });
        
                    const portfolioMap = new Map<string, Portfolio>(entries);
                    setTimeout(() => {
                        setPortfolios(portfolioMap);
                    }, 4000);
                   
                });
            });
        }
        console.log(lastUpdated);
    }, [user, lastUpdated, setPortfolios]);

    if (!portfolios || portfolios.size === 0) {
        return <div>
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-t-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
        </div>;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {Array.from(portfolios.values()).map((portfolio) => (
                <PortfoliosCard key={portfolio.id} title={portfolio.name} description={portfolio.description} endpoint={portfolio.id} edit={edit} />
            ))}
        </div>
       
    );
}

export default PortfolioContent;