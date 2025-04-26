"use client";
import { Button } from "@/shadcn/ui/button";
import { useRouter } from "next/navigation";

function GoToPortfoliosButton() {
    const router = useRouter();
    const handleGoToPortfolios = () => {
        router.push("/dashboard/portfolios");
    }


    return (
        <Button
            variant={"ghost"}
            className="h-[3rem] w-[10rem] text-wrap font-bold"
            onClick={handleGoToPortfolios}
        >
            Go to Portfolios
        </Button>
    );
}

export default GoToPortfoliosButton;