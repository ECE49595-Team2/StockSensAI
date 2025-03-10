"use client";
import { Input } from "@/shadcn/ui/input";
import SendButton from "./send-button";
import { useState } from "react";

function ChatBox() {
    const [message, setMessage] = useState<string>("");

    return (
        <div className="flex flex-row bottom-0 min-h-[80px] w-full bg-white absolute justify-center items-center gap-3">
            <Input placeholder="Ask me anything..." className="h-[50px] w-[80%] left-3 bottom-3 p-3 box-border bg-white" onChange={(e) => setMessage(e.target.value)} value={message}/>
            <SendButton messageToSend={message} onSend={() => setMessage("")} />
        </div>
    );
}

export default ChatBox;