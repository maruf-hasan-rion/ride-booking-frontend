import type { RideStatus } from "@/types/domain";

/** Geo shapes shared by booking, tracking and history screens. */
export type RideGeoPoint = {
  type?: "Point";
  coordinates: number[];
};

export type RideTimestamps = {
  requestedAt?: string | null;
  acceptedAt?: string | null;
  pickedUpAt?: string | null;
  startedAt?: string | null;
  arrivedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
};

export interface RideDriverDetails {
  name: string;
  contactNo: string;
  vehicle: string;
}

/** The rider may cancel while waiting for pickup (before the ride starts). */
export const RIDER_CANCELLABLE_STATUSES: RideStatus[] = [
  "REQUESTED",
  "ACCEPTED",
];

/** The rider still has a live ride while it is pending or running. */
export const RIDER_ACTIVE_RIDE_STATUSES: RideStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED",
];

/** A driver's ride stays live from acceptance until completion. */
export const DRIVER_ACTIVE_RIDE_STATUSES: RideStatus[] = [
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED",
];

/** Builds driver details from a ride, tolerating both populated objects and
 * raw ids so cards never crash on a partially loaded poll response. The
 * backend now stores vehicle info as a free-text string on the driver
 * profile; older nested `vehicle: { vehicleType, vehicleNumber }` shapes are
 * still honoured while data migrates. */
export const getDriverDetails = (
  ride?: null | { driverId?: unknown },
): RideDriverDetails => {
  const driver = ride?.driverId;
  if (!driver || typeof driver !== "object") {
    return { name: "", contactNo: "", vehicle: "" };
  }
  const driverRecord = driver as Record<string, unknown>;

  const user = (driverRecord.user ?? null) as Record<string, unknown> | null;
  const legacyVehicle = (driverRecord.vehicle ??
    null) as Record<string, unknown> | null;

  const legacyVehicleText = legacyVehicle
    ? [legacyVehicle.vehicleType, legacyVehicle.vehicleNumber]
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        .join(" | ")
    : "";

  const vehicle =
    (typeof driverRecord.vehicleInfo === "string" && driverRecord.vehicleInfo) ||
    legacyVehicleText;

  return {
    name: typeof user?.name === "string" ? user.name : "",
    contactNo: typeof user?.contactNo === "string" ? user.contactNo : "",
    vehicle: vehicle || "",
  };
};

/** Reads [lat, lng] from a GeoJSON point; null when malformed. */
export const getCoordinates = (
  location?: RideGeoPoint | null,
): [number, number] | null => {
  const coordinates = location?.coordinates;
  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    coordinates.every((value) => typeof value === "number")
  ) {
    return [coordinates[1] as number, coordinates[0] as number];
  }
  return null;
};

/** Value equality for Leaflet coordinates, so polling does not recreate
 * dependencies (and therefore does not re-run route requests) unnecessarily. */
export const coordinatesEqual = (
  left?: [number, number] | null,
  right?: [number, number] | null,
): boolean =>
  Boolean(
    left &&
      right &&
      left[0] === right[0] &&
      left[1] === right[1],
  );
