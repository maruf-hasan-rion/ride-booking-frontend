import Profile from "@/pages/User/Profile";
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
      {
        title: "Ride",
        url: "/user/ride/request",
        component: RideRequest,
      },
    ],
  },
];
