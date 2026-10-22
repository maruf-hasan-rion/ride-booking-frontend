import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POLL_INTERVALS } from "@/constants/polling";
import { OSM_TILE_URL } from "@/constants/urls";
import {
  useAdminCancelRideMutation,
  useSingleRideForAdminQuery,
} from "@/redux/features/ride/ride.api";
import { useToastAction } from "@/hooks/useToastAction";
import {
  DRIVER_ACTIVE_RIDE_STATUSES,
  getDriverDetails,
  type RideGeoPoint,
  type RideTimestamps,
} from "@/types/ride";
import type { RideStatus } from "@/types/domain";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { configureLeafletDefaultMarker } from "@/lib/leaflet";
import { extractData, getApiErrorMessage } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";
import { fetchDrivingRoutePolyline } from "@/utils/mapRoute";
import config from "@/config";

type Coordinate = [number, number];

type AdminRideDetails = {
  _id: string;
  status?: RideStatus;
  fare?: number;
  distance?: number;
  riderId?: { name?: string; email?: string; contactNo?: string } | string;
  driverId?: Record<string, unknown> | string;
  pickupLocation?: RideGeoPoint;
  destination?: RideGeoPoint;
  currentLocation?: RideGeoPoint;
  createdAt?: string;
  updatedAt?: string;
  timestamps?: RideTimestamps;
};

export default function RideDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: rideResponse, isLoading, error, refetch } =
    useSingleRideForAdminQuery(id ?? "", {
      skip: !id,
      pollingInterval: POLL_INTERVALS.ADMIN_RIDE_DETAIL,
    });
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [adminCancelRide, { isLoading: isCancellingRide }] =
    useAdminCancelRideMutation();
  const runAction = useToastAction();

  const ride = extractData<AdminRideDetails>(rideResponse);

  useEffect(() => {
    configureLeafletDefaultMarker();
  }, []);

  const pickupLng = ride?.pickupLocation?.coordinates?.[0];
  const pickupLat = ride?.pickupLocation?.coordinates?.[1];
  const destinationLng = ride?.destination?.coordinates?.[0];
  const destinationLat = ride?.destination?.coordinates?.[1];

  const pickup = useMemo<Coordinate | null>(() => {
    if (typeof pickupLng !== "number" || typeof pickupLat !== "number") {
      return null;
    }
    return [pickupLat, pickupLng];
  }, [pickupLng, pickupLat]);

  const destination = useMemo<Coordinate | null>(() => {
    if (
      typeof destinationLng !== "number" ||
      typeof destinationLat !== "number"
    ) {
      return null;
    }
    return [destinationLat, destinationLng];
  }, [destinationLng, destinationLat]);

  useEffect(() => {
    const controller = new AbortController();

    const resolveRoute = async () => {
      if (!pickup || !destination) {
        setRouteCoords([]);
        return;
      }

      const route = await fetchDrivingRoutePolyline({
        pickup,
        destination,
        orsApiKey: config.orsApiKey,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setRouteCoords(route.coordinates);
      }
    };

    void resolveRoute();

    return () => controller.abort();
  }, [pickup, destination]);

  const driverInfo = useMemo(() => {
    const details = getDriverDetails(ride ?? null);
    return details.vehicle || "Unavailable";
  }, [ride]);

  const handleAdminCancel = async () => {
    if (!ride) return;

    const reason = cancelReason.trim();
    if (reason.length < 3) {
      toast.error("Please enter a cancellation reason (at least 3 characters).");
      return;
    }

    const result = await runAction(
      () => adminCancelRide({ rideId: ride._id, reason }).unwrap(),
      {
        success: "Ride cancelled successfully.",
        fallback: "Failed to cancel ride.",
      },
    );

    if (result) {
      setCancelReason("");
      void refetch();
    }
  };

  const isTerminalRide =
    ride?.status === "COMPLETED" || ride?.status === "CANCELLED";

  if (!pickup || !destination) {
    return (
      <DataStateView
        isLoading={isLoading}
        hasData={false}
        errorMessage={
          error
            ? getApiErrorMessage(error, "Failed to load ride details.")
            : undefined
        }
        onRetry={() => void refetch()}
        emptyMessage="Ride not found."
      />
    );
  }

  const mapCenter: Coordinate = pickup;
  const isActiveRide = Boolean(
    ride?.status && DRIVER_ACTIVE_RIDE_STATUSES.includes(ride.status)
  );

  return (
    <DataStateView
      isLoading={isLoading}
      hasData
      errorMessage={
        error
          ? getApiErrorMessage(error, "Failed to load ride details.")
          : undefined
      }
      onRetry={() => void refetch()}
      emptyMessage="Ride not found."
    >
      <section className="section-shell py-6">
        <div className="mb-4 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Ride Details</h1>
          <p className="text-sm text-muted-foreground">
            Oversight view for a single ride: route, timing and assignment.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row text-left">
          <div className="flex-1 space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={ride?.status || "REQUESTED"} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <span className="text-muted-foreground">Distance</span>
                <span>{ride?.distance?.toFixed(2) ?? "N/A"} km</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <span className="text-muted-foreground">Fare</span>
                <span>{formatCurrencyBDT(ride?.fare)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <span className="text-muted-foreground">Driver</span>
                <span>{driverInfo}</span>
              </div>
            </div>

            <div>
              <p className="font-medium">Timeline</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <span className="text-muted-foreground">Requested:</span>{" "}
                  {formatDateTime(ride?.timestamps?.requestedAt || ride?.createdAt)}
                </li>
                <li>
                  <span className="text-muted-foreground">Accepted:</span>{" "}
                  {formatDateTime(ride?.timestamps?.acceptedAt)}
                </li>
                <li>
                  <span className="text-muted-foreground">Picked up:</span>{" "}
                  {formatDateTime(ride?.timestamps?.pickedUpAt)}
                </li>
                <li>
                  <span className="text-muted-foreground">Started:</span>{" "}
                  {formatDateTime(ride?.timestamps?.startedAt)}
                </li>
                <li>
                  <span className="text-muted-foreground">Completed:</span>{" "}
                  {formatDateTime(ride?.timestamps?.completedAt)}
                </li>
              </ul>
            </div>

            {!isTerminalRide ? (
              <div className="space-y-3 rounded-lg border border-destructive/30 p-4">
                <div>
                  <p className="font-medium text-destructive">Admin intervention</p>
                  <p className="text-xs text-muted-foreground">
                    Cancel a stuck or unsafe ride. This releases the rider and
                    the driver's active-ride lock.
                  </p>
                </div>
                <Input
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                  placeholder="Cancellation reason (required)"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void handleAdminCancel()}
                  disabled={isCancellingRide}
                >
                  {isCancellingRide ? "Cancelling..." : "Cancel Ride"}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex-1">
            <div className="h-[300px] overflow-hidden rounded-lg border md:h-[420px]">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer url={OSM_TILE_URL} />
                <Marker position={pickup} />
                <Marker position={destination} />
                {routeCoords.length > 0 ? (
                  <Polyline positions={routeCoords} color="var(--primary)" weight={4} />
                ) : null}
              </MapContainer>
            </div>
            {isActiveRide ? (
              <p className="mt-2 text-xs text-muted-foreground">
                This ride is currently in progress and refreshes every few seconds.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </DataStateView>
  );
}
