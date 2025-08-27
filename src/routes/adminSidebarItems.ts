import GetAllRides from "@/pages/Admin/GetAllRides";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Stats = lazy(() => import("@/pages/Admin/Stats"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Stats",
        url: "/admin/stats",
        component: Stats,
        isActive: undefined,
      },
    ],
  },
  {
    title: "Ride Management",
    items: [
      {
        title: "Get All Rides",
        url: "/admin/get-all-rides",
        component: GetAllRides,
        isActive: undefined,
      },
    ],
  },
];
