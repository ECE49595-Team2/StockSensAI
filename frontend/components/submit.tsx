import { Button } from "@/shadcn/ui/button";
import Image from "next/image";
import LoadingIcon from "@/public/katana.svg";

function Submit({ isSubmitting = false }: Readonly<{ isSubmitting?: boolean }>) {
    return (
        <div className="flex h-[4rem] w-[7rem] items-center justify-center relative">
            {isSubmitting && (
                <Image src={LoadingIcon} alt="Loading icon" width={40} height={40} draggable={false} className="select-none pointer-events-none animate-spin absolute z-50"/>
            )}
            <Button type="submit" size={'lg'} disabled={isSubmitting} className="text-xl w-full h-full font-geist-mono shadow-lg">Submit</Button>
        </div>
    );
}

export default Submit;