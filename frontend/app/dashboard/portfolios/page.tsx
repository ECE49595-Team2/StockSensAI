"use client";
import { useEffect, useState } from 'react';
import PortfolioMenubar from './menubar';
import PortfolioContent from './content';

function PortfoliosPage() {
    const [edit, setEditMode] = useState(false);

    useEffect(() => {
        console.log(edit);
    }, [edit]);

    return (
        <div className="flex flex-col text-black gap-2">
            <h1 className="text-3xl font-bold font-geist-mono text-background">Portfolios</h1>
            <p className='text-gray-500'>View your portfolios and their performances.</p>
            <PortfolioMenubar edit={edit} setEditMode={setEditMode}/>
            <PortfolioContent edit={edit} />
        </div>
    );
}

export default PortfoliosPage;