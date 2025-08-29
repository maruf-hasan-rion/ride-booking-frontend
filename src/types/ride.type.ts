// import type { ComponentType } from "react";

import type { TRole } from ".";

export type IRideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_driver_found";

export interface IRideRequest {
  pickupLocation: { latitude: number; longitude: number };
  dropOffLocation: { latitude: number; longitude: number };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: TRole;
  isBlocked: boolean;
  isVerified?: boolean;
}

export interface IRide {
  _id: string;
  startLocation: { latitude: number; longitude: number };
  endLocation: { latitude: number; longitude: number };
  fare: number;
  status: "pending" | "accepted" | "completed" | "cancelled";
  rider: {
    _id: string;
    name: string;
    email: string;
  };
  driver: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface IRideStats {
  overview: {
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    pendingRides: number;
    totalEarnings: number;
  };
  detailedRides: IRide[];
}
