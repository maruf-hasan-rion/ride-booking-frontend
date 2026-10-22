import type { ISidebarItem } from "@/types";
import { Activity, Calendar, History, User, ShieldAlert } from "lucide-react";
import { lazy } from "react";

const DriverProfile = lazy(() => import("@/pages/Driver/DriverProfile"));
const Overview = lazy(() => import("@/pages/Driver/Overview"));
const RideHistory = lazy(() => import("@/pages/Driver/RideHistory"));
const RideRequest = lazy(() => import("@/pages/Driver/RideRequest"));
const SafetySettings = lazy(() => import("@/pages/Driver/SafetySettings"));

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Main Menu",
    items: [
      {
        title: "Overview",
        url: "/driver/dashboard",
        icon: Activity,
        component: Overview,
      },
      {
        title: "Incoming Requests",
        url: "/driver/dashboard/ride-request",
        icon: Calendar,
        component: RideRequest,
      },

      {
        title: "Ride History",
        url: "/driver/dashboard/history",
        icon: History,
        component: RideHistory,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/driver/dashboard/profile",
        icon: User,
        component: DriverProfile,
      },
      {
        title: "Safety Settings",
        url: "/driver/dashboard/safety",
        icon: ShieldAlert,
        component: SafetySettings,
      },
    ],
  },
];
