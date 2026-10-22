import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListFilterBar } from "@/components/shared/dashboard/ListFilterBar";
import { PaginatedDataTable } from "@/components/shared/dashboard/PaginatedDataTable";
import { DataStateView } from "@/components/shared/dashboard/DataStateView";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import { useListQueryState } from "@/hooks/useListQueryState";
import { useToastAction } from "@/hooks/useToastAction";
import { useAccount } from "@/hooks/useAccount";
import {
  useBlockUserMutation,
  useGetAllUsersForAdminQuery,
  useUnblockUserMutation,
} from "@/redux/features/admin/admin.api";
import {
  useApproveDriverMutation,
  useGetAllDriversQuery,
  useSuspendDriverMutation,
} from "@/redux/features/driver/driver.api";
import type { Role } from "@/types/domain";
import { extractArrayData, getApiErrorMessage } from "@/utils/apiResponse";
import { formatDateTime } from "@/utils/formatters";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const ALL_ROLE_FILTER = "__ALL_ROLE__";
const roleOptions: Array<{ label: string; value: Role | typeof ALL_ROLE_FILTER }> = [
  { label: "All Roles", value: ALL_ROLE_FILTER },
  { label: "Rider", value: "RIDER" },
  { label: "Driver", value: "DRIVER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  contactNo?: string;
  createdAt?: string;
  role: Role;
  isBlocked: boolean;
  status?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
};

type DriverProfile = {
  _id: string;
  isApproved?: boolean;
  user?: { _id?: string };
};

type AccountStatus = "ACTIVE" | "PENDING" | "BLOCKED" | "SUSPENDED";

type UserTableRow = {
  _id: string;
  name: string;
  email: string;
  contactNo?: string;
  createdAt?: string;
  role: Role;
  isBlocked: boolean;
  driverProfile?: DriverProfile;
  accountStatus: AccountStatus;
};

export default function UserManagement() {
  const { state, setState, resetFilters } = useListQueryState({ limit: 8 });
  const [roleFilter, setRoleFilter] = useState<Role | typeof ALL_ROLE_FILTER>(ALL_ROLE_FILTER);

  const { user: currentUser } = useAccount();
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useGetAllUsersForAdminQuery(undefined);
  const {
    data: driversResponse,
    isLoading: driversLoading,
    error: driversError,
    refetch: refetchDrivers,
  } = useGetAllDriversQuery(undefined);
  const runAction = useToastAction();

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [approveDriver, { isLoading: isApproving }] = useApproveDriverMutation();
  const [suspendDriver, { isLoading: isSuspending }] = useSuspendDriverMutation();

  const users = extractArrayData<AdminUser>(usersResponse);
  const drivers = extractArrayData<DriverProfile>(driversResponse);

  const driverByUserId = useMemo(
    () =>
      new Map<string, DriverProfile>(
        drivers
          .filter((driver) => Boolean(driver.user?._id))
          .map((driver) => [driver.user?._id as string, driver])
      ),
    [drivers]
  );

  const rows = useMemo<UserTableRow[]>(() => {
    return users.map((user) => {
      const driverProfile = user.role === "DRIVER" ? driverByUserId.get(user._id) : undefined;

      let accountStatus: AccountStatus =
        user.status || (user.isBlocked ? "BLOCKED" : "ACTIVE");

      if (
        user.role === "DRIVER" &&
        accountStatus === "ACTIVE" &&
        driverProfile &&
        !driverProfile.isApproved
      ) {
        accountStatus = "PENDING";
      }

      if (user.role === "DRIVER" && user.status === "SUSPENDED") {
        accountStatus = "SUSPENDED";
      }

      return {
        ...user,
        driverProfile,
        accountStatus,
      };
    });
  }, [driverByUserId, users]);

  const filteredRows = useMemo(() => {
    const searchTerm = state.searchTerm.trim().toLowerCase();

    return rows.filter((user) => {
      const createdAt = user.createdAt?.slice(0, 10) || "";

      const matchesSearch =
        !searchTerm ||
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.contactNo?.toLowerCase().includes(searchTerm);

      const matchesDate = !state.dateSearch || createdAt === state.dateSearch;
      const matchesStatus = !state.rideStatus || user.accountStatus === state.rideStatus;
      const matchesRole = roleFilter === ALL_ROLE_FILTER || user.role === roleFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesRole;
    });
  }, [roleFilter, rows, state.dateSearch, state.rideStatus, state.searchTerm]);

  const totalPage = Math.max(1, Math.ceil(filteredRows.length / state.limit));

  useEffect(() => {
    if (state.page > totalPage) {
      setState((previous) => ({ ...previous, page: totalPage }));
    }
  }, [setState, state.page, totalPage]);

  const paginatedRows = useMemo(() => {
    const startIndex = (state.page - 1) * state.limit;
    return filteredRows.slice(startIndex, startIndex + state.limit);
  }, [filteredRows, state.limit, state.page]);

  const isMutating = isBlocking || isUnblocking || isApproving || isSuspending;
  const currentUserId = currentUser?._id;

  const handleBlockToggle = async (user: UserTableRow) => {
    if (user.isBlocked) {
      await runAction(() => unblockUser(user._id).unwrap(), {
        success: "Rider unblocked successfully.",
        fallback: "Failed to update rider block status.",
      });
    } else {
      await runAction(() => blockUser(user._id).unwrap(), {
        success: "Rider blocked successfully.",
        fallback: "Failed to update rider block status.",
      });
    }
  };

  const handleDriverStatus = async (user: UserTableRow, action: "approve" | "suspend") => {
    if (!user.driverProfile) {
      toast.error("Driver profile not found. Ask driver to complete profile setup first.");
      return;
    }

    const fallback = "Failed to update driver status.";

    if (action === "approve") {
      await runAction(() => approveDriver(user._id).unwrap(), {
        success: "Driver approved successfully.",
        fallback,
      });
    } else {
      await runAction(() => suspendDriver(user._id).unwrap(), {
        success: "Driver suspended successfully.",
        fallback,
      });
    }
  };

  const handleReset = () => {
    resetFilters();
    setRoleFilter(ALL_ROLE_FILTER);
  };

  return (
    <div className="space-y-4">
      <ListFilterBar
        searchPlaceholder="Search by name, email, or phone"
        searchTerm={state.searchTerm}
        onSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, searchTerm: value }))}
        dateSearch={state.dateSearch}
        onDateSearchChange={(value) => setState((prev) => ({ ...prev, page: 1, dateSearch: value }))}
        statusValue={state.rideStatus}
        onStatusChange={(value) => setState((prev) => ({ ...prev, page: 1, rideStatus: value }))}
        statusOptions={statusOptions}
        onReset={handleReset}
      >
        <div className="w-full bg-background sm:w-[200px]">
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as Role | typeof ALL_ROLE_FILTER);
              setState((previous) => ({ ...previous, page: 1 }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ListFilterBar>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataStateView
            isLoading={usersLoading || driversLoading}
            hasData={paginatedRows.length > 0}
            errorMessage={
              usersError || driversError
                ? getApiErrorMessage(
                    usersError || driversError,
                    "Failed to load user management data.",
                  )
                : undefined
            }
            onRetry={() => {
              void refetchUsers();
              void refetchDrivers();
            }}
            emptyMessage="No users match current filters."
          >
            <PaginatedDataTable
              currentPage={state.page}
              totalPage={totalPage}
              onPageChange={(page) => setState((previous) => ({ ...previous, page }))}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRows.map((user) => {
                    const isCurrentUser = user._id === currentUserId;

                    return (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.accountStatus} />
                        </TableCell>
                        <TableCell className="space-x-2">
                          {user.role === "RIDER" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating || isCurrentUser}
                              onClick={() => handleBlockToggle(user)}
                            >
                              {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
                          ) : null}

                          {user.role === "DRIVER" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating || !user.driverProfile}
                              onClick={() =>
                                handleDriverStatus(
                                  user,
                                  user.driverProfile?.isApproved ? "suspend" : "approve"
                                )
                              }
                            >
                              {user.driverProfile?.isApproved ? "Suspend" : "Approve"}
                            </Button>
                          ) : null}

                          {user.role !== "RIDER" && user.role !== "DRIVER" ? (
                            <span className="text-xs text-muted-foreground">No action</span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </PaginatedDataTable>
          </DataStateView>
        </CardContent>
      </Card>
    </div>
  );
}
