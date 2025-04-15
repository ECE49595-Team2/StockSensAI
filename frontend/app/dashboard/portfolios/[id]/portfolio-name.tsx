"use client";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import Portfolio from "@/models/portfolio-model";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function PortfolioName() {
    const params = useParams();
    const id = params.id as string;
    const getPortfolio = usePortfoliosStore((state) => state.getPortfolio);
    const [portfolio, setPortfolio] = useState<Portfolio | undefined>(undefined);

    useEffect(() => {
        console.log(getPortfolio(id));
        setPortfolio(getPortfolio(id));
    }, [id, getPortfolio]);

    return (
        <div className="w-full"> 
            {portfolio ? <h1 className="font-bold text-4xl font-anton text-background">{portfolio.name}</h1> : <h1 className="font-bold text-4xl font-anton text-background">Portfolio</h1>}
        </div>
    )
}

export default PortfolioName;