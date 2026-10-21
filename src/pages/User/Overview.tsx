import RideCardCompact, {
  type CompactRide,
} from "@/components/modules/User/RideCardCompact";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsStatCard } from "@/components/modules/Admin/AnalyticsStatCard";
import { useGetRiderReportQuery } from "@/redux/features/stats/stats.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllMyRidesQuery } from "@/redux/features/ride/ride.api";
import { extractArrayData, extractData } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";
import { Car, DollarSign, Clock, Ban, ChevronRight } from "lucide-react";
import { Link } from "react-router";

type UserProfile = {
  name?: string;
  createdAt?: string;
};

type RiderReport = {
  totalCompletedRides?: number;
  totalCancelledRides?: number;
  totalSpent?: number;
  avgFare?: number;
};

export default function UserOverview() {
  const { data: userResponse, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const { data: reportResponse, isLoading: isReportLoading } = useGetRiderReportQuery(undefined);
  const { data: ridesResponse, isLoading: isRidesLoading } = useGetAllMyRidesQuery({
    page: 1,
    limit: 3,
  });

  const profile = extractData<UserProfile>(userResponse);
  const report = extractData<RiderReport>(reportResponse);
  const recentRides = extractArrayData<CompactRide>(ridesResponse);

  const completedRides = report?.totalCompletedRides || 0;
  const cancelledRides = report?.totalCancelledRides || 0;
  const totalRides = completedRides + cancelledRides;
  const firstName = profile?.name?.split(" ")[0] || "Rider";

  return (
    <div className="space-y-6">
      <Card className="brand-gradient-bg border-0 text-primary-foreground">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Welcome back, {firstName}!</h2>
              <p className="text-primary-foreground/80">
                Member since {profile?.createdAt ? formatDateTime(profile.createdAt) : "N/A"}
              </p>
            </div>
            <Button asChild className="w-fit bg-background text-foreground hover:bg-background/90">
              <Link to="/user/dashboard/book-ride">Book a Ride</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataStateView isLoading={isUserLoading || isReportLoading} hasData>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsStatCard
            title="Total Rides"
            value={String(totalRides)}
            icon={Car}
          />
          <AnalyticsStatCard
            title="Total Spent"
            value={formatCurrencyBDT(report?.totalSpent)}
            icon={DollarSign}
          />
          <AnalyticsStatCard
            title="Average Fare"
            value={formatCurrencyBDT(report?.avgFare)}
            icon={Clock}
          />
          <AnalyticsStatCard
            title="Cancelled"
            value={String(cancelledRides)}
            icon={Ban}
          />
        </div>
      </DataStateView>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button asChild variant="outline" className="h-11 justify-start">
            <Link to="/user/dashboard/book-ride">Request New Ride</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 justify-start">
            <Link to="/user/dashboard/history">View Ride History</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 justify-start">
            <Link to="/user/dashboard/profile">Manage Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Rides</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/user/dashboard/history">
                View All
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataStateView
            isLoading={isRidesLoading}
            hasData={recentRides.length > 0}
            emptyMessage="No recent rides yet."
          >
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <RideCardCompact key={ride._id} ride={ride} />
              ))}
            </div>
          </DataStateView>
        </CardContent>
      </Card>
    </div>
  );
}
