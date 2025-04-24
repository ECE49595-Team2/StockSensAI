"use client";
import { create } from "zustand";

interface SelectionStoreType {
    selection: string;
    setSelection: (selection: string) => void;
}

export const useStockSelection = create<SelectionStoreType>()(
        (set) => ({
            selection: "",
            setSelection: (selection: string) => set({ selection })
        })
);