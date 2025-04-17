"use client";
import { useStockSelection } from "@/hooks/use-stock-select";
import { Card } from "@/shadcn/ui/card";
import { useEffect } from "react";
import BuySell from "./buy-sell";

function PortfolioSidebarClient({ stocks }: {
    stocks: {
        [symbol: string]: number;
    };
}) {
    const selection = useStockSelection((state) => state.selection);
    const setSelection = useStockSelection((state) => state.setSelection);

    useEffect(() => { }, [selection]);
    useEffect(() => {
        setSelection(Object.keys(stocks)[0]);
    }, [stocks]);

    function handleStockClick(symbol: string) {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            setSelection(symbol);
        };
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col bg-background rounded-lg p-4 gap-3">
                {Object.entries(stocks).map(([symbol, data]) => (
                    <Card key={symbol} onClick={handleStockClick(symbol)} className={`w-full rounded border p-4 flex flex-row shadow-sm ${selection === symbol ? "bg-primary text-white" : ""}`}>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-bold text-lg">{symbol}</h2>
                            <p>Amount owned: {data}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {symbol === selection ? <BuySell amountOwned={data} /> : null}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

}

export default PortfolioSidebarClient;