type StockData = {
    data: {
        price: number;
    };
};

type Stocks = {
    [symbol: string]: StockData;
};

async function PortfolioSidebar({ children, id }: { children: React.ReactNode, id: string }) {

    const stocksResponse = await fetch(
        `http://localhost:3000/api/portfolio/${id}`,
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    )

    const stockResponse: Stocks = await stocksResponse.json();
    const stocks: StockData = stockResponse.stocks;


    return (
        <div className="flex flex-1 flex-row gap-4">
            <div className="flex flex-col w-1/4 bg-background rounded-lg p-4">
                {Object.entries(stocks).map(([symbol, data]) => (
                    <div key={symbol} className="rounded border p-4 shadow-sm">
                        <h2 className="font-bold text-lg">{symbol}</h2>
                        <p>Price: ${data.price}</p>
                    </div>
                ))}
            </div>
            {children}
        </div>
    )
}

export default PortfolioSidebar;