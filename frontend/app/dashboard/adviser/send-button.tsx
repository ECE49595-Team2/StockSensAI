"use client";
import { useChatStore } from "@/hooks/use-chat";
import { Button } from "@/shadcn/ui/button";
import { ChatBubbleType } from "./chat-bubble";

function SendButton({ messageToSend, onSend }: { messageToSend: string | undefined; onSend: () => void }) {
    const { messages, setMessages } = useChatStore();

    const sendMessage = () => {
        if (!messageToSend) return;

        setMessages([...messages, { text: messageToSend, type: ChatBubbleType.User }]);
        onSend();
    };

    return (
        <Button
            onClick={sendMessage}
            disabled={messageToSend === ""}
            className="w-[15%] max-w-[6rem] h-auto p-3 box-border bg-background text-white transition-transform transform active:scale-95 cursor-pointer"
        >
            Send
        </Button>
    );
}

export default SendButton;