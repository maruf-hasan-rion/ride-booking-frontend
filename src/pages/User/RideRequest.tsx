import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
  description,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  value: Coordinate | null;
  onChange: (coordinate: Coordinate) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [latitude, setLatitude] = useState(value ? value[0].toFixed(6) : "");
  const [longitude, setLongitude] = useState(value ? value[1].toFixed(6) : "");

  useEffect(() => {
    setLatitude(value ? value[0].toFixed(6) : "");
    setLongitude(value ? value[1].toFixed(6) : "");
  }, [value]);

  const applyCoordinate = () => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      toast.error("Enter a valid latitude (-90 to 90) and longitude (-180 to 180).");
      return;
    }

    onChange([lat, lng]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={`${id}-lat`}>Latitude</Label>
          <Input
            id={`${id}-lat`}
            inputMode="decimal"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyCoordinate();
              }
            }}
            placeholder="23.8103"
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${id}-lng`}>Longitude</Label>
          <Input
            id={`${id}-lng`}
            inputMode="decimal"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyCoordinate();
              }
            }}
            placeholder="90.4125"
            disabled={disabled}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={applyCoordinate}
        disabled={disabled || !latitude.trim() || !longitude.trim()}
      >
        Apply {label}
      </Button>
    </fieldset>
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
  const [locationError, setLocationError] = useState<string | null>(null);

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
      const message = "Geolocation is not supported. Enter pickup coordinates manually.";
      setLocationError(message);
      toast.error(message);
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
        setLocationError(null);
        resetIdempotencyKey();
      },
      () => {
        const message =
          "Location permission denied or unavailable. Enter pickup coordinates manually.";
        setLocationError(message);
        toast.error(message);
      }
    );
  }, [resetIdempotencyKey]);

  useEffect(() => {
    if (!hasActiveRide && !pickup) {
      syncCurrentLocation();
    }
  }, [hasActiveRide, pickup, syncCurrentLocation]);

  useEffect(() => {
    if (!pickup || !destination) {
      setRouteCoordinates([]);
      return;
    }

    // No client-side ORS call: the key must never ship in the bundle. The
    // straight line is only a visual preview; the server computes the road fare.
    setRouteCoordinates([pickup, destination]);

    if (!hasActiveRide) {
      const nextDistance = calculateStraightDistanceKm(pickup, destination);
      setDistanceKm(nextDistance);
      setFare(calculateFare(nextDistance));
    }
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
              Click the map to set destination, or enter coordinates in the form.
              Pickup auto-fills from geolocation when available.
            </p>
          </CardHeader>
          <CardContent>
            <div
              className="h-[340px] w-full overflow-hidden rounded-lg border md:h-[420px]"
              role="region"
              aria-label="Ride map preview. Use the coordinate fields in the form for keyboard input."
            >
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
                description="Auto-filled from geolocation, or enter latitude and longitude manually."
                value={pickup}
                disabled={hasActiveRide}
                onChange={(coordinate) => {
                  setPickup(coordinate);
                  setCurrentLocation(coordinate);
                  setLocationError(null);
                  resetIdempotencyKey();
                }}
              />
              <LocationField
                label="Destination Coordinates"
                description="Click the map or enter latitude and longitude manually."
                value={destination}
                disabled={hasActiveRide}
                onChange={(coordinate) => {
                  setDestination(coordinate);
                  resetIdempotencyKey();
                }}
              />

              {locationError ? (
                <p role="status" aria-live="polite" className="text-sm text-destructive">
                  {locationError}
                </p>
              ) : null}

              <Button variant="outline" className="w-full" onClick={syncCurrentLocation}>
                Use Current Location (optional)
              </Button>

              <div className="rounded-lg border bg-muted/40 p-3 text-sm" aria-live="polite">
                <p className="font-medium text-foreground">Fare Estimation</p>
                <p className="text-muted-foreground">
                  Distance: {distanceKm.toFixed(2)} km
                </p>
                <p className="text-muted-foreground">
                  Estimated Fare: {formatCurrencyBDT(fare)}
                </p>
                <p className="text-muted-xs text-muted-foreground">
                  Preview uses a direct line; the server calculates the final road
                  fare. Payment is settled in cash on completion.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={bookRide}
                disabled={
                  hasActiveRide ||
                  !pickup ||
                  !destination ||
                  !currentLocation ||
                  isRequestingRide
                }
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

