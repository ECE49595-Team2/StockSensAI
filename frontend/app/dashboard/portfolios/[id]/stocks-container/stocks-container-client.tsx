"use client";
import { useStockSelection } from "@/hooks/use-stock-select";
import { Card } from "@/shadcn/ui/card";
import { useEffect } from "react";
import AddStockButton from "./add-stock-button";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shadcn/ui/carousel";

function StocksContainerClient({ stocks, id }: {
    stocks: {
        [symbol: string]: number;
    },
    id: string;
}) {
    const selection = useStockSelection((state) => state.selection);
    const setSelection = useStockSelection((state) => state.setSelection);
    const refreshKey = usePortfoliosStore((state) => state.refreshKey);

    useEffect(() => { }, [selection]);
    useEffect(() => {
        setSelection(Object.keys(stocks)[0]);
    }, [stocks, setSelection, refreshKey]);

    function handleStockClick(symbol: string) {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            setSelection(symbol);
        };
    }

    return (
        <div className="flex flex-col-reverse md:flex-row bg-background rounded-lg p-4 gap-3 items-center justify-around">
            <AddStockButton id={id} />
            <Carousel
                opts={{
                    align: "start",
                }}
                className="ml-12 mr-12"
            >
                <CarouselContent className="flex flex-1">
                    {Object.entries(stocks).map(([symbol, data]) => (
                        <CarouselItem className={`${stocks.length < 3 ? (stocks.length < 2 ? "basis-full" : "basis-1/2") : "basis-1/3"}`} key={symbol}>
                            <Card key={symbol} onClick={handleStockClick(symbol)} className={`h-full rounded border p-4 flex flex-row shadow-sm min-w-[min-content] ${selection === symbol ? "bg-primary text-white" : ""}`}>
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-bold text-lg">{symbol}</h2>
                                    <p>Amount owned: {data}</p>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white" />
                <CarouselNext className="bg-white" />
            </Carousel>
        </div>
    );

}

export default StocksContainerClient;