"use client";
import { useChatStore} from "@/hooks/use-chat";
import { Button } from "@/shadcn/ui/button";
import { ChatBubbleType } from "./chat-bubble";
import { useShallow } from "zustand/react/shallow";

function SendButton({ messageToSend, onSend }: { messageToSend: string | undefined, onSend: () => void }) {
    const { messages, setMessages } = useChatStore();
    
    const sendMessage = () => {
        if (!messageToSend) return;

        setMessages([...messages, { text: messageToSend, type: ChatBubbleType.User }]);
        onSend();
    };

    
    return (
        <Button onClick={sendMessage} className="w-[15%] max-w-[6rem] h-auto p-3 box-border bg-background text-white">
            Send
        </Button>
    )
}

export default SendButton;