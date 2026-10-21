import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeeklyBucket = {
  _id?: {
    year?: number;
    week?: number;
  };
  totalRides?: number;
  totalIncome?: number;
};

type DailyOrMonthlyBucket = {
  _id?: string;
  totalRides?: number;
  totalIncome?: number;
};

type DriverEarningsChartProps = {
  ridesDaily?: DailyOrMonthlyBucket[];
  ridesWeekly?: WeeklyBucket[];
  ridesMonthly?: DailyOrMonthlyBucket[];
};

type Period = "daily" | "weekly" | "monthly";

type ChartPoint = {
  label: string;
  totalRides: number;
  totalIncome: number;
};

const PERIOD_LABELS: Record<Period, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const DriverEarningsChart = ({
  ridesDaily = [],
  ridesWeekly = [],
  ridesMonthly = [],
}: DriverEarningsChartProps) => {
  const [period, setPeriod] = useState<Period>("daily");

  const chartData = useMemo<ChartPoint[]>(() => {
    if (period === "daily") {
      return ridesDaily.map((item) => ({
        label: item._id || "N/A",
        totalRides: item.totalRides || 0,
        totalIncome: item.totalIncome || 0,
      }));
    }

    if (period === "weekly") {
      return ridesWeekly.map((item) => ({
        label: `${item._id?.year || 0}-W${item._id?.week || 0}`,
        totalRides: item.totalRides || 0,
        totalIncome: item.totalIncome || 0,
      }));
    }

    return ridesMonthly.map((item) => ({
      label: item._id || "N/A",
      totalRides: item.totalRides || 0,
      totalIncome: item.totalIncome || 0,
    }));
  }, [period, ridesDaily, ridesMonthly, ridesWeekly]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Earnings Trends</CardTitle>
          <div className="flex rounded-md border bg-muted/30 p-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((value) => (
              <button
                key={value}
                type="button"
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  value === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setPeriod(value)}
              >
                {PERIOD_LABELS[value]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "totalIncome" ? `BDT ${value.toLocaleString()}` : value,
                    name === "totalIncome" ? "Income" : "Rides",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="totalIncome"
                  stroke="var(--chart-2)"
                  fill="var(--chart-1)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="totalRides"
                  stroke="var(--foreground)"
                  fill="var(--muted-foreground)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No earnings data available for chart view yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

