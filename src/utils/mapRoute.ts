import axios from "axios";

type Coordinate = [number, number];

type RouteRequestParams = {
  pickup: Coordinate;
  destination: Coordinate;
  orsApiKey?: string;
};

export type RouteResult = {
  coordinates: Coordinate[];
  distanceKm: number | null;
};

export const fetchDrivingRoutePolyline = async ({
  pickup,
  destination,
  orsApiKey,
}: RouteRequestParams): Promise<RouteResult> => {
  if (!orsApiKey) return { coordinates: [], distanceKm: null };

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [pickup[1], pickup[0]],
          [destination[1], destination[0]],
        ],
      },
      {
        headers: {
          Authorization: orsApiKey,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const routeCoordinates = response.data?.features?.[0]?.geometry?.coordinates;
    const distanceMeters = response.data?.features?.[0]?.properties?.summary?.distance;
    if (!Array.isArray(routeCoordinates)) {
      return { coordinates: [], distanceKm: null };
    }

    const coordinates = routeCoordinates
      .map((coordinate: unknown) =>
        Array.isArray(coordinate) && coordinate.length >= 2
          ? [Number(coordinate[1]), Number(coordinate[0])]
          : null
      )
      .filter(
        (coordinate): coordinate is Coordinate =>
          Array.isArray(coordinate) &&
          coordinate.length === 2 &&
          Number.isFinite(coordinate[0]) &&
          Number.isFinite(coordinate[1])
      );

    const distanceKm = Number.isFinite(distanceMeters)
      ? Number((Number(distanceMeters) / 1000).toFixed(2))
      : null;

    return { coordinates, distanceKm };
  } catch {
    return { coordinates: [], distanceKm: null };
  }
};
