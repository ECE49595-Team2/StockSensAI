"use client";

import { useStockSelection } from "@/hooks/use-stock-select";

function SidebarName() {
    const selection = useStockSelection((state) => state.selection);

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold">{selection}</h1>
        </div>
    );
}

export default SidebarName;