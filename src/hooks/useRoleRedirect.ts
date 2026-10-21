import {
  DASHBOARD_PATH_BY_ROLE,
  HISTORY_PATH_BY_ROLE,
  getPathByRole,
} from "@/constants/paths";

export const getRoleDashboardPath = (userRole?: string) => {
  return getPathByRole(userRole, DASHBOARD_PATH_BY_ROLE);
};

export const getRoleDashboardHistoryPath = (userRole?: string) => {
  return getPathByRole(userRole, HISTORY_PATH_BY_ROLE);
};
