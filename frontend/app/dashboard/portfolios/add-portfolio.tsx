"use client";
import { Button } from "@/shadcn/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shadcn/ui/drawer";
import AddPortfolioForm from "./add-portfolio-form";
import { Plus } from "lucide-react";

function AddPortfolioDrawer({ edit }: { edit: boolean }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button 
                variant="default" 
                className="text-white hover:bg-gray-200 hover:text-black cursor-pointer active:scale-95 transition-transform"
                disabled={edit}
                ><Plus/> Add Portfolio</Button>
            </DrawerTrigger>
            <DrawerContent className="h-full">
                <DrawerHeader className="flex flex-col items-center">
                    <DrawerTitle className="font-anton text-white text-4xl">Add Portfolio</DrawerTitle>
                    <DrawerDescription className="font-geist-mono text-white text-lg">
                        Create a new portfolio to track your investments.
                    </DrawerDescription>
                </DrawerHeader>
                <AddPortfolioForm />
            </DrawerContent>
        </Drawer>

    );
}

export default AddPortfolioDrawer;