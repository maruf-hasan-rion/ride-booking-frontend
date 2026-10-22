import { type ComponentType } from "react";
import type { Role } from "./domain";

export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";
export type {
  AccountStatus,
  AppQueryParams,
  PaginatedData,
  PaginatedMeta,
  RideStatus,
  Role,
} from "./domain";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: ComponentType<{ className?: string }>;
    badge?: string;
    component: ComponentType;
  }[];
}

export type TRole = Role;
