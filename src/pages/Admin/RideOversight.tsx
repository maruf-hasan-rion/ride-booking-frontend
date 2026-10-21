import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { ListFilterBar } from "@/components/shared/dashboard/ListFilterBar";
import { PaginatedDataTable } from "@/components/shared/dashboard/PaginatedDataTable";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetAllRidesForAdminQuery } from "@/redux/features/ride/ride.api";
import { RIDE_STATUS_FILTER_OPTIONS } from "@/constants/rideStatus";
import type { RideStatus } from "@/types/domain";
import { extractArrayData, extractMeta } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";

type RidePerson =
  | string
  | {
      _id?: string;
      name?: string;
      email?: string;
      contactNo?: string;
    };

type RideDriver =
  | string
  | {
      _id?: string;
      vehicleInfo?: string;
      user?: RidePerson;
    };

type RideTimestamps = {
  requestedAt?: string;
  completedAt?: string;
};

type AdminRide = {
  _id: string;
  status?: RideStatus;
  distance?: number;
  fare?: number;
  createdAt?: string;
  riderId?: RidePerson;
  driverId?: RideDriver;
  timestamps?: RideTimestamps;
};

const getRiderLabel = (rider?: RidePerson) => {
  if (!rider) return "Unassigned";
  if (typeof rider === "string") return rider;
  return rider.name || rider.email || rider.contactNo || rider._id || "Unknown Rider";
};

const getDriverLabel = (driver?: RideDriver) => {
  if (!driver) return "Unassigned";
  if (typeof driver === "string") return driver;

  const user = driver.user;
  const userLabel =
    typeof user === "string"
      ? user
      : user?.name || user?.email || user?.contactNo || user?._id || "Unknown Driver";

  return driver.vehicleInfo ? `${userLabel} (${driver.vehicleInfo})` : userLabel;
};

export default function AdminRideOversight() {
  const { state, setState, query, resetFilters } = useListQueryState(
    { limit: 10 },
    { statusParamKey: "status" }
  );
  const [driverSearch, setDriverSearch] = useState("");
  const [riderSearch, setRiderSearch] = useState("");

  const queryParams = useMemo(
    () => ({
      ...query,
      riderSearch: riderSearch.trim() || undefined,
      driverSearch: driverSearch.trim() || undefined,
    }),
    [driverSearch, query, riderSearch]
  );

  const { data: ridesResponse, isLoading } = useGetAllRidesForAdminQuery(queryParams);

  const rides = extractArrayData<AdminRide>(ridesResponse);
  const meta = extractMeta(ridesResponse);
  const totalPage = meta?.totalPage || 1;

  useEffect(() => {
    if (state.page > totalPage) {
      setState((previous) => ({ ...previous, page: totalPage }));
    }
  }, [setState, state.page, totalPage]);

  const handleReset = () => {
    resetFilters();
    setDriverSearch("");
    setRiderSearch("");
  };

  return (
    <div className="space-y-4">
      <ListFilterBar
        searchPlaceholder="Search by ride ID, rider or driver, status"
        searchTerm={state.searchTerm}
        onSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, searchTerm: value }))}
        dateSearch={state.dateSearch}
        onDateSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, dateSearch: value }))}
        statusValue={state.rideStatus}
        onStatusChange={(value) => setState((prev) => ({ ...prev, page: 1, rideStatus: value }))}
        statusOptions={RIDE_STATUS_FILTER_OPTIONS}
        onReset={handleReset}
      >
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
          <Input
            value={riderSearch}
            onChange={(event) => {
              setRiderSearch(event.target.value);
              setState((previous) => ({ ...previous, page: 1 }));
            }}
            placeholder="Filter by rider"
          />
          <Input
            value={driverSearch}
            onChange={(event) => {
              setDriverSearch(event.target.value);
              setState((previous) => ({ ...previous, page: 1 }));
            }}
            placeholder="Filter by driver"
          />
        </div>
      </ListFilterBar>

      <Card>
        <CardHeader>
          <CardTitle>Ride Oversight</CardTitle>
        </CardHeader>
        <CardContent>
          <DataStateView
            isLoading={isLoading}
            hasData={rides.length > 0}
            emptyMessage="No ride data found for current filters."
          >
            <PaginatedDataTable
              currentPage={state.page}
              totalPage={totalPage}
              onPageChange={(page) => setState((prev) => ({ ...prev, page }))}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Distance (km)</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead>Completed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.map((ride) => (
                    <TableRow key={ride._id}>
                      <TableCell className="font-mono text-xs">{ride._id}</TableCell>
                      <TableCell>{getRiderLabel(ride.riderId)}</TableCell>
                      <TableCell>{getDriverLabel(ride.driverId)}</TableCell>
                      <TableCell>
                        {typeof ride.distance === "number" ? ride.distance.toFixed(2) : "N/A"}
                      </TableCell>
                      <TableCell>{formatCurrencyBDT(ride.fare)}</TableCell>
                      <TableCell>
                        <StatusBadge status={ride.status || "REQUESTED"} />
                      </TableCell>
                      <TableCell>
                        {formatDateTime(ride.timestamps?.requestedAt || ride.createdAt)}
                      </TableCell>
                      <TableCell>{formatDateTime(ride.timestamps?.completedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PaginatedDataTable>
          </DataStateView>
        </CardContent>
      </Card>
    </div>
  );
}
