import { Button } from "@/shadcn/ui/button";
import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "@/shadcn/ui/tooltip";
import Image from "next/image";
import SamuraiIcon from "@/public/Samurai Icon.png";

function Landing() {
    return (
        <div className="flex-1 min-h-[calc(100svh_-_7rem)] w-screen flex flex-col gap-5 items-center justify-center bg-gradient-to-t from-purple-800 to-purple-1200 p-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Image src={SamuraiIcon} alt="Samurai icon" width={300} height={300} priority/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>image: Flaticon.com</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <h1 className="text-wrap text-left text-4xl font-anton text-white">
                Become a Stock-Trading Warrior
            </h1>
            <h2>Master the art of portfolio strategy with the power of AI</h2>
            <Button>Start your journey</Button>
        </div>
    );
}

export default Landing;