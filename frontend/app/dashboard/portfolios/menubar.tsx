"use client";
import { Button } from '@/shadcn/ui/button';
import { Ellipsis, X } from 'lucide-react';
import AddPortfolioDrawer from './add-portfolio';

interface PortfolioMenubarProps {
    edit: boolean;
    setEditMode: (edit: boolean) => void;
}

function PortfolioMenubar({ edit, setEditMode }: PortfolioMenubarProps) {
    return (
       <div className='bg-background rounded-md text-white flex gap-5 p-2'>
            <AddPortfolioDrawer edit={edit}/>
            <Button 
                variant={edit ? 'destructive' : 'default'}
                className='text-white hover:bg-gray-200 hover:text-black cursor-pointer active:scale-95 transition-transform'
                onClick={() => setEditMode(!edit)}
            >{edit ? <X /> :  <Ellipsis />}{edit ? "Stop Editing" : "Edit Portfolios"}</Button>
       </div>
    )
}

export default PortfolioMenubar;