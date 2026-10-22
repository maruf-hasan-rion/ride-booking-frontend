import type { Role } from "@/types/domain";

type RoleKey = "superAdmin" | "admin" | "rider" | "driver";

export const role: Record<RoleKey, Role> = {
  superAdmin: "SUPER_ADMIN",
  admin: "ADMIN",
  rider: "RIDER",
  driver: "DRIVER",
};
