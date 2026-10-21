/** Polling intervals in ms, centralized so the API cadence is a decision,
 * not a per-page accident. */
export const POLL_INTERVALS = {
  /** Admin single-ride detail (keeps oversight in step with live updates). */
  ADMIN_RIDE_DETAIL: 3000,
  /** Rider/driver status tracking and driver incoming requests. */
  RIDE_STATUS: 5000,
  /** Driver earnings / admin analytics dashboards. */
  REPORTS: 15000,
} as const;
