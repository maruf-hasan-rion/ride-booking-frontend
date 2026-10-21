import { AppSidebar } from "@/components/layout/AppSidebar";
import RouteFallback from "@/components/shared/RouteFallback";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router";
import { ModeToggle } from "./ModeToggler";
import { Button } from "../ui/button";
import { GuidedTour } from "../shared/GuidedTour";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function DashboardLayout() {
  const { data: userData } = useUserInfoQuery(undefined);

  return (
    <SidebarProvider>
      <ScrollToTop />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" data-tour="dash-toggle" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center gap-4">
            <div data-tour="dash-theme">
              <ModeToggle />
            </div>
            <GuidedTour role={userData?.data?.role} />
            <Button
              asChild
              className="bg-gradient-to-r brand-gradient-bg hover:opacity-95"
            >
              <Link to="/" title="Back To Home" data-tour="dash-home">
                Home
              </Link>
            </Button>
              
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4" data-tour="dash-content">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
