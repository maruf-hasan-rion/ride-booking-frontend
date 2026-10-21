import { useMemo, useState } from "react";
import { DollarSign, CarTaxiFront, TrendingUp, Users, UserCheck, Ban } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { AnalyticsStatCard } from "@/components/modules/Admin/AnalyticsStatCard";
import { useGetAdminReportQuery } from "@/redux/features/stats/stats.api";
import { POLL_INTERVALS } from "@/constants/polling";
import { extractData, getApiErrorMessage } from "@/utils/apiResponse";
import { formatCurrencyBDT } from "@/utils/formatters";

type ChartPeriod = "daily" | "weekly" | "monthly";

type AdminPeriodBucket = {
  _id?: string;
  totalRides?: number;
  totalEarnings?: number;
  totalFareMoney?: number;
};

type AdminWeeklyBucket = {
  _id?: {
    year?: number;
    week?: number;
  };
  totalRides?: number;
  totalEarnings?: number;
  totalFareMoney?: number;
};

type AdminReport = {
  totalRiders?: number;
  totalDrivers?: number;
  totalCompletedRides?: number;
  totalCancelledRides?: number;
  totalFareMoney?: number;
  totalEarnings?: number;
  ridesDaily?: AdminPeriodBucket[];
  ridesWeekly?: AdminWeeklyBucket[];
  ridesMonthly?: AdminPeriodBucket[];
};

type AnalyticsRow = {
  label: string;
  totalRides: number;
  totalEarnings: number;
  totalFareMoney: number;
  ridesPerDriver: number;
};

const DEFAULT_REPORT: AdminReport = {
  totalRiders: 0,
  totalDrivers: 0,
  totalCompletedRides: 0,
  totalCancelledRides: 0,
  totalFareMoney: 0,
  totalEarnings: 0,
  ridesDaily: [],
  ridesWeekly: [],
  ridesMonthly: [],
};

const PERIOD_OPTIONS: Array<{ label: string; value: ChartPeriod }> = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

const getPeriodLabel = (period: ChartPeriod, bucket: AdminPeriodBucket | AdminWeeklyBucket) => {
  if (period === "weekly") {
    const weekly = bucket as AdminWeeklyBucket;
    const year = weekly._id?.year || "YYYY";
    const week = String(weekly._id?.week || "00").padStart(2, "0");
    return `${year}-W${week}`;
  }

  const withStringId = bucket as AdminPeriodBucket;
  return withStringId._id || "N/A";
};

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<ChartPeriod>("daily");

  const { data: reportResponse, isLoading, error } = useGetAdminReportQuery(undefined, {
    pollingInterval: POLL_INTERVALS.REPORTS,
  });
  const errorMessage = error ? getApiErrorMessage(error, "Failed to load analytics data.") : "";
  const hasReportData = Boolean(reportResponse);
  const report = extractData<AdminReport>(reportResponse) || DEFAULT_REPORT;

  const chartData = useMemo<AnalyticsRow[]>(() => {
    const rawBuckets =
      period === "daily"
        ? report.ridesDaily || []
        : period === "weekly"
          ? report.ridesWeekly || []
          : report.ridesMonthly || [];

    return rawBuckets.map((bucket) => {
      const totalRides = bucket.totalRides || 0;
      const totalDrivers = report.totalDrivers || 0;

      return {
        label: getPeriodLabel(period, bucket),
        totalRides,
        totalEarnings: bucket.totalEarnings || 0,
        totalFareMoney: bucket.totalFareMoney || 0,
        ridesPerDriver: totalDrivers > 0 ? Number((totalRides / totalDrivers).toFixed(2)) : 0,
      };
    });
  }, [period, report]);

  const totalRideVolume = (report.totalCompletedRides || 0) + (report.totalCancelledRides || 0);
  const completionRate =
    totalRideVolume > 0 ? Math.round(((report.totalCompletedRides || 0) / totalRideVolume) * 100) : 0;

  const rideOutcomeData = [
    { name: "Completed", value: report.totalCompletedRides || 0 },
    { name: "Cancelled", value: report.totalCancelledRides || 0 },
  ];

  if (errorMessage && !isLoading && !hasReportData) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">{errorMessage}</CardContent>
      </Card>
    );
  }

  return (
    <DataStateView isLoading={isLoading} hasData>
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnalyticsStatCard
            title="Total Riders"
            value={report.totalRiders || 0}
            description="Registered rider accounts"
            icon={Users}
          />
          <AnalyticsStatCard
            title="Total Drivers"
            value={report.totalDrivers || 0}
            description="Drivers in the platform"
            icon={UserCheck}
          />
          <AnalyticsStatCard
            title="Ride Volume"
            value={totalRideVolume}
            description="Completed + cancelled rides"
            icon={CarTaxiFront}
          />
          <AnalyticsStatCard
            title="Completed Rides"
            value={report.totalCompletedRides || 0}
            description={`${completionRate}% completion rate`}
            icon={TrendingUp}
          />
          <AnalyticsStatCard
            title="Cancelled Rides"
            value={report.totalCancelledRides || 0}
            description="Rides cancelled by riders/drivers"
            icon={Ban}
          />
          <AnalyticsStatCard
            title="Platform Revenue"
            value={formatCurrencyBDT(report.totalEarnings)}
            description={`Gross fare: ${formatCurrencyBDT(report.totalFareMoney)}`}
            icon={DollarSign}
          />
        </section>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Ride Volume and Revenue Trends</CardTitle>
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={period === option.value ? "default" : "outline"}
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalRides"
                    name="Total Rides"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalEarnings"
                    name="Owner Earnings"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="ridesPerDriver"
                    name="Driver Activity"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown by {period}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalFareMoney" name="Total Fare" fill="var(--chart-1)" />
                    <Bar dataKey="totalEarnings" name="Owner Earnings" fill="var(--chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ride Outcome Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rideOutcomeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {rideOutcomeData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Driver activity is reflected in trend lines as rides completed per driver over time.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </DataStateView>
  );
}
