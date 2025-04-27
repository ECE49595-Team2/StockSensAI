import { ChatBubbleType } from "@/app/dashboard/adviser/chat-bubble"; // Ensure this path is correct and ChatBubbleType is exported from this module
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatStoreType {
    messages: { content: string, role: ChatBubbleType }[];
    setMessages: (updater: (messages: { content: string, role: ChatBubbleType }[]) => { content: string, role: ChatBubbleType }[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStoreType>()(
    persist((set) => ({
        messages: [],
        loading: false,
        setMessages: (updater) => set((state) => ({
            messages: updater(state.messages),
        })),
        setLoading: (loading: boolean) => set({ loading }),
    }), {
        name: "chat-store",
        storage: createJSONStorage(() => sessionStorage),
    })
)