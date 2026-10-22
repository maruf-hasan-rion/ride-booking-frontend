import {
  getRoleDashboardHistoryPath,
  getRoleDashboardPath,
} from "@/hooks/useRoleRedirect";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Navigate } from "react-router";

export const DashboardRedirect = () => {
  const { data } = useUserInfoQuery(undefined);
  return <Navigate to={getRoleDashboardPath(data?.data?.role)} replace />;
};

export const DashboardHistoryRedirect = () => {
  const { data } = useUserInfoQuery(undefined);
  return <Navigate to={getRoleDashboardHistoryPath(data?.data?.role)} replace />;
};
