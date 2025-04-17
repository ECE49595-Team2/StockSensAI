"use client";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/shadcn/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { chartConfig, Transaction } from "./chart";
import { useStockSelection } from "@/hooks/use-stock-select";

interface StockChartProps {
    transactions: { [symbol: string]: Transaction[] };
}

const CustomTooltip = ({ payload, label }: { payload?: { name: string; value: number }[]; label?: string }) => {
  if (!payload || payload.length === 0) return null;
  
  return (
    <div className="bg-background p-2 rounded-lg flex flex-col gap-5">
    <p className="text-white font-bold">{label}</p> {/* Timestamp */}
    {payload.map((entry: { name: string; value: number }, index: number) => (
      <p key={index} className="text-secondary font-bold">
      {`${(entry.name as string).charAt(0).toUpperCase()}${(entry.name as string).slice(1)}`}: <span className="text-secondary">{entry.value}</span> {/* Quantity and Value */}
      </p>
    ))}
    </div>
  );
  };

function StockChart_Client({ transactions }: StockChartProps) {
    const ticker = useStockSelection((state) => state.selection);

    return <ChartContainer config={chartConfig}>
        <LineChart
            data={transactions[ticker]}
        >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={true}
              axisLine={true}
              tickMargin={2}
              tickFormatter={(value: string) => value.slice(0, 10) }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              wrapperClassName=""
              labelClassName="text-white"
              cursor={true}
              content={<CustomTooltip />}
            />
            <Line
              dataKey="quantity"
              type="natural"
              stroke="orange"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
        </LineChart>
    </ChartContainer>;
}

export default StockChart_Client;