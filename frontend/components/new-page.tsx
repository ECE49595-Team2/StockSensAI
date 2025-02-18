function Page({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="pt-[170px] p-12 flex flex-col gap-4">
      {children}
    </div>
  );

}

export default Page;