"use client";

import Image from "next/image";

function Error() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Image src={"/Samurai Icon.png"} alt="Samurai icon" width={150} height={150} className="mb-4 opacity-80" />
            <h1 className="text-4xl font-bold text-background font-anton">StockSensAI ran into a problem</h1>
            <p className="mt-4 text-lg text-gray-700">An unexpected error has occurred.</p>
            <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
        </div>
    );
}

export default Error;