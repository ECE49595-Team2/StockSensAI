"use client";
import SendButton from "./send-button";
import { useState, useRef } from "react";
import { useChatStore } from "@/hooks/use-chat";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { ChatBubbleType } from "./chat-bubble";
import { toast } from "sonner";

function ChatBox() {
    const [message, setMessage] = useState<string>("");
    const messages = useChatStore(state => state.messages);
    const setMessages = useChatStore(state => state.setMessages);
    const loading = useChatStore(state => state.loading);
    const setLoading = useChatStore(state => state.setLoading);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Adjust the height of the textarea dynamically
        if (textareaRef.current && textareaRef.current.scrollHeight < 200) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
        }
    };

    const onSubmit = async () => {
        if (message.trim() === "") return; // Prevent sending empty messages

        setLoading(true); // Set loading state to true
        setMessages((prevMessages: typeof messages) => [
            ...prevMessages,
            { role: "user" as ChatBubbleType, content: message }
        ]); // Add user message to chat

        try {
            const response = await fetch("/api/llm/chat", {
                method: "POST",
                body: JSON.stringify([...messages, { content: message, role: "user" as ChatBubbleType }].slice(-4)),
            });

            if (response.ok) {
                const data = await response.json();

                setMessages((prevMessages: typeof messages) => [
                    ...prevMessages,
                    { role: "assistant" as ChatBubbleType, content: data.response as string },
                ]);
            }
            setMessage(""); // Clear the message after sending
            setLoading(false);
            
        } catch {
            toast.error("Failed to send message. Please try again.", {
                richColors: true,
                dismissible: true,
                position: "top-center",
            });
        }

    }

    return (
        <>
            {loading ? (
                <Skeleton className="flex flex-col bottom-0 h-auto w-full bg-white justify-center items-center gap-3 rounded p-3">
                    Waiting on response...
                </Skeleton>
            ) : (
                <div className="flex flex-row bottom-0 h-auto w-full bg-white justify-center items-center gap-3 rounded p-3">
                    <textarea
                        ref={textareaRef}
                        placeholder="Ask me anything..."
                        className="h-[50px] w-[80%] p-3 box-border bg-white resize-none overflow-hidden rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleInputChange}
                        value={message}
                        rows={1} // Start with one row
                        maxLength={200} // Limit to 200 characters
                    />
                    <SendButton messageToSend={message} onSend={onSubmit} />
                </div >

            )
            }
        </>
    );
}

export default ChatBox;