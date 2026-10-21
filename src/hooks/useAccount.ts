import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { AuthUser } from "@/redux/features/auth/auth.api";

const readAccountStatus = (status?: string): string | undefined =>
  typeof status === "string" ? status.toLowerCase() : undefined;

interface AccountSession {
  user: AuthUser | undefined;
  /** `/user/me` request in flight (or its cache is still cold). */
  isLoading: boolean;
  isLoggedIn: boolean;
  hasRole: boolean;
  isBlockedOrSuspended: boolean;
  accountStatus?: string;
  accountStatusLabel: "BLOCKED" | "SUSPENDED" | "ACTIVE" | "UNKNOWN";
}

/** Single source of logged-user state: `/user/me` result plus the blocked/
 * suspended resolution every gate, redirect and banner needs. Replaces the
 * inline normalization logic previously copy-pasted across six screens. */
export const useAccount = (): AccountSession => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const user = data?.data;

  const accountStatus = readAccountStatus(user?.status);
  const isBlockedOrSuspended =
    user?.isBlocked === true ||
    accountStatus === "blocked" ||
    accountStatus === "suspended";

  const accountStatusLabel: AccountSession["accountStatusLabel"] =
    user?.isBlocked === true || accountStatus === "blocked"
      ? "BLOCKED"
      : accountStatus === "suspended"
        ? "SUSPENDED"
        : accountStatus === "active"
          ? "ACTIVE"
          : "UNKNOWN";

  return {
    user,
    isLoading,
    isLoggedIn: Boolean(user?.email),
    hasRole: Boolean(user?.role),
    isBlockedOrSuspended,
    accountStatus,
    accountStatusLabel,
  };
};
