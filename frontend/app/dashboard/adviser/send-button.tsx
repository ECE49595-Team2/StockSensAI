"use client";
import { Button } from "@/shadcn/ui/button";

function SendButton({ messageToSend, onSend }: { messageToSend: string | undefined; onSend: () => void }) {

    return (
        <Button
            onClick={onSend}
            disabled={messageToSend === ""}
            className="w-[15%] max-w-[6rem] h-auto p-3 box-border bg-background text-white transition-transform transform active:scale-95 cursor-pointer"
        >
            Send
        </Button>
    );
}

export default SendButton;