import { describe, expect, it } from "vitest";
import {
  DRIVER_ACTIVE_RIDE_STATUSES,
  RIDER_ACTIVE_RIDE_STATUSES,
  coordinatesEqual,
  getCoordinates,
  getDriverDetails,
} from "./ride";

describe("getCoordinates", () => {
  it("converts GeoJSON [lng, lat] into leaflet [lat, lng]", () => {
    expect(getCoordinates({ coordinates: [90.4244, 23.7806] })).toEqual([
      23.7806, 90.4244,
    ]);
  });

  it("returns null for malformed or missing coordinates", () => {
    expect(getCoordinates(null)).toBeNull();
    expect(getCoordinates({ coordinates: [90] })).toBeNull();
    expect(getCoordinates({ coordinates: ["x", "y"] as never })).toBeNull();
  });
});

describe("coordinatesEqual", () => {
  it("compares coordinates by value, not array identity", () => {
    expect(coordinatesEqual([23.78, 90.42], [23.78, 90.42])).toBe(true);
    expect(coordinatesEqual([23.78, 90.42], [23.79, 90.42])).toBe(false);
  });

  it("treats missing coordinates as unequal", () => {
    expect(coordinatesEqual(null, [23.78, 90.42])).toBe(false);
    expect(coordinatesEqual([23.78, 90.42], null)).toBe(false);
    expect(coordinatesEqual(null, null)).toBe(false);
  });
});

describe("getDriverDetails", () => {
  it("reads the vehicleInfo string the backend stores today", () => {
    const details = getDriverDetails({
      driverId: {
        vehicleInfo: "Toyota Axio, silver",
        user: { name: "Karim", contactNo: "+8801700000000" },
      },
    });

    expect(details).toEqual({
      name: "Karim",
      contactNo: "+8801700000000",
      vehicle: "Toyota Axio, silver",
    });
  });

  it("still understands the legacy nested vehicle object", () => {
    const details = getDriverDetails({
      driverId: {
        vehicle: { vehicleType: "SUV", vehicleNumber: "D-2233" },
        user: { name: "Karim" },
      },
    });

    expect(details.vehicle).toBe("SUV | D-2233");
  });

  it("falls back to blanks when the ride has no driver yet", () => {
    expect(getDriverDetails({ driverId: "abc" })).toEqual({
      name: "",
      contactNo: "",
      vehicle: "",
    });

    expect(getDriverDetails(null)).toEqual({ name: "", contactNo: "", vehicle: "" });
  });
});

describe("active ride semantics", () => {
  it("rider keeps a live ride while waiting or moving", () => {
    expect(RIDER_ACTIVE_RIDE_STATUSES).toContain("REQUESTED");
    expect(RIDER_ACTIVE_RIDE_STATUSES).toContain("ACCEPTED");
    expect(RIDER_ACTIVE_RIDE_STATUSES).not.toContain("COMPLETED");
  });

  it("driver rides live from acceptance to completion", () => {
    expect(DRIVER_ACTIVE_RIDE_STATUSES).not.toContain("REQUESTED");
    expect(DRIVER_ACTIVE_RIDE_STATUSES).toContain("ARRIVED");
    expect(DRIVER_ACTIVE_RIDE_STATUSES).not.toContain("CANCELLED");
  });
});
