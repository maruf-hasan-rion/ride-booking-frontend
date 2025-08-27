// import type { ComponentType } from "react";

import type { TRole } from ".";

export type IRideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

// export interface IRide {
//   _id?: string;
//   destinationLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   driverId: IDriverInfo;
//   fare: number;
//   pickupLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   riderId: {
//     name: string;
//     phone: string;
//   };
//   status: string;
//   requestedAt: string;
//   cancelledAt?: string;
//   canceller?: "RIDER" | "DRIVER";
//   pickedUpAt?: string;
//   transitAt?: string;
//   completedAt?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface IDriverInfo {
//   currentLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   driverLicense: {
//     number: string;
//     expirationDate: string;
//   };
//   isAvailable: boolean;
//   rating: number;
//   vehicleInfo: {
//     model: string;
//     registrationNumber: string;
//     year: number;
//     maxPassengers: number;
//   };
// }

export interface IRideBook {
  pickupLocation: { latitude: number; longitude: number };
  dropOffLocation: { latitude: number; longitude: number };
}

// // Corrected type alias for ride status
// export type IRideStatus =
//   | "requested"
//   | "accepted"
//   | "picked_up"
//   | "in_transit"
//   | "completed"
//   | "cancelled"
//   | "rejected"
//   | "no_driver_found";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: TRole;
  contactNo?: string;
  vehicleType?: string;
  isBlocked: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  averageRating?: number;
  totalRatings?: number;
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

// export interface IRideReport {
//   overview: {
//     totalRides: number;
//     completedRides: number;
//     cancelledRides: number;
//     pendingRides: number;
//     totalEarnings: number;
//   };
//   detailedRides: IRide[];
// }
