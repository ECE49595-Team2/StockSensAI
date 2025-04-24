import { ChatBubbleType } from "@/app/dashboard/adviser/chat-bubble"; // Ensure this path is correct and ChatBubbleType is exported from this module
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatStoreType {
    messages: { text: string, type: ChatBubbleType }[];
    setMessages: (messages: { text: string, type: ChatBubbleType }[]) => void;
}

export const useChatStore = create<ChatStoreType>()(
    persist((set) => ({
        messages: [],
        setMessages: (messages: { text: string, type: ChatBubbleType }[]) => set({ messages }),
    }), {
        name: "chat-store",
        storage: createJSONStorage(() => sessionStorage),
    })
)