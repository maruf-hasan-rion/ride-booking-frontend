import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { ListFilterBar } from "@/components/shared/dashboard/ListFilterBar";
import { PaginatedDataTable } from "@/components/shared/dashboard/PaginatedDataTable";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { FareRangeInputs, type FareRange } from "@/components/shared/dashboard/FareRangeInputs";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useGetDriverEarningsQuery } from "@/redux/features/driver/driver.api";
import { extractArrayData } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";

type DriverCompletedRide = {
  _id: string;
  createdAt?: string;
  fare?: number;
  timestamps?: {
    completedAt?: string;
  };
};

// Completed rides only, so the live status filter stays fixed.
const COMPLETED_STATUS_OPTIONS = [{ label: "Completed", value: "COMPLETED" }];

export default function DriverRideHistory() {
  const { state, setState, resetFilters } = useListQueryState({ limit: 10 });
  const [fareRange, setFareRange] = useState<FareRange>({ min: "", max: "" });
  const { data, isLoading } = useGetDriverEarningsQuery(undefined);

  const rides = extractArrayData<DriverCompletedRide>(data);

  const filteredRides = useMemo(() => {
    const searchTerm = state.searchTerm.trim().toLowerCase();
    const dateSearch = state.dateSearch.trim();

    const minFare = Number(fareRange.min);
    const maxFare = Number(fareRange.max);
    const hasMinFare = fareRange.min.trim() !== "" && !Number.isNaN(minFare);
    const hasMaxFare = fareRange.max.trim() !== "" && !Number.isNaN(maxFare);

    return rides.filter((ride) => {
      const completedAt = ride.timestamps?.completedAt || ride.createdAt || "";
      const dateValue = completedAt ? completedAt.slice(0, 10) : "";
      const fare = ride.fare ?? 0;

      const matchesSearch =
        !searchTerm ||
        ride._id.toLowerCase().includes(searchTerm) ||
        formatDateTime(
          ride.timestamps?.completedAt || ride.createdAt,
        )
          .toLowerCase()
          .includes(searchTerm);

      const matchesDate = !dateSearch || dateValue === dateSearch;
      const matchesMinFare = !hasMinFare || fare >= minFare;
      const matchesMaxFare = !hasMaxFare || fare <= maxFare;

      return matchesSearch && matchesDate && matchesMinFare && matchesMaxFare;
    });
  }, [fareRange.max, fareRange.min, rides, state.dateSearch, state.searchTerm]);

  const totalPage = Math.max(1, Math.ceil(filteredRides.length / state.limit));

  useEffect(() => {
    if (state.page > totalPage) {
      setState((previous) => ({ ...previous, page: totalPage }));
    }
  }, [setState, state.page, totalPage]);

  const paginatedRides = useMemo(() => {
    const startIndex = (state.page - 1) * state.limit;
    return filteredRides.slice(startIndex, startIndex + state.limit);
  }, [filteredRides, state.limit, state.page]);

  const handleReset = () => {
    resetFilters();
    setFareRange({ min: "", max: "" });
  };

  return (
    <div className="space-y-4">
      <ListFilterBar
        searchPlaceholder="Search by ride ID or date"
        searchTerm={state.searchTerm}
        onSearchChange={(value) =>
          setState((previous) => ({ ...previous, page: 1, searchTerm: value }))
        }
        dateSearch={state.dateSearch}
        onDateSearchChange={(value) =>
          setState((previous) => ({ ...previous, page: 1, dateSearch: value }))
        }
        statusValue="COMPLETED"
        onStatusChange={() => null}
        statusOptions={COMPLETED_STATUS_OPTIONS}
        onReset={handleReset}
      >
        <FareRangeInputs value={fareRange} onChange={setFareRange} />
      </ListFilterBar>

      <Card>
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataStateView
            isLoading={isLoading}
            hasData={paginatedRides.length > 0}
            emptyMessage="No completed rides found."
          >
            <PaginatedDataTable
              currentPage={state.page}
              totalPage={totalPage}
              onPageChange={(page) => setState((previous) => ({ ...previous, page }))}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRides.map((ride) => (
                    <TableRow key={ride._id}>
                      <TableCell className="font-mono text-xs">{ride._id}</TableCell>
                      <TableCell>{formatDateTime(ride.timestamps?.completedAt)}</TableCell>
                      <TableCell>{formatCurrencyBDT(ride.fare)}</TableCell>
                      <TableCell>
                        <StatusBadge status="COMPLETED" />
                      </TableCell>
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
