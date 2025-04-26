"use client";
import { Card, CardTitle } from "@/shadcn/ui/card";

export type TutorialCardType = {
    step: number;
    title: string;
    description: string;
}

function TutorialCard({ step, title, description }: TutorialCardType) {
    return(
        <Card className="max-w-xl w-full min-h-[300px] pl-4 pr-4 pt-16 pb-16 user-select-none" style={{ userSelect: "none" }}>
            <h1 className="text-3xl text-background">{step}</h1>
            <CardTitle>
                {title}
            </CardTitle>
            <p className="text-gray-500">{description}</p>

        </Card>
    );
}

export default TutorialCard;