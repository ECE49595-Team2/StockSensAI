"use client";

import { useStockSelection } from "@/hooks/use-stock-select";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { Switch } from "@/shadcn/ui/switch";
import { useEffect, useState } from "react";

function PerformanceWidget({ id }: { id: string }) {
    const [singleOrMulti, setSingleOrMulti] = useState<"single" | "multiple">("single");
    const selection = useStockSelection((state) => state.selection);
    const [gain, setGain] = useState<number | null>(null);

    useEffect(() => {
        async function fetchPerformance() {
            const response = await fetch("/api/algo/performance/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    singleOrMulti: singleOrMulti,
                    symbol: selection,
                }),
            }
            );
            if (!response.ok) {
                console.error("Failed to fetch performance data");
                return;
            }
            const data: { positions: [{ ticker: string, gain: number }] } = await response.json();
            console.log("Performance data:", data);
            const selectedPosition = data.positions.find(position => position.ticker === selection);
            if (selectedPosition) {
                setGain(selectedPosition.gain);
            } else {
                setGain(null); // Default to 0 if no matching ticker is found
            }
        }

        fetchPerformance();
    }, [singleOrMulti, setGain, selection]);

    useEffect(() => { }, [gain]);

    if (gain === null) {
        return (
            <Skeleton className="h-10 p-3 flex items-center justify-center">
                Loading...
            </Skeleton>
        );
    }

    return (
        <div className="flex flex-row gap-4 items-center">
            <h1 className={`${gain < 0 ? "text-red-500" : "text-green-500"} text-3xl`}>{gain.toPrecision(4)}</h1>
            <div className="w-[min-content]">
                <Switch
                    checked={singleOrMulti === "multiple"}
                    onCheckedChange={(checked) => setSingleOrMulti(checked ? "multiple" : "single")}
                    className="w-16 h-8 bg-gray-200 rounded-full relative transition-colors duration-300"
                />
            </div>
            <h1 className="text-lg">{singleOrMulti === "multiple" ? "Multi-day" : "Single-day"} Performance</h1>
        </div>
    );

}

export default PerformanceWidget;