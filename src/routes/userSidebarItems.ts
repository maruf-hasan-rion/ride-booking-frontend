import Profile from "@/pages/User/Profile";
import RideRequest from "@/pages/User/RideRequest";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Profile",
    items: [
      {
        title: "Profile",
        url: "/user/me",
        component: Profile,
        isActive: undefined,
      },
      {
        title: "Ride",
        url: "/user/ride/request",
        component: RideRequest,
        isActive: undefined,
      },
    ],
  },
];
