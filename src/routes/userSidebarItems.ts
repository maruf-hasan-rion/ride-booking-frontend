import Profile from "@/pages/Profile";
import RideHistory from "@/pages/User/RideHistory";
import RideRequest from "@/pages/User/RideRequest";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Update Profile",
        url: "/user/profile",
        component: Profile,
      },
    ],
  },
  {
    title: "Ride",
    items: [
      {
        title: "Ride Request",
        url: "/user/ride/request",
        component: RideRequest,
      },
      {
        title: "Ride History",
        url: "/user/ride-history",
        component: RideHistory,
      },
    ],
  },
];
