import { useUser } from "@/hooks/use-user";
import crypto from "crypto";

class Portfolio {
    public id: string;
    public name: string;
    public description: string;
    public balance: number;
    public totalValue: number;
    public performance: number;
    public stocks: Map<string, Stock>;

    constructor(name: string, balance: number, stocks: Map<string, Stock>) {
        this.balance = balance;
        this.stocks = stocks;
        this.totalValue = this.calculateTotalValue();
        this.performance = this.calculatePerformance();
        this.name = name;
        this.id = this.generateId();
        this.description = "";
    }

    private generateId(): string {
        const user = useUser((state) => state.user);
        if (user === undefined) return "";
        return this.hashString(user.email + this.name);
    }

    private hashString(str: string): string {
        let hash: string = "";
        if (str.length === 0) return hash;
        crypto.createHash("sha256").update(str).digest("hex");
        return hash;
    }


    private calculateTotalValue(): number {
        let totalValue = this.balance;
        for (const [_, stock] of this.stocks) {
            totalValue += stock.totalValue;
        }
        return totalValue;
    }

    private calculatePerformance(): number {
        let performance = 0;
        for (const [_, stock] of this.stocks) {
            performance += stock.performance;
        }
        return performance;
    }

    public addStock(stock: Stock): void {
        this.stocks.set(stock.symbol, stock);
        this.totalValue = this.calculateTotalValue();
        this.performance = this.calculatePerformance();
    }

    public remoteUpdate(): void {
        
    }

}

export default Portfolio;