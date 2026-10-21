import { RIDE_STATUS_VALUES } from "@/types/domain";

/** Humanized ride statuses for badges, tables and filters (single source so
 * future wording changes are one edit). */
export const humanizeStatus = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export const RIDE_STATUS_FILTER_OPTIONS = [
  { label: "All", value: "" },
  ...RIDE_STATUS_VALUES.map((value) => ({ label: humanizeStatus(value), value })),
];
