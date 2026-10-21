import RouteFallback from "@/components/shared/RouteFallback";
import { useAccount } from "@/hooks/useAccount";
import { type TRole } from "@/types";
import { type ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (
  Component: ComponentType,
  requiredRole?: TRole | TRole[]
) => {
  return function AuthWrapper() {
    const { user, isLoading, isLoggedIn, hasRole, isBlockedOrSuspended } =
      useAccount();

    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : requiredRole
        ? [requiredRole]
        : [];

    if (isLoading) {
      return <RouteFallback />;
    }

    if (!isLoading && !isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (!isLoading && isBlockedOrSuspended) {
      return <Navigate to="/blocked" replace />;
    }

    if (!isLoading && !hasRole) {
      return <Navigate to="/select-role" replace />;
    }

    if (
      !isLoading &&
      allowedRoles.length > 0 &&
      (!user?.role || !allowedRoles.includes(user.role))
    ) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};
