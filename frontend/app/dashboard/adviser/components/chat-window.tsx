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
        <div className="overflow-scroll min-h-[100px] h-full min-w-[80%] bg-gray-100 p-3 rounded-lg inset-shadow-sm mt-3">
            <AnimatePresence>
                {messages.map((message, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <ChatBubble key={index} text={message.text} type={message.type} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default ChatWindow;