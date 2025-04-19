"use client";

import { useStockSelection } from "@/hooks/use-stock-select";
import { Card } from "@/shadcn/ui/card";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

function NewsAnalysis() {
    const selection = useStockSelection((state) => state.selection);
    const [response, setResponse] = useState<any | null>(null);

    async function fetchNews() {
        if (selection) {
            const response = await fetch(`/api/llm/news/${selection}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });

            console.log(response);

            if (response.ok) {
                const data = await response.json();
                setResponse((prev: any) => ({
                    ...prev,
                    [selection]: data,
                }));
            } else {
                console.error("Failed to fetch news");
            }
        }
    }

    useEffect(() => { 
        console.log("response", response);
    }, [response]);

    useEffect(() => {
        let isMounted = true;
        console.log(selection);

        fetchNews();

        return () => {
            isMounted = false;
        };
    }, [selection, setResponse]);

    return (
        <Card>
            <Bot />
            <div>
                <h1 className="text-4xl font-extrabold">News Analysis</h1>
                <p className="text-lg">Analyze news sentiment for your portfolio.</p>
            </div>
        </Card>
    );
}

export default NewsAnalysis;