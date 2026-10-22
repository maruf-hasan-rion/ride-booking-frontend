import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { EmergencySOSButton } from "@/components/shared/safety/EmergencySOSButton";
import config from "@/config";
import {
  configureLeafletDefaultMarker,
  destinationMarkerIcon,
  driverMarkerIcon,
} from "@/lib/leaflet";
import {
  useCancelRideMutation,
  useGetLatestRideQuery,
  useGetMyRideQuery,
  useRideRequestMutation,
} from "@/redux/features/ride/ride.api";
import { useToastAction } from "@/hooks/useToastAction";
import type { RideStatus } from "@/types/domain";
import {
  RIDER_CANCELLABLE_STATUSES,
  RIDER_ACTIVE_RIDE_STATUSES,
  coordinatesEqual,
  getCoordinates,
  getDriverDetails,
  type RideGeoPoint,
} from "@/types/ride";
import { OSM_TILE_URL } from "@/constants/urls";
import { extractData } from "@/utils/apiResponse";
import { formatCurrencyBDT } from "@/utils/formatters";
import { fetchDrivingRoutePolyline } from "@/utils/mapRoute";
import { POLL_INTERVALS } from "@/constants/polling";

type Coordinate = [number, number];

type RideGeo = {
  coordinates?: number[];
};

type RideEntity = {
  _id: string;
  status?: RideStatus;
  fare?: number;
  distance?: number;
  pickupLocation?: RideGeo;
  destination?: RideGeo;
  currentLocation?: RideGeo;
  driverId?: Record<string, unknown> | string;
};

const calculateFare = (distanceKm: number, baseFarePerKm = 100) =>
  Number((distanceKm * baseFarePerKm).toFixed(2));

const calculateStraightDistanceKm = (from: Coordinate, to: Coordinate) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const latDistance = toRadians(to[0] - from[0]);
  const lngDistance = toRadians(to[1] - from[1]);
  const fromLatRadians = toRadians(from[0]);
  const toLatRadians = toRadians(to[0]);

  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(fromLatRadians) *
      Math.cos(toLatRadians) *
      Math.sin(lngDistance / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
};

const canCancelRide = (status?: RideStatus) =>
  Boolean(status && RIDER_CANCELLABLE_STATUSES.includes(status));

const createIdempotencyKey = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatCoordinate = (coordinate: Coordinate | null) => {
  if (!coordinate) return "";
  return `${coordinate[0].toFixed(5)}, ${coordinate[1].toFixed(5)}`;
};

function DestinationPicker({
  locked,
  onSelect,
}: {
  locked: boolean;
  onSelect: (coordinate: Coordinate) => void;
}) {
  useMapEvents({
    click(event) {
      if (locked) return;
      onSelect([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function LocationField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} readOnly placeholder="Waiting for map selection" />
    </div>
  );
}

export default function RideRequest() {
  const navigate = useNavigate();
  const runAction = useToastAction();

  const [pickup, setPickup] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [fare, setFare] = useState<number>(0);

  const [requestRide, { isLoading: isRequestingRide }] = useRideRequestMutation();
  const [cancelRide, { isLoading: isCancellingRide }] = useCancelRideMutation();
  const idempotencyKeyRef = useRef(createIdempotencyKey());
  const resetIdempotencyKey = useCallback(() => {
    idempotencyKeyRef.current = createIdempotencyKey();
  }, []);

  const { data: latestRideResponse, isFetching: isLoadingLatestRide, refetch } =
    useGetLatestRideQuery(undefined, {
      pollingInterval: POLL_INTERVALS.RIDE_STATUS,
    });

  const latestRide = extractData<RideEntity | null>(latestRideResponse);
  const latestRideId = latestRide?._id;

  const { data: latestRideDetailsResponse } = useGetMyRideQuery(latestRideId ?? "", {
    skip: !latestRideId,
    pollingInterval: POLL_INTERVALS.RIDE_STATUS,
  });

  const latestRideDetails = extractData<RideEntity>(latestRideDetailsResponse);
  const currentRide = latestRideDetails || latestRide || null;
  const rideStatus = currentRide?.status;
  const hasActiveRide = Boolean(rideStatus && RIDER_ACTIVE_RIDE_STATUSES.includes(rideStatus));

  const driverInfo = useMemo(() => {
    const details = getDriverDetails(currentRide ?? null);

    return {
      name: details.name || "Driver not assigned yet",
      phone: details.contactNo || "N/A",
      vehicle: details.vehicle || "N/A",
    };
  }, [currentRide]);

  useEffect(() => {
    configureLeafletDefaultMarker();
  }, []);

  useEffect(() => {
    if (!currentRide) return;

    const ridePickup = getCoordinates(currentRide.pickupLocation as RideGeoPoint | null);
    const rideDestination = getCoordinates(currentRide.destination as RideGeoPoint | null);
    const liveLocation = getCoordinates(currentRide.currentLocation as RideGeoPoint | null);

    if (ridePickup) {
      setPickup((previous) =>
        coordinatesEqual(previous, ridePickup) ? previous : ridePickup,
      );
    }
    if (rideDestination) {
      setDestination((previous) =>
        coordinatesEqual(previous, rideDestination)
          ? previous
          : rideDestination,
      );
    }
    if (liveLocation) {
      setCurrentLocation((previous) =>
        coordinatesEqual(previous, liveLocation) ? previous : liveLocation,
      );
    }

    if (typeof currentRide.distance === "number") {
      setDistanceKm(Number(currentRide.distance.toFixed(2)));
    }

    if (typeof currentRide.fare === "number") {
      setFare(currentRide.fare);
    }
  }, [currentRide]);

  const syncCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinate: Coordinate = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setPickup(coordinate);
        setCurrentLocation(coordinate);
        resetIdempotencyKey();
      },
      () => {
        toast.error("Unable to access your current location.");
      }
    );
  }, [resetIdempotencyKey]);

  useEffect(() => {
    if (!hasActiveRide && !pickup) {
      syncCurrentLocation();
    }
  }, [hasActiveRide, pickup, syncCurrentLocation]);

  useEffect(() => {
    const controller = new AbortController();

    const resolveRoute = async () => {
      if (!pickup || !destination) {
        setRouteCoordinates([]);
        return;
      }

      const routeResult = await fetchDrivingRoutePolyline({
        pickup,
        destination,
        orsApiKey: config.orsApiKey,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      setRouteCoordinates(routeResult.coordinates);

      if (!hasActiveRide) {
        const nextDistance =
          routeResult.distanceKm ?? calculateStraightDistanceKm(pickup, destination);
        setDistanceKm(nextDistance);
        setFare(calculateFare(nextDistance));
      }
    };

    void resolveRoute();

    return () => controller.abort();
  }, [pickup, destination, hasActiveRide]);

  const bookRide = async () => {
    if (!pickup || !destination || !currentLocation) {
      toast.error("Pickup and destination are required.");
      return;
    }

    if (hasActiveRide) {
      toast.error("You already have an active ride.");
      return;
    }

    const isSameLocation =
      Math.abs(pickup[0] - destination[0]) < 0.0001 &&
      Math.abs(pickup[1] - destination[1]) < 0.0001;

    if (isSameLocation) {
      toast.error("Pickup and destination cannot be the same.");
      return;
    }

    if (distanceKm <= 0 || fare <= 0) {
      toast.error("Unable to estimate fare. Please choose a valid destination.");
      return;
    }

    const result = await runAction(
      () =>
        requestRide({
          idempotencyKey: idempotencyKeyRef.current,
          pickupLocation: {
            type: "Point",
            coordinates: [pickup[1], pickup[0]],
          },
          destination: {
            type: "Point",
            coordinates: [destination[1], destination[0]],
          },
          currentLocation: {
            type: "Point",
            coordinates: [currentLocation[1], currentLocation[0]],
          },
        }).unwrap(),
      {
        success: "Ride requested successfully. Please wait for a driver.",
        fallback: "Failed to request ride.",
      },
    );

    if (result) {
      resetIdempotencyKey();
      refetch();
    }
  };

  const handleCancelRide = async () => {
    if (!currentRide?._id) return;

    const result = await runAction(() => cancelRide(currentRide._id).unwrap(), {
      success: "Ride cancelled successfully.",
      fallback: "Failed to cancel ride.",
    });

    if (result) {
      refetch();
      setDestination(null);
      setRouteCoordinates([]);
    }
  };

  if (isRequestingRide && !hasActiveRide) {
    return (
      <DataStateView
        isLoading
        hasData={false}
        emptyMessage="Something went wrong loading the booking screen."
      />
    );
  }

  const mapCenter = pickup || destination || [23.8103, 90.4125];
  const driverLocation = getCoordinates(currentRide?.currentLocation as RideGeoPoint | null);

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Ride Map</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tap on the map to set destination. Pickup is your current location.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[340px] w-full overflow-hidden rounded-lg border md:h-[420px]">
              <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
                <TileLayer
                  url={OSM_TILE_URL}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {pickup ? <Marker position={pickup} /> : null}
                {destination ? (
                  <Marker position={destination} icon={destinationMarkerIcon} />
                ) : null}
                {driverLocation && hasActiveRide ? (
                  <Marker position={driverLocation} icon={driverMarkerIcon} />
                ) : null}
                {routeCoordinates.length > 0 ? (
                  <Polyline positions={routeCoordinates} color="var(--primary)" weight={4} />
                ) : null}
                <DestinationPicker
                  locked={hasActiveRide}
                  onSelect={(coordinate) => {
                    resetIdempotencyKey();
                    setDestination(coordinate);
                  }}
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ride Request Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationField
                label="Pickup Coordinates"
                value={formatCoordinate(pickup)}
              />
              <LocationField
                label="Destination Coordinates"
                value={formatCoordinate(destination)}
              />

              <Button variant="outline" className="w-full" onClick={syncCurrentLocation}>
                Use Current Location
              </Button>

              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <p className="font-medium text-foreground">Fare Estimation</p>
                <p className="text-muted-foreground">
                  Distance: {distanceKm.toFixed(2)} km
                </p>
                <p className="text-muted-foreground">
                  Estimated Fare: {formatCurrencyBDT(fare)}
                </p>
                <p className="text-muted-xs text-muted-foreground">
                  Fares cover the road trip only; payment is settled in cash on
                  completion.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={bookRide}
                disabled={hasActiveRide || !pickup || !destination || isRequestingRide}
              >
                {isRequestingRide ? "Requesting..." : "Request Ride"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Ride Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {hasActiveRide ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Current Status</span>
                    <StatusBadge status={rideStatus || "REQUESTED"} />
                  </div>
                  <div className="rounded-lg border p-3 space-y-2">
                    <p>
                      <span className="font-medium">Driver:</span> {driverInfo.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {driverInfo.phone}
                    </p>
                    <p>
                      <span className="font-medium">Vehicle:</span> {driverInfo.vehicle}
                    </p>
                    <p>
                      <span className="font-medium">Fare:</span> {formatCurrencyBDT(currentRide?.fare)}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/my-ride/${currentRide?._id}`)}
                  >
                    View Ride Details
                  </Button>

                  {canCancelRide(rideStatus) ? (
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={handleCancelRide}
                      disabled={isCancellingRide}
                    >
                      {isCancellingRide ? "Cancelling..." : "Cancel Ride"}
                    </Button>
                  ) : null}
                </>
              ) : (
                <p className="text-muted-foreground">
                  No active ride now. Request a ride to start live tracking.
                </p>
              )}

              {isLoadingLatestRide ? (
                <p className="text-xs text-muted-foreground">Checking latest ride updates...</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <EmergencySOSButton isActiveRide={hasActiveRide} role="RIDER" />
    </>
  );
}

