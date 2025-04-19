"use client";
import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Plus } from "lucide-react";

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
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                    console.log("Stock added successfully");
                } else {
                    throw new Error("Failed to add stock");
                }
            })
            .catch((error) => {
                console.error("Error adding stock:", error);
            });
       
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="p-8">
                    <Plus className="mr-2" size={"1rem"} />
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