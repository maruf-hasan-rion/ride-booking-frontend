import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import Features from "@/pages/Features";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import { driverSidebarItems } from "./driverSidebarItems";
import Home from "@/pages/Home";
import { lazy } from "react";
import Pricing from "@/pages/Pricing";
import RouteErrorPage from "@/pages/RouteErrorPage";
import SelectRole from "@/pages/SelectRole";
import {
  DashboardHistoryRedirect,
  DashboardRedirect,
} from "@/pages/DashboardRedirects";

const MyRideDetails = lazy(() => import("@/pages/User/MyRideDetails"));
const BlockedPage = lazy(() => import("@/pages/BlockedPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "features",
        Component: Features,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "faq",
        Component: FAQ,
      },
      {
        path: "pricing",
        Component: Pricing,
      },
      {
        path: "/my-ride/:rideId",
        Component: withAuth(MyRideDetails, role.rider as TRole),
      },
    ],
  },
  {
    path: "/blocked",
    Component: BlockedPage,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/select-role",
    Component: SelectRole,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/dashboard",
    Component: withAuth(DashboardRedirect),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/dashboard/history",
    Component: withAuth(DashboardHistoryRedirect),
    errorElement: <RouteErrorPage />,
  },
  {
    Component: withAuth(DashboardLayout, [role.admin, role.superAdmin]),
    path: "/admin",
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.rider as TRole),
    path: "/user",
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/user/dashboard" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.driver as TRole),
    path: "/driver",
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/driver/dashboard" /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  {
    path: "/login",
    Component: Login,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/register",
    Component: Register,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/verify",
    Component: Verify,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/unauthorized",
    Component: Unauthorized,
    errorElement: <RouteErrorPage />,
  },
]);
