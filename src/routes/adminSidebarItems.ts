import type { ISidebarItem } from "@/types";
import { Activity, CarTaxiFront, ShieldCheck, User } from "lucide-react";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const RideOversight = lazy(() => import("@/pages/Admin/RideOversight"));
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));
const AdminProfile = lazy(() => import("@/pages/Admin/Profile"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Main Menu",
    items: [
      {
        title: "Analytics",
        url: "/admin/dashboard",
        icon: Activity,
        component: Analytics,
      },
      {
        title: "Ride Oversight",
        url: "/admin/dashboard/ride-oversight",
        icon: CarTaxiFront,
        component: RideOversight,
      },
      {
        title: "User Management",
        url: "/admin/dashboard/user-management",
        icon: ShieldCheck,
        component: UserManagement,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/admin/dashboard/profile",
        icon: User,
        component: AdminProfile,
      },
    ],
  },
];
