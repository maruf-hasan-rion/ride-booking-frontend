import * as React from "react";
import { Car, LogOut, User } from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { role } from "@/constants/role";
import { getSidebarItems } from "@/utils/getSidebarItems";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";

import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "@/redux/hook";

const profilePathByRole: Record<string, string> = {
  [role.superAdmin]: "/admin/dashboard/profile",
  [role.admin]: "/admin/dashboard/profile",
  [role.rider]: "/user/dashboard/profile",
  [role.driver]: "/driver/dashboard/profile",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { data: userData } = useUserInfoQuery(undefined);
  const user = userData?.data;
  const data = {
    navMain: getSidebarItems(user?.role),
  };

  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const profilePath = profilePathByRole[user?.role || ""] || "/";
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(authApi.util.resetApiState());
      toast.success("Logged out successfully.");
      navigate("/", { replace: true });
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Sidebar {...props}>
      {/* Header */}
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 p-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-emerald-500 text-xl font-bold">GoMove</h2>
            <span className="text-xs text-muted-foreground">
              {user?.role || "USER"} PORTAL
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent data-tour="dash-nav">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="p-2 space-y-2">
          <Link to={profilePath} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
            <Avatar>
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "Profile"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role || "USER"}
              </p>
            </div>
            <User className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Button
            onClick={() => void handleLogout()}
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
