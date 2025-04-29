import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex flex-1 items-center justify-center flex-col gap-5">
            <Image src={"/katana.svg"} alt="Loading" width={100} height={100} className="animate-spin" />
            <h1 className="text-black font-geist-mono">Loading...</h1>
        </div>
    )
}