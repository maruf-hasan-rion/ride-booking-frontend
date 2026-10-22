import { Calendar, History, User, Activity, ShieldAlert } from "lucide-react";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Overview = lazy(() => import("@/pages/User/Overview"));
const RideRequest = lazy(() => import("@/pages/User/RideRequest"));
const RideHistory = lazy(() => import("@/pages/User/RideHistory"));
const UserProfile = lazy(() => import("@/pages/User/UserProfile"));
const SafetySettings = lazy(() => import("@/pages/User/SafetySettings"));

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Main Menu",
    items: [
      {
        title: "Overview",
        url: "/user/dashboard",
        icon: Activity,
        component: Overview,
      },
      {
        title: "Book Ride",
        url: "/user/dashboard/book-ride",
        icon: Calendar,
        component: RideRequest,
      },

      {
        title: "Ride History",
        url: "/user/dashboard/history",
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
        url: "/user/dashboard/profile",
        icon: User,
        component: UserProfile,
      },
      {
        title: "Safety Settings",
        url: "/user/dashboard/safety",
        icon: ShieldAlert,
        component: SafetySettings,
      },
    ],
  },
];
