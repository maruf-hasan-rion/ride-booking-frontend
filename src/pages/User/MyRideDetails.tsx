import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { RideStatusTimeline } from "@/components/modules/User/RideStatusTimeline";
import { EmergencySOSButton } from "@/components/shared/safety/EmergencySOSButton";
import { configureLeafletDefaultMarker, destinationMarkerIcon, driverMarkerIcon } from "@/lib/leaflet";
import { useGetMyRideQuery } from "@/redux/features/ride/ride.api";
import { POLL_INTERVALS } from "@/constants/polling";
import { OSM_TILE_URL } from "@/constants/urls";
import {
  RIDER_ACTIVE_RIDE_STATUSES,
  getCoordinates,
  getDriverDetails,
  type RideGeoPoint,
  type RideTimestamps,
} from "@/types/ride";
import type { RideStatus } from "@/types/domain";
import { extractData } from "@/utils/apiResponse";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";
import { fetchDrivingRoutePolyline } from "@/utils/mapRoute";
import config from "@/config";

type Coordinate = [number, number];

type RideDetailsEntity = {
  _id: string;
  status?: RideStatus;
  fare?: number;
  distance?: number;
  pickupLocation?: RideGeoPoint;
  destination?: RideGeoPoint;
  currentLocation?: RideGeoPoint;
  createdAt?: string;
  updatedAt?: string;
  timestamps?: RideTimestamps;
  driverId?: Record<string, unknown> | string;
};

export default function MyRideDetails() {
  const { rideId } = useParams<{ rideId: string }>();
  const { data: rideResponse, isLoading } = useGetMyRideQuery(rideId ?? "", {
    skip: !rideId,
    pollingInterval: POLL_INTERVALS.RIDE_STATUS,
  });

  const ride = extractData<RideDetailsEntity>(rideResponse);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);

  useEffect(() => {
    configureLeafletDefaultMarker();
  }, []);

  const pickup = getCoordinates(ride?.pickupLocation);
  const destination = getCoordinates(ride?.destination);
  const driverLocation = getCoordinates(ride?.currentLocation);

  useEffect(() => {
    const resolveRoute = async () => {
      if (!pickup || !destination) {
        setRouteCoordinates([]);
        return;
      }

      const route = await fetchDrivingRoutePolyline({
        pickup,
        destination,
        orsApiKey: config.orsApiKey,
      });

      setRouteCoordinates(route.coordinates);
    };

    resolveRoute();
  }, [pickup, destination]);

  const driverInfo = useMemo(() => {
    const details = getDriverDetails(ride ?? null);

    return {
      name: details.name || "Driver not assigned yet",
      phone: details.contactNo || "N/A",
      vehicle: details.vehicle || "N/A",
    };
  }, [ride]);

  if (!ride || !pickup || !destination) {
    return (
      <DataStateView
        isLoading={isLoading}
        hasData={false}
        emptyMessage="Ride details are not available."
      />
    );
  }

  const mapCenter: Coordinate = driverLocation || pickup;
  const hasActiveRide = Boolean(
    ride?.status && RIDER_ACTIVE_RIDE_STATUSES.includes(ride.status)
  );

  return (
    <DataStateView
      isLoading={isLoading}
      hasData
      emptyMessage="Ride details are not available."
    >
      <section className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-4 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Ride Details</h1>
          <p className="text-sm text-muted-foreground">
            Track ride progress, route, driver details, and timeline updates.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Ride Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full overflow-hidden rounded-lg border md:h-[420px]">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer url={OSM_TILE_URL} />
                  <Marker position={pickup} />
                  <Marker position={destination} icon={destinationMarkerIcon} />
                  {driverLocation ? (
                    <Marker position={driverLocation} icon={driverMarkerIcon} />
                  ) : null}
                  {routeCoordinates.length > 0 ? (
                    <Polyline
                      positions={routeCoordinates}
                      color="var(--primary)"
                      weight={4}
                    />
                  ) : null}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ride Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={ride.status || "REQUESTED"} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Distance</span>
                  <span>{ride.distance?.toFixed(2) ?? "N/A"} km</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Fare</span>
                  <span>{formatCurrencyBDT(ride.fare)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Requested At</span>
                  <span>{formatDateTime(ride.timestamps?.requestedAt || ride.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDateTime(ride.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {driverInfo.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {driverInfo.phone}
                </p>
                <p>
                  <span className="font-medium">Vehicle:</span> {driverInfo.vehicle}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ride Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <RideStatusTimeline status={ride.status} timestamps={ride.timestamps} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <EmergencySOSButton isActiveRide={hasActiveRide} role="RIDER" />
    </DataStateView>
  );
}
