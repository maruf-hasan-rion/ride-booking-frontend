/** External endpoints and urls used by more than one module. */

export const ORS_ROUTE_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

export const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

/** The Google OAuth entrypoint sits at the API root, NOT under /api/v1. */
export const GOOGLE_LOGIN_PATH = "/auth/google";

/** Brand hex used by logo SVGs while CSS tokens carry the rest. */
export const BRAND_HEX = "#17CF97";
