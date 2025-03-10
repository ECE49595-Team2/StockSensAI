import { Card } from "@/shadcn/ui/card";
import { Bot } from "lucide-react";

async function getAdvice() {
    return Promise.resolve("Buy low, sell high");
}

export async function AdviserWidget() {
    const advice = await getAdvice();
    return (
        <Card className="p-4 block overflow-hidden col-span-1">
            <Bot />
            <h1 className="text-md font-bold text-gray-500">Adviser</h1>
            <p className="text-2xl font-bold slide-up">{advice}</p>
        </Card>
    );
}