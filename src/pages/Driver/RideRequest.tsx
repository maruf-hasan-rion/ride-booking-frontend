import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { ListFilterBar } from "@/components/shared/dashboard/ListFilterBar";
import { PaginatedDataTable } from "@/components/shared/dashboard/PaginatedDataTable";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useToastAction } from "@/hooks/useToastAction";
import { POLL_INTERVALS } from "@/constants/polling";
import {
  useAcceptRideMutation,
  useGetDriverProfileQuery,
  useGetIncomingRideRequestsQuery,
  useRejectRideMutation,
} from "@/redux/features/driver/driver.api";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { DriverOfflineNotice } from "@/components/modules/Driver/DriverOfflineNotice";
import { DriverProfileGate } from "@/components/modules/Driver/DriverProfileGate";
import type { RideStatus } from "@/types/domain";
import {
  extractArrayData,
  extractData,
  extractMeta,
  getApiErrorMessage,
} from "@/utils/apiResponse";
import { formatCurrencyBDT, formatGeoCoordinates } from "@/utils/formatters";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Requested", value: "REQUESTED" },
];

type DriverProfileState = {
  isOnline?: boolean;
  isApproved?: boolean;
};

type RequestRider = {
  name?: string;
  email?: string;
  contactNo?: string;
};

type RequestLocation = {
  coordinates?: number[];
};

type IncomingRideRequest = {
  _id: string;
  status: RideStatus;
  fare?: number;
  riderId?: RequestRider;
  pickupLocation?: RequestLocation;
  destination?: RequestLocation;
  createdAt?: string;
};

const IncomingRequestCard = ({
  ride,
  onAccept,
  onReject,
  isMutating,
}: {
  ride: IncomingRideRequest;
  onAccept: (rideId: string) => void;
  onReject: (rideId: string) => void;
  isMutating: boolean;
}) => {
  const rider = ride?.riderId || {};

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span>{rider?.name || "Unknown Rider"}</span>
          <StatusBadge status={ride?.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Contact details are shared after you accept.
        </p>
        <p>Pickup: {formatGeoCoordinates(ride?.pickupLocation)}</p>
        <p>Destination: {formatGeoCoordinates(ride?.destination)}</p>
        <p className="font-semibold">Estimated Fare: {formatCurrencyBDT(ride?.fare)}</p>

        <div className="flex gap-2">
          <Button className="flex-1" disabled={isMutating} onClick={() => onAccept(ride._id)}>
            Accept
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={isMutating}
            onClick={() => onReject(ride._id)}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DriverRideRequest() {
  const { state, setState, query, resetFilters } = useListQueryState({ limit: 6 });
  const [pendingRideId, setPendingRideId] = useState<string | null>(null);
  const runAction = useToastAction();

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetDriverProfileQuery(undefined);
  const profile = extractData<DriverProfileState>(profileResponse);
  const hasDriverProfile = Boolean(profile);

  const apiQuery = useMemo(() => {
    const params: Record<string, string> = {
      page: query.page,
      limit: query.limit,
    };

    if (query.searchTerm) {
      params.searchTerm = query.searchTerm;
    }

    return params;
  }, [query.limit, query.page, query.searchTerm]);

  const {
    data: incomingResponse,
    isLoading: isIncomingLoading,
    error: incomingError,
    refetch: refetchIncoming,
  } = useGetIncomingRideRequestsQuery(apiQuery, {
    pollingInterval: POLL_INTERVALS.RIDE_STATUS,
    skip: !hasDriverProfile || !profile?.isApproved || !profile?.isOnline,
  });

  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const [rejectRide, { isLoading: isRejecting }] = useRejectRideMutation();

  const incoming = extractArrayData<IncomingRideRequest>(incomingResponse);
  const totalPage = extractMeta(incomingResponse)?.totalPage || 1;

  const profileErrorMessage = profileError ? getApiErrorMessage(profileError, "Failed to load driver profile.") : "";
  const needsProfileSetup = !isProfileLoading && !hasDriverProfile;

  const handleAccept = async (rideId: string) => {
    setPendingRideId(rideId);
    // Losing a race shows the API's own message (already accepted / active ride).
    await runAction(() => acceptRide(rideId).unwrap(), {
      success: "Ride request accepted.",
      fallback: "Failed to accept request.",
    });
    setPendingRideId(null);
  };

  const handleReject = async (rideId: string) => {
    setPendingRideId(rideId);
    await runAction(() => rejectRide(rideId).unwrap(), {
      success: "Ride request rejected.",
      fallback: "Failed to reject request.",
    });
    setPendingRideId(null);
  };

  if (isProfileLoading) {
    return (
      <DataStateView isLoading hasData={false} emptyMessage="Loading driver profile." />
    );
  }

  if (needsProfileSetup) {
    return (
      <DriverProfileGate
        description="Your driver profile is missing. Add vehicle details to start receiving ride requests."
        profileError={profileErrorMessage}
      />
    );
  }

  if (!profile?.isApproved) {
    return (
      <DriverOfflineNotice
        title="Driver Account Not Approved"
        description="Your account is pending admin approval. Ride request actions will be enabled after approval."
      />
    );
  }

  if (!profile?.isOnline) {
    return <DriverOfflineNotice />;
  }

  return (
    <div className="space-y-4">
      <ListFilterBar
        searchPlaceholder="Search by rider name or ride ID"
        searchTerm={state.searchTerm}
        onSearchChange={(value) =>
          setState((previous) => ({ ...previous, page: 1, searchTerm: value }))
        }
        dateSearch={state.dateSearch}
        onDateSearchChange={(value) =>
          setState((previous) => ({ ...previous, page: 1, dateSearch: value }))
        }
        statusValue={state.rideStatus}
        onStatusChange={(value) =>
          setState((previous) => ({ ...previous, page: 1, rideStatus: value }))
        }
        statusOptions={statusOptions}
        onReset={resetFilters}
      />

      <DataStateView
        isLoading={isIncomingLoading}
        hasData={incoming.length > 0}
        errorMessage={
          incomingError
            ? getApiErrorMessage(incomingError, "Failed to load ride requests.")
            : undefined
        }
        onRetry={() => void refetchIncoming()}
        emptyMessage="No incoming ride requests right now."
      >
        <PaginatedDataTable
          currentPage={state.page}
          totalPage={totalPage}
          onPageChange={(page) => setState((previous) => ({ ...previous, page }))}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {incoming.map((ride) => (
              <IncomingRequestCard
                key={ride._id}
                ride={ride}
                onAccept={handleAccept}
                onReject={handleReject}
                isMutating={(isAccepting || isRejecting) && pendingRideId === ride._id}
              />
            ))}
          </div>
        </PaginatedDataTable>
      </DataStateView>
    </div>
  );
}
