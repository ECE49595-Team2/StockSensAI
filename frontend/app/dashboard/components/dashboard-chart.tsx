"use client"

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
} from "@/shadcn/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart"
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

// Define ChartConfig type if not already defined
type ChartConfig = {
  timestamp: {
    label: string;
    color: string;
  };
  value: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  timestamp: {
    label: "Date",
    color: "blue",
  },
  value: {
    label: "Value",
    color: "secondary"
  }
} satisfies ChartConfig

export function DashboardChart() {
  const [chartData, setChartData] = useState<{ timestamp: string; value: number }[]>([]);
  const user = useUser((state => state.user));

  useEffect(() => {
    console.log("user", user);
    console.log("char data", chartData);
    if (user?.email) {
      fetch("/api/algo/update-account/", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (!response.ok) {
          toast.error("Failed to fetch chart data", {
            richColors: true,
            description: "Please try again later.",
            position: "top-center",
          });
          return;
        }
        const data: [{ timestamp: string, value: number}] = await response.json();
        console.log("Chart data fetched:", data);
        setChartData(data);
      });
    }

  }, [setChartData, user?.email]);

  return (
    <Card className="col-span-4">
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-primary"
                  nameKey="timestamp"
                  labelFormatter={(value) => {
                    return value;
                  }}
                />
              }
            />
            <Line
              dataKey={"value"}
              type="monotone"
              stroke="red"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
