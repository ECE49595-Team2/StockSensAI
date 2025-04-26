"use client";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { PopoverTrigger, Popover, PopoverContent } from "@/shadcn/ui/popover";
import { useState } from "react";
import { toast } from "sonner";

function BuySell({ amountOwned }: { amountOwned: number }) {
    const [buyAmount, setBuyAmount] = useState<string>(""); // State for buy input
    const [sellAmount, setSellAmount] = useState<string>(""); // State for sell input

    const handleBuy = () => {
        const amount = parseFloat(buyAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount to buy.", {
                richColors: true,
                description: "Please enter a valid amount to buy.",
                position: "top-center"
            });
            return;
        }
        // Handle buy logic here
        toast.success(`You bought ${amount} units.`, {
            richColors: true,
            description: "You bought " + amount + " units.",
            position: "top-center"
        });
    };

    const handleSell = () => {
        const amount = parseFloat(sellAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount to sell.", {
                richColors: true,
                description: "Please enter a valid amount to sell.",
                position: "top-center"
            });
            return;
        }
        if (amount > amountOwned) {
            toast.error("You cannot sell more than you own.", {
                richColors: true,
                description: "Please enter a valid amount to sell.",
                position: "top-center"
            });
            return;
        }
        // Handle sell logic here
        toast.success(`You sold ${amount} units.`, {
            richColors: true,
            description: "You sold " + amount + " units.",
            position: "top-center"
        });
    };

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"}>Buy</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="w-full">
                        <Input
                            placeholder="Enter amount"
                            className="w-full"
                            value={buyAmount} // Bind input value to state
                            onChange={(e) => setBuyAmount(e.target.value)} // Update state on input change
                        />
                        <Button
                            onClick={handleBuy}
                            className="w-full mt-2"
                            variant={"ghost"}
                        >
                            Confirm
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"secondary"}>Sell</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="w-full">
                        <Input
                            placeholder="Enter amount"
                            className="w-full"
                            value={sellAmount} // Bind input value to state
                            onChange={(e) => setSellAmount(e.target.value)} // Update state on input change
                        />
                        <Button
                            onClick={handleSell}
                            className="w-full mt-2"
                            variant={"ghost"}
                        >
                            Confirm
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}

export default BuySell;