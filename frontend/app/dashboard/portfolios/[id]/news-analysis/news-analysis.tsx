"use client";

import { useStockSelection } from "@/hooks/use-stock-select";
import { Card } from "@/shadcn/ui/card";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import Articles, { Article } from "./news-analysis-articles";

type NewsResponse = {
    action: "Buy" | "Sell" | "Hold" | "No Action";
    sentiment: "Positive" | "Negative" | "Neutral";
    reasoning: string;
    source_data: {
        articles: Article[];
    }
};

function NewsAnalysis() {
    const selection = useStockSelection((state) => state.selection);
    const [response, setResponse] = useState<NewsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    }, [response, loading]);

    useEffect(() => {
        async function fetchNews() {
            if (selection) {
                setLoading(true);
                const response = await fetch(`/api/llm/news/${selection}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "force-cache",
                });
    
                if (response.ok) {
                    const data: NewsResponse = await response.json();
                    setResponse(data);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch news");
                }
            }
        }

        setLoading(true);
        fetchNews();
    }, [selection, setResponse]);

    return (
        <Card>
            <div className="flex flex-col p-4">
                <Bot />
                <h1 className="text-2xl font-extrabold">News Analysis</h1>
                <p className="text-lg">Analyze news sentiment for your portfolio.</p>
                {
                    response ? (
                        loading ? (
                            <Skeleton className="mt-4 h-12 w-full flex items-center justify-center">
                                <h3>Loading...</h3>
                            </Skeleton>
                        ) : (
                            <div className="mt-4 ml-2">
                                <h2 className="text-xl font-bold capitalize">Action: {response.action}</h2>
                                <p className="text-md">{response.reasoning}</p>
                                <Articles articles={response.source_data.articles} />
                            </div>
                        )

                    ) : (
                        loading ? (
                            <Skeleton className="mt-4 h-12 w-full flex items-center justify-center">
                                <h3>Loading...</h3>
                            </Skeleton>
                        ) : (
                            <p className="mt-4 text-gray-500">No news analysis available.</p>
                        )
                    )
                }
            </div>
        </Card>
    );
}

export default NewsAnalysis;