import Page from "@/components/new-page";
import { Carousel, CarouselContent } from "@/shadcn/ui/carousel";
import TutorialCard, { TutorialCardType } from "./tutorial-card";

let carouselItems: TutorialCardType[] = [
    {
        step: 1,
        title: "Step 1: Create an Account",
        description: "Sign up for a free account to get started with StockSensAI.",
        imageUrl: "/images/tutorial/step1.png"
    },
    {
        step: 2,
        title: "Step 2: Create a portfolio",
        description: "Create your first portfolio by adding stocks you want to track.",
        imageUrl: "/images/tutorial/step2.png"
    },
    {
        step: 3,
        title: "Step 3: Analyze Your Portfolio",
        description: "Use our AI-powered tools to gain insights into your investments.",
        imageUrl: "/images/tutorial/step3.png"
    }
];

function TutorialPage() {
    return (
        <Page className="p-4 font-geist-mono">
            <h1 className="font-anton text-5xl font-bold">Tutorial</h1>
            <h2 className="text-3xl font-giest-mono">Let's get started!</h2>
            <br />
            {
                carouselItems && carouselItems.length > 0 ? (
                    <div className="flex flex-col w-full gap-4 justify-center items-center mt-4">
                                {
                                    carouselItems.map((item, index) => (
                                        <div className="p-1" key={index}>
                                            <TutorialCard {...item} />
                                        </div>
                                    ))
                                }
                    </div>
                ) : (
                    <p className="text-gray-500">No tutorial steps available.</p>
                )
            }

        </Page>
    );
}

export default TutorialPage;