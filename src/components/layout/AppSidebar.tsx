import * as React from "react";
import { Car, LogOut, User } from "lucide-react";

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
import {
  PROFILE_PATH_BY_ROLE,
  getPathByRole,
} from "@/constants/paths";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { useAccount } from "@/hooks/useAccount";
import { useLogoutSession } from "@/hooks/useLogoutSession";

import { Link } from "react-router";

const profilePathByRole = PROFILE_PATH_BY_ROLE;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAccount();
  const logoutSession = useLogoutSession();
  const data = {
    navMain: getSidebarItems(user?.role),
  };

  const profilePath = user?.role
    ? getPathByRole(user.role, profilePathByRole)
    : "/";
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    await logoutSession();
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
