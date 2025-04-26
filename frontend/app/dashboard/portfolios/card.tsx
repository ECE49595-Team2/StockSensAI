"use client";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/shadcn/ui/button";
import { Card, CardDescription, CardTitle } from "@/shadcn/ui/card";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PortfoliosCardProps {
    title: string;
    description: string;
    endpoint: string;
    edit: boolean;
}

function PortfoliosCard({ title, description, endpoint, edit }: PortfoliosCardProps) {
    const router = useRouter();
    const portfolios = usePortfoliosStore((state) => state.portfolios);
    const setPortfolios = usePortfoliosStore((state) => state.setPortfolios);
    const triggerRefresh = usePortfoliosStore((state) => state.triggerRefresh);
    const [pressed, setPressed] = useState(false);

    useEffect(() => { }, [edit]);

    const handleDelete = () => {
        fetch(`/api/portfolio/${endpoint}`, {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
        }).then((response) => {
            if (response.ok) {
                setPortfolios(new Map([...portfolios].filter(([key]) => key !== endpoint)));
                triggerRefresh();
                router.refresh();
            }
        });
        
    }
    
    return (
        <Card
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            className={`max-w-[20rem] relative cursor-pointer bg-secondary text-black p-4 ${pressed ? "scale-95 transition-transform duration-150" : "transition-transform duration-150"}`}
            onClick={() => router.push(`/dashboard/portfolios/${endpoint}`)} 
        >
            {edit &&
                <Button
                    variant="destructive"
                    className="absolute top-[-5%] left-[-5%] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <X />
                </Button>
            }
            <CardTitle className="font-anton text-2xl">{title}</CardTitle>
            <CardDescription className="text-black">{description}</CardDescription>
        </Card>
    )
}

export default PortfoliosCard;