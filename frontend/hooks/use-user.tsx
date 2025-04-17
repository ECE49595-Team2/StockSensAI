"use client";
import { create } from "zustand";
import User from "@/models/user-model";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStoreType {
    user: User | undefined;
    setUser: (user: User | undefined) => void;
}

// Zustand store with persistence
export const useUser = create<UserStoreType>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user: User | undefined) => set({ user })
        }),
        {
            name: "user-store", // Key for localStorage persistence
            storage: createJSONStorage(() => localStorage), // Store in sessionStorage (won't persist across browser restarts)
        }
    )
);