import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { driverSidebarItems } from "@/routes/driverSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import { type TRole } from "@/types";

const sidebarMap: Partial<Record<TRole, typeof adminSidebarItems>> = {
  [role.superAdmin]: adminSidebarItems,
  [role.admin]: adminSidebarItems,
  [role.rider]: userSidebarItems,
  [role.driver]: driverSidebarItems,
};

export const getSidebarItems = (userRole?: TRole) => {
  if (!userRole) return [];
  return [...(sidebarMap[userRole] || [])];
};
