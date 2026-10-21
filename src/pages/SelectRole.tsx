import RouteFallback from "@/components/shared/RouteFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { role } from "@/constants/role";
import { getRoleDashboardPath } from "@/hooks/useRoleRedirect";
import { useAccount } from "@/hooks/useAccount";
import { useToastAction } from "@/hooks/useToastAction";
import { useAppDispatch } from "@/redux/hook";
import {
  authApi,
  useLogoutMutation,
  useUpdateUserProfileMutation,
} from "@/redux/features/auth/auth.api";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

type RoleOption = typeof role.rider | typeof role.driver;

const roleCards: Array<{
  value: RoleOption;
  title: string;
  description: string;
}> = [
  {
    value: role.rider,
    title: "Rider",
    description: "Book rides, track trips, view history, and manage your account.",
  },
  {
    value: role.driver,
    title: "Driver",
    description: "Receive requests, manage active rides, and track earnings.",
  },
];

export default function SelectRole() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);

  const {
    user,
    isLoading,
    isLoggedIn: hasEmail,
    isBlockedOrSuspended,
  } = useAccount();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [logout] = useLogoutMutation();
  const runAction = useToastAction();

  useEffect(() => {
    if (isLoading || !user?.role) return;
    navigate(getRoleDashboardPath(user.role), { replace: true });
  }, [isLoading, navigate, user?.role]);

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue.");
      return;
    }

    if (!user?._id) {
      toast.error("Unable to complete role setup. Please login again.");
      return;
    }

    const result = await runAction(
      () =>
        updateProfile({
          id: user._id as string,
          data: { role: selectedRole },
        }).unwrap(),
      {
        success: "Role setup completed.",
        fallback:
          "Failed to complete role setup. Please login again.",
      },
    );

    if (result) {
      navigate(getRoleDashboardPath(selectedRole), { replace: true });
      return;
    }

    try {
      await logout(undefined).unwrap();
    } catch {
      // Best-effort logout
    } finally {
      dispatch(authApi.util.resetApiState());
      navigate("/login", { replace: true });
    }
  };

  if (isLoading) {
    return <RouteFallback />;
  }

  if (!hasEmail) {
    return <Navigate to="/login" replace />;
  }

  if (isBlockedOrSuspended) {
    return <Navigate to="/blocked" replace />;
  }

  if (user?.role) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return (
    <main className="section-shell flex min-h-[75vh] items-center justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Role Setup</CardTitle>
          <CardDescription>
            Select how you want to use GoMove. You can choose Rider or Driver.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {roleCards.map((item) => {
              const isSelected = selectedRole === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedRole(item.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Admin accounts are provisioned by the platform team and cannot be selected here.
          </p>

          <Button onClick={handleRoleSubmit} className="w-full" disabled={!selectedRole || isUpdating}>
            {isUpdating ? "Completing setup..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
