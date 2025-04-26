import { useState, useRef } from "react";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/shadcn/ui/drawer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shadcn/ui/carousel";
import { Button } from "@/shadcn/ui/button";

export type Article = {
    age: string;
    article: string;
    sentiment: "positive" | "negative" | "neutral";
    sentiment_reasoning: string;
    summary: string;
};

function Articles({ articles }: { articles: Article[] }) {
    console.log("articles", articles);

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full mt-4 relative"
        >
            <CarouselContent className="flex flex-1 flex-row gap-4 w-full">
                {articles.map((article, index) => (
                    <CarouselItem className="md:basis-full lg:basis-1/2" key={index}>
                        <div className="p-1">
                            <ExpandableCard article={article} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-3 size-10 text-white" />
            <CarouselNext className="absolute right-3 size-10 text-white" />
        </Carousel>
    );
}

function ExpandableCard({ article }: { article: Article }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Card className="p-4 mb-4 h-[25rem] w-full">
                <CardContent
                    ref={contentRef}
                    className="flex flex-col gap-2 overflow-hidden"
                >
                    <h3 className="text-lg font-semibold">{article.article}</h3>
                    <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>
                        {article.age}
                    </p>
                    <p>{article.summary}</p>
                    <p
                        className={`uppercase font-bold ${article.sentiment === "positive"
                            ? "text-green-500"
                            : article.sentiment === "negative"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                    >
                        Sentiment: {article.sentiment.toUpperCase()}
                    </p>
                    <p className="italic">Reasoning: {article.sentiment_reasoning}</p>
                </CardContent>

                <Button
                    variant={"ghost"}
                    onClick={() => setIsDrawerOpen(true)}
                    className="mt-2"
                >
                    Show more
                </Button>

            </Card>

            {/* Drawer for expanded content */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="p-4 h-[80vh] flex flex-col gap-4 items-center">
                       <DrawerTitle className="text-white text-2xl font-bold">
                            {article.article}
                        </DrawerTitle>
                        <p className="text-gray-300 font-bold" style={{ fontSize: "1rem" }}>
                            {article.age}
                        </p>
                        <p className="w-[89%]">{article.summary}</p>
                        <p
                            className={` uppercase w-[90%] font-bold ${article.sentiment === "positive"
                                ? "text-green-500"
                                : article.sentiment === "negative"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                                }`}
                        >
                            Sentiment: {article.sentiment}
                        </p>
                        <p className="italic w-[90%]">Reasoning: {article.sentiment_reasoning}</p>
                        <Button
                            onClick={() => setIsDrawerOpen(false)}
                            className="mt-4 max-w-[5rem]"
                        >
                            Close
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default Articles;