interface PageProps {
  children: React.ReactNode;
  className?: string;
}

function Page({ children, className }: PageProps) {
  return (
    <div className={`pt-[7rem] flex flex-col gap-4 border-box w-screen ${className}`}>
      {children}
    </div>
  );

}

export default Page;