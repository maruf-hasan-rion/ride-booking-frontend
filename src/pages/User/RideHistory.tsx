import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useGetAllMyRidesQuery } from "@/redux/features/ride/ride.api";
import { ListFilterBar } from "@/components/shared/dashboard/ListFilterBar";
import { FareRangeInputs, type FareRange } from "@/components/shared/dashboard/FareRangeInputs";
import { useListQueryState } from "@/hooks/useListQueryState";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { PaginatedDataTable } from "@/components/shared/dashboard/PaginatedDataTable";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { RIDE_STATUS_FILTER_OPTIONS } from "@/constants/rideStatus";
import type { RideStatus } from "@/types/domain";
import { extractArrayData, extractMeta } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";

type RiderHistoryRide = {
  _id: string;
  status?: RideStatus;
  fare?: number;
  distance?: number;
  createdAt?: string;
  timestamps?: {
    completedAt?: string;
  };
};

export default function RiderRideHistory() {
  const { state, setState, query, resetFilters } = useListQueryState();
  const [fareRange, setFareRange] = useState<FareRange>({ min: "", max: "" });

  const apiQuery = useMemo(() => {
    const params: Record<string, string> = { ...query };
    if (params.rideStatus) {
      params.status = params.rideStatus;
      delete params.rideStatus;
    }
    return params;
  }, [query]);

  const { data: ridesResponse, isLoading } = useGetAllMyRidesQuery(apiQuery);

  const rides = extractArrayData<RiderHistoryRide>(ridesResponse);

  const visibleRides = useMemo(() => {
    const minFare = Number(fareRange.min);
    const maxFare = Number(fareRange.max);
    const hasMinFare = fareRange.min.trim() !== "" && !Number.isNaN(minFare);
    const hasMaxFare = fareRange.max.trim() !== "" && !Number.isNaN(maxFare);

    return rides.filter((ride) => {
      const fare = ride.fare ?? 0;
      if (hasMinFare && fare < minFare) return false;
      if (hasMaxFare && fare > maxFare) return false;
      return true;
    });
  }, [fareRange.max, fareRange.min, rides]);

  const totalPage = extractMeta(ridesResponse)?.totalPage || 1;

  const handleReset = () => {
    resetFilters();
    setFareRange({ min: "", max: "" });
  };

  return (
    <div className="space-y-4">
      <ListFilterBar
        searchPlaceholder="Search by status or transaction"
        searchTerm={state.searchTerm}
        onSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, searchTerm: value }))}
        dateSearch={state.dateSearch}
        onDateSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, dateSearch: value }))}
        statusValue={state.rideStatus}
        onStatusChange={(value) => setState((prev) => ({ ...prev, page: 1, rideStatus: value }))}
        statusOptions={RIDE_STATUS_FILTER_OPTIONS}
        onReset={handleReset}
      >
        <FareRangeInputs value={fareRange} onChange={setFareRange} />
      </ListFilterBar>

      <DataStateView
        isLoading={isLoading}
        hasData={visibleRides.length > 0}
        emptyMessage="No ride history found."
      >
        <PaginatedDataTable
          currentPage={state.page}
          totalPage={totalPage}
          onPageChange={(page) => setState((prev) => ({ ...prev, page }))}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRides.map((ride) => (
                <TableRow key={ride._id}>
                  <TableCell>{ride.distance?.toFixed(2) ?? "N/A"}</TableCell>
                  <TableCell>{formatCurrencyBDT(ride.fare)}</TableCell>
                  <TableCell>
                    <StatusBadge status={ride.status || "REQUESTED"} />
                  </TableCell>
                  <TableCell>{formatDateTime(ride.timestamps?.completedAt || ride.createdAt)}</TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/my-ride/${ride._id}`}>
                        Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PaginatedDataTable>
      </DataStateView>
    </div>
  );
}
