"use client";
import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Plus } from "lucide-react";
import { toast } from "sonner";

function AddStockButton({ id }: { id: string }) {
    const [stockSymbol, setStockSymbol] = useState("");

    const onSubmit = () => {
        if (stockSymbol.trim() === "") {
            return;
        }

        fetch(`/api/portfolio/${id}/stock/${stockSymbol}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 1})
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                    console.log("Stock added successfully");
                } else {
                    toast.error("Failed to add stock", {
                        description: "Stock symbol might be invalid or already exists.",
                        richColors: true,
                        position: "top-center",
                    });
                }
            })
            .catch((error) => {
                console.error("Error adding stock:", error);
            });
       
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="flex items-center justify-center h-[screen] md:w-[8rem] sm:h-[8rem] sm:w-full" >
                    <Plus size={"10rem"} /> Add Stock
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Input
                    placeholder="Enter stock symbol"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                />
                <Button className="mt-2 w-full" onClick={onSubmit}>
                    Add Stock
                </Button>
            </PopoverContent>
        </Popover>
    );
}

export default AddStockButton;