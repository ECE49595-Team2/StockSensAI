class Stock {
    public symbol: string;
    public name: string;
    public price: number;
    public quantity: number;
    public totalValue: number;
    public performance: number;

    constructor(symbol: string, name: string, price: number, quantity: number) {
        this.symbol = symbol;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.totalValue = price * quantity;
        this.performance = 0; // Placeholder for performance calculation
    }
}