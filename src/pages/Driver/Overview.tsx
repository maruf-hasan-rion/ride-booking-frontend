import { Car, CalendarCheck2, CircleDollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { DriverEarningsChart } from "@/components/modules/Driver/DriverEarningsChart";
import { DriverProfileGate } from "@/components/modules/Driver/DriverProfileGate";
import { EmergencySOSButton } from "@/components/shared/safety/EmergencySOSButton";
import { useGetDriverReportQuery } from "@/redux/features/stats/stats.api";
import {
  useGetActiveRideForDriverQuery,
  useGetDriverProfileQuery,
  useUpdateDriverRideStatusMutation,
  useUpdateDriverStatusMutation,
} from "@/redux/features/driver/driver.api";
import { useToastAction } from "@/hooks/useToastAction";
import { POLL_INTERVALS } from "@/constants/polling";
import type { RideStatus } from "@/types/domain";
import { AnalyticsStatCard } from "@/components/modules/Admin/AnalyticsStatCard";
import { extractData, getApiErrorMessage } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatGeoCoordinates } from "@/utils/formatters";

type DriverProfileState = {
  isOnline?: boolean;
  isApproved?: boolean;
};

type RideUser = {
  name?: string;
  email?: string;
  contactNo?: string;
};

type RideLocation = {
  coordinates?: number[];
};

type DriverActiveRide = {
  _id: string;
  status: RideStatus;
  fare?: number;
  riderId?: RideUser;
  pickupLocation?: RideLocation;
  destination?: RideLocation;
};

type DriverIncomeBucket = {
  _id?: string;
  totalIncome?: number;
  totalRides?: number;
};

type DriverWeeklyIncomeBucket = {
  _id?: {
    year?: number;
    week?: number;
  };
  totalIncome?: number;
  totalRides?: number;
};

type DriverReport = {
  ridesDaily?: DriverIncomeBucket[];
  ridesWeekly?: DriverWeeklyIncomeBucket[];
  ridesMonthly?: DriverIncomeBucket[];
  totalCompletedRides?: number;
  totalCancelledRides?: number;
  totalEarnings?: number;
};

const NEXT_STATUS: Partial<Record<RideStatus, RideStatus | null>> = {
  ACCEPTED: "PICKED_UP",
  PICKED_UP: "IN_TRANSIT",
  IN_TRANSIT: "ARRIVED",
  ARRIVED: "COMPLETED",
  COMPLETED: null,
};

