"use client";
import { useEffect, useState, Suspense } from 'react';
import PortfolioMenubar from './menubar';
import PortfolioContent from './content';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function PortfoliosPage() {
    const [edit, setEditMode] = useState(false);

    const SearchParamsHandler = () => {
        const params = useSearchParams();

        useEffect(() => {
            const errorParam = params.get('error') as unknown as boolean;
            if (errorParam) {
                toast.error("OOPS! Error", {
                    richColors: true,
                    description: "Unknown error happened when opening portfolio.",
                    position: "top-center"
                });
                window.history.replaceState({}, document.title, "/dashboard/portfolios");
            }
        }, [params]);

        return null; // This component only handles search params
    };

    return (
        <div className="flex flex-1 flex-col text-black gap-2">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParamsHandler />
            </Suspense>
            <h1 className="text-3xl font-bold font-geist-mono text-background">Portfolios</h1>
            <p className='text-gray-500'>View your portfolios and their performances.</p>
            <PortfolioMenubar edit={edit} setEditMode={setEditMode} />
            <PortfolioContent edit={edit} />
        </div>

    );
}

export default PortfoliosPage;