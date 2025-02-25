"use client";
import { Button } from "@/shadcn/ui/button";
import Image from "next/image";
import SamuraiIcon from "@/public/Samurai Icon.png";

function NotFound() {

    const goHome = () => () => {
        window.location.href = '/';
    };

    return (
        <div className="pt-[7rem] h-screen w-screen flex flex-col justify-center items-center p-4">
            <div className="flex flex-col gap-5">
                <div className="h-[max-content] width-[max-content] flex flex-row justify-center items-center gap-5 relative z-10">
                    <h1 className="text-3xl">Woahhh!</h1>
                    <h2 className="font-geist-mono">Where are you going?! This page doesn&apos;t exist</h2>
                </div>
                
                <Button onClick={goHome()}>Go back home</Button>
            </div>
            <Image src={SamuraiIcon} alt="Samurai icon" width={500} height={500} className="absolute z-5 opacity-5 user-select-none pointer-events-none" />
        </div>
    );
}

export default NotFound;