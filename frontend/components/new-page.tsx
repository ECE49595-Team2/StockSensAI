import { Suspense } from "react";
import Nav from "./nav";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

function Page({ children, className }: PageProps) {
  return (
    <>
      <Suspense fallback={<div className="w-screen h-screen bg-background flex items-center justify-center">Loading...</div>}>
        <Nav />
      </Suspense>
      <div className={`pt-[7rem] flex flex-col gap-4 border-box w-screen ${className}`}>
        {children}

      </div>
    </>
  );

}

export default Page;