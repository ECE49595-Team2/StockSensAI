"use client";
import { useEffect, useState } from 'react';
import PortfolioMenubar from './menubar';
import PortfolioContent from './content';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function PortfoliosPage() {
    const [edit, setEditMode] = useState(false);
    const params = useSearchParams();

    useEffect(() => {
        const errorParam = params.get('error') as unknown as boolean;
        if(errorParam) {
            toast.error("OOPS! Error", {
                richColors: true,
                description: "Unknown error happen when opening portfolio.",
                position: "top-center"
            });
            window.history.replaceState({}, document.title, "/dashboard/portfolios");
        }
    }, [edit, params]);

    return (
        <div className="flex flex-1 flex-col text-black gap-2">
            <h1 className="text-3xl font-bold font-geist-mono text-background">Portfolios</h1>
            <p className='text-gray-500'>View your portfolios and their performances.</p>
            <PortfolioMenubar edit={edit} setEditMode={setEditMode}/>
            <PortfolioContent edit={edit} />
        </div>
    );
}

export default PortfoliosPage;