const numberFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  dateStyle: "medium",
  timeStyle: "short",
});

type GeoLocation = {
  coordinates?: number[] | null;
};

export const formatCurrencyBDT = (amount?: number | null) => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "BDT N/A";
  }

  return `BDT ${numberFormatter.format(amount)}`;
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "N/A";

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "N/A";

  return dateTimeFormatter.format(date);
};

export const formatGeoCoordinates = (
  location?: GeoLocation | null,
  options: { precision?: number; withLabel?: boolean } = {}
) => {
  const coordinates = location?.coordinates;
  if (!coordinates || coordinates.length < 2) return "N/A";

  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "N/A";

  const precision = options.precision ?? 5;
  const value = `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
  return options.withLabel ? `Lat/Lng: ${value}` : value;
};
