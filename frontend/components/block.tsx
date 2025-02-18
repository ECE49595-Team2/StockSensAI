interface BlockProps {
    title: string;
    content: string;
    reverse?: boolean;
    className?: string;
}

function Block({ title, content, reverse, className }: BlockProps) {
    return (
        <div className={`flex flex-col sm:flex-row ${reverse ? 'sm:flex-row-reverse ' : ''} gap-4 w-full min-h-[30rem] p-4 ${className}`}>
            <div className='sm:w-1/2 w-full flex flex-col justify-center items-center gap-5'>
                <h2 className='text-5xl font-bold font-anton'>{title}</h2>
            </div>
            <div className='sm:w-1/2 w-full flex flex-col justify-center items-center font-geist-mono text-lg font-bold'>
                <p>{content}</p>
            </div>
        </div>
    )

}

export default Block;