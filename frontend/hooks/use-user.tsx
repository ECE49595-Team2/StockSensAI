"use client";
import { create } from "zustand";
import User from "@/models/user-model";
import { createJSONStorage, persist } from "zustand/middleware";
import { useChatStore } from "./use-chat";

interface UserStoreType {
    user: User | undefined;
    checkUserSession: () => Promise<void>;
}

// Zustand store with persistence
export const useUser = create<UserStoreType>()(
    persist(
        (set) => ({
            user: undefined,
            checkUserSession: async () => {
                const response = await fetch("/api/user/verify", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });
                const data = await response.json();

                if (data.success) {
                    console.log("DATA?", data.session?.userCtx);
                    const user = new User(data.session?.userCtx.name);
                    await user.fetchUserData();
                    set({ user });
                }
                else {
                    useChatStore.getState().setMessages([]);
                    set({ user: undefined });
                }
            },
        }),
        {
            name: "user-store", // Key for localStorage persistence
            storage: createJSONStorage(() => sessionStorage), // Store in sessionStorage (won't persist across browser restarts)
        }
    )
);