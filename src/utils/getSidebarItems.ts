import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { driverSidebarItems } from "@/routes/driverSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import { type TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.superAdmin:
      return [...adminSidebarItems];
    case role.admin:
      return [...adminSidebarItems];
    case role.rider:
      return [...userSidebarItems];
    case role.driver:
      return [...driverSidebarItems];
    default:
      return [];
  }
};
