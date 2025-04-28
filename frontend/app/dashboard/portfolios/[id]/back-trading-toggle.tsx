"use client";

import { useStockSelection } from "@/hooks/use-stock-select";
import { Switch } from "@/shadcn/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

function BackTradingToggle({ strategy_id, id }: { id: string, strategy_id: string | null }) {
    const [isBacktrading, setIsBacktrading] = useState(strategy_id !== "");
    const [isLoading, setIsLoading] = useState(false);
    const selection = useStockSelection((state) => state.selection);

    console.log(strategy_id, id, selection);

    async function startStrategy() {
        setIsLoading(true);
       const response = await fetch("/api/algo/backtrading/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: selection,
                id: id,
                isBacktrading: true
            }),
        });
        if (!response.ok) {
            toast.error("Failed to start backtrading", {
                richColors: true,
                description: "Failed to start backtrading",
                position: "top-center"
            });
            console.error("Failed to start backtrading");
            return;
        }

        const data = await response.json();
        if (data.error) {
            console.error("Error starting backtrading:", data.error);
            return;
        }
        setIsLoading(false);
        toast.success("Backtrading started successfully", {
            richColors: true,
            description: "Backtrading started successfully",
            position: "top-center"
        });
    

    }

    async function stopStrategy() {
        setIsLoading(true);
       const response = await fetch("/api/algo/backtrading/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: selection,
                id: id,
                isBacktrading: false
            }),
        });

        if (!response.ok) {
            toast.error("Failed to stop backtrading", {
                richColors: true,
                description: "Failed to stop backtrading",
                position: "top-center"
            });
            console.error("Failed to stop backtrading");
            return;
        }
       
        setIsLoading(false);
        toast.success("Backtrading stopped successfully", {
            richColors: true,
            description: "Backtrading stopped successfully",
            position: "top-center"
        });

    }

    return (
        <div className="flex flex-row w-full gap-2">
            <h1>Toggle Backtrading</h1>
            <Switch
                disabled={selection === null || isLoading}
                onClick={async () => {
                    if (!isBacktrading) {
                        await startStrategy();
                    } else {
                        await stopStrategy();
                    }
                    setIsBacktrading(!isBacktrading);
                }}
                checked={isBacktrading}
                className="w-10 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            />
        </div>
    )
}

export default BackTradingToggle;