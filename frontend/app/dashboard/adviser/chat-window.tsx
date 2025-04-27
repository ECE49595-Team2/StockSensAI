"use client";
import { useChatStore } from "@/hooks/use-chat";
import ChatBubble from "./chat-bubble";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShallow } from "zustand/react/shallow";


function ChatWindow() {
    const { messages } = useChatStore(useShallow((state) => ({ messages: state.messages, setMessages: state.setMessages })));

    useEffect(() => {
        // Scroll to bottom of chat window
        const chatWindow = document.getElementById("chat-window");
        chatWindow?.scrollTo(0, chatWindow.scrollHeight);
    }, [messages]);

    return (
        <>
            {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Start a conversation with your AI adviser.</p>
                </div>
            ) :
                <div className="overflow-scroll flex flex-1 flex-col min-w-[80%] bg-gray-100 p-3 rounded-lg inset-shadow-sm mt-3 max-w-[10rem]">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <ChatBubble key={index} text={message.content} type={message.role} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            }
        </>
    );
}

export default ChatWindow;