export const ROLE_VALUES = ["SUPER_ADMIN", "ADMIN", "RIDER", "DRIVER"] as const;
export type Role = (typeof ROLE_VALUES)[number];

export const ACCOUNT_STATUS_VALUES = ["ACTIVE", "BLOCKED", "SUSPENDED"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUS_VALUES)[number];

export const RIDE_STATUS_VALUES = [
  "REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED",
  "COMPLETED",
  "CANCELLED",
] as const;
export type RideStatus = (typeof RIDE_STATUS_VALUES)[number];

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type PaginatedData<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export type AppQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  dateSearch?: string;
  driverSearch?: string;
  riderSearch?: string;
  rideStatus?: RideStatus | "";
  status?: RideStatus | "";
};