const AvailabilityCard = ({
  isOnline,
  isApproved,
  isUpdating,
  onChange,
}: {
  isOnline: boolean;
  isApproved: boolean;
  isUpdating: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Card className="border-primary/25">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{isOnline ? "You are Online" : "You are Offline"}</h3>
          <p className="text-sm text-muted-foreground">
            {isApproved
              ? "Toggle availability to receive and accept incoming rides."
              : "Your account is not approved by admin yet."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="driver-availability">Availability</Label>
          <Switch
            id="driver-availability"
            checked={isOnline}
            disabled={isUpdating || !isApproved}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const EarningsCards = ({ report }: { report: DriverReport | null }) => {
  const dailyIncome =
    report?.ridesDaily?.reduce((sum, item) => sum + (item.totalIncome || 0), 0) || 0;
  const weeklyIncome =
    report?.ridesWeekly?.reduce((sum, item) => sum + (item.totalIncome || 0), 0) || 0;
  const monthlyIncome =
    report?.ridesMonthly?.reduce((sum, item) => sum + (item.totalIncome || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsStatCard
        title="Daily Income"
        value={formatCurrencyBDT(dailyIncome)}
        icon={Wallet}
      />
      <AnalyticsStatCard
        title="Weekly Income"
        value={formatCurrencyBDT(weeklyIncome)}
        icon={CircleDollarSign}
      />
      <AnalyticsStatCard
        title="Monthly Income"
        value={formatCurrencyBDT(monthlyIncome)}
        icon={CalendarCheck2}
      />
      <AnalyticsStatCard
        title="Completed Rides"
        value={report?.totalCompletedRides || 0}
        description={`Cancelled: ${report?.totalCancelledRides || 0} | Total Earnings: ${formatCurrencyBDT(report?.totalEarnings)}`}
        icon={Car}
      />
    </div>
  );
};

const ActiveRideCard = ({
  ride,
  isUpdating,
  onAdvanceStatus,
}: {
  ride: DriverActiveRide | null;
  isUpdating: boolean;
  onAdvanceStatus: (rideId: string, status: RideStatus) => void;
}) => {
  if (!ride) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No active ride right now.
        </CardContent>
      </Card>
    );
  }

  const nextStatus = NEXT_STATUS[ride.status] ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Ride Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">{ride.riderId?.name || "Unknown Rider"}</p>
            <p className="text-sm text-muted-foreground">{ride.riderId?.contactNo || "No contact"}</p>
          </div>
          <StatusBadge status={ride.status} />
        </div>

        <div className="grid gap-2 text-sm">
          <p>Pickup: {formatGeoCoordinates(ride.pickupLocation)}</p>
          <p>Destination: {formatGeoCoordinates(ride.destination)}</p>
          <p>Fare: {formatCurrencyBDT(ride.fare)}</p>
        </div>

        <Button
          disabled={!nextStatus || isUpdating}
          onClick={() => nextStatus && onAdvanceStatus(ride._id, nextStatus)}
          className="w-full"
        >
          {nextStatus ? `Mark ${nextStatus.replaceAll("_", " ")}` : "Ride Completed"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Cancellation is handled from rider/admin side in current backend workflow.
        </p>
      </CardContent>
    </Card>
  );
};

export default function DriverOverview() {
  const runAction = useToastAction();
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetDriverProfileQuery(undefined);
  const profile = extractData<DriverProfileState>(profileResponse);
  const hasDriverProfile = Boolean(profile);

  const { data: activeRideResponse, isLoading: isActiveRideLoading } = useGetActiveRideForDriverQuery(
    undefined,
    {
      pollingInterval: POLL_INTERVALS.RIDE_STATUS,
      skip: !hasDriverProfile,
    }
  );
  const { data: reportResponse, isLoading: isReportLoading } = useGetDriverReportQuery(undefined, {
    pollingInterval: POLL_INTERVALS.REPORTS,
    skip: !hasDriverProfile,
  });

  const [updateDriverStatus, { isLoading: isUpdatingStatus }] = useUpdateDriverStatusMutation();
  const [updateRideStatus, { isLoading: isUpdatingRideStatus }] = useUpdateDriverRideStatusMutation();

  const activeRide = extractData<DriverActiveRide>(activeRideResponse);
  const report = extractData<DriverReport>(reportResponse);
  const profileErrorMessage = profileError ? getApiErrorMessage(profileError, "Failed to load driver profile.") : "";
  const needsProfileSetup = !isProfileLoading && !hasDriverProfile;

  const handleAvailabilityChange = async (isOnline: boolean) => {
    await runAction(() => updateDriverStatus(isOnline).unwrap(), {
      success: `You are now ${isOnline ? "online" : "offline"}.`,
      fallback: "Failed to update availability.",
    });
  };

  const handleAdvanceStatus = async (rideId: string, status: RideStatus) => {
    await runAction(() => updateRideStatus({ rideId, status }).unwrap(), {
      success: `Ride updated to ${status.replaceAll("_", " ")}.`,
      fallback: "Failed to update ride status.",
    });
  };

  if (needsProfileSetup) {
    return (
      <DriverProfileGate
        description="Add your vehicle details from profile settings to activate driver features."
        profileError={profileErrorMessage}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <DataStateView
          isLoading={isProfileLoading || isActiveRideLoading || isReportLoading}
          hasData
        >
          <AvailabilityCard
            isOnline={Boolean(profile?.isOnline)}
            isApproved={Boolean(profile?.isApproved)}
            isUpdating={isUpdatingStatus}
            onChange={handleAvailabilityChange}
          />

          <ActiveRideCard
            ride={activeRide || null}
            isUpdating={isUpdatingRideStatus}
            onAdvanceStatus={handleAdvanceStatus}
          />

          <EarningsCards report={report || null} />

          <DriverEarningsChart
            ridesDaily={report?.ridesDaily}
            ridesWeekly={report?.ridesWeekly}
            ridesMonthly={report?.ridesMonthly}
          />
        </DataStateView>
      </div>
      <EmergencySOSButton isActiveRide={Boolean(activeRide)} role="DRIVER" />
    </>
  );
}
