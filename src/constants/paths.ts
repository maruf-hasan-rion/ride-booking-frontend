import type { Role } from "@/types/domain";
import { role } from "@/constants/role";

/** Single source of truth for role-based dashboard paths, so pages,
 * sidebars, toasts and the SOS button never re-hardcode routes. */
export const DASHBOARD_PATH_BY_ROLE: Partial<Record<Role, string>> = {
  [role.superAdmin]: "/admin/dashboard",
  [role.admin]: "/admin/dashboard",
  [role.rider]: "/user/dashboard",
  [role.driver]: "/driver/dashboard",
};

export const HISTORY_PATH_BY_ROLE: Partial<Record<Role, string>> = {
  [role.superAdmin]: "/admin/dashboard/ride-oversight",
  [role.admin]: "/admin/dashboard/ride-oversight",
  [role.rider]: "/user/dashboard/history",
  [role.driver]: "/driver/dashboard/history",
};

export const PROFILE_PATH_BY_ROLE: Partial<Record<Role, string>> = {
  [role.superAdmin]: "/admin/dashboard/profile",
  [role.admin]: "/admin/dashboard/profile",
  [role.rider]: "/user/dashboard/profile",
  [role.driver]: "/driver/dashboard/profile",
};

export const SAFETY_PATH_BY_ROLE: Partial<Record<Role, string>> = {
  [role.superAdmin]: "/admin/dashboard/profile",
  [role.admin]: "/admin/dashboard/profile",
  [role.rider]: "/user/dashboard/safety",
  [role.driver]: "/driver/dashboard/safety",
};

export const getPathByRole = (
  userRole: string | undefined,
  pathMap: Partial<Record<Role, string>>,
): string => {
  if (!userRole) return "/";
  return pathMap[userRole as Role] ?? "/";
};
