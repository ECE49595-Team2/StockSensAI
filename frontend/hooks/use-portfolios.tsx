import { create } from "zustand";
import Portfolio from "@/models/portfolio-model";

interface PortfoliosStoreType {
    portfolios: Map<string, Portfolio>;
    lastUpdated: number;
    setPortfolios: (portfolios: Map<string, Portfolio>) => void;
    addPortfolio: (portfolio: Portfolio) => void;
    removePortfolio: (portfolioId: string) => void;
    updatePortfolio: (portfolioId: string, updatedPortfolio: Portfolio) => void;
    getPortfolio: (portfolioId: string) => Portfolio | undefined;
    setLastUpdated: () => void;
}

export const usePortfoliosStore = create<PortfoliosStoreType>()((set, get) => ({
    portfolios: new Map(),
    lastUpdated: Date.now(),
    setPortfolios: (portfolios) => set(() => ({ portfolios })),
    addPortfolio: (portfolio) => set((state) => {
        const newPortfolios = new Map(state.portfolios);
        newPortfolios.set(portfolio._id, portfolio);
        return { portfolios: newPortfolios, lastUpdated: Date.now() };
    }),
    removePortfolio: (portfolioId) => set((state) => {
        const newPortfolios = new Map(state.portfolios);
        newPortfolios.delete(portfolioId);
        return { portfolios: newPortfolios, lastUpdated: Date.now() };
    }),
    updatePortfolio: (portfolioId, updatedPortfolio) => set((state) => {
        const newPortfolios = new Map(state.portfolios);
        if (newPortfolios.has(portfolioId)) {
            newPortfolios.set(portfolioId, updatedPortfolio);
        }
        return { portfolios: newPortfolios, lastUpdated: Date.now() };
    }),
    getPortfolio: (portfolioId) => {
        const portfolios = get().portfolios;
        return portfolios.get(portfolioId);
    },
    setLastUpdated: () => {
        set(() => ({ lastUpdated: Date.now() }));
    }
}));
