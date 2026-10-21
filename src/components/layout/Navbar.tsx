import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { role } from "@/constants/role";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggler";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

const dashboardHrefByRole: Record<string, string> = {
  [role.superAdmin]: "/admin/dashboard",
  [role.admin]: "/admin/dashboard",
  [role.rider]: "/user/dashboard",
  [role.driver]: "/driver/dashboard",
};

const profileHrefByRole: Record<string, string> = {
  [role.superAdmin]: "/admin/dashboard/profile",
  [role.admin]: "/admin/dashboard/profile",
  [role.rider]: "/user/dashboard/profile",
  [role.driver]: "/driver/dashboard/profile",
};

const safetyHrefByRole: Partial<Record<string, string>> = {
  [role.rider]: "/user/dashboard/safety",
  [role.driver]: "/driver/dashboard/safety",
};

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();

  const user = data?.data;
  const userRole = user?.role as string | undefined;
  const dashboardHref = userRole ? dashboardHrefByRole[userRole] : undefined;
  const profileHref = userRole ? profileHrefByRole[userRole] : undefined;
  const safetyHref = userRole ? safetyHrefByRole[userRole] : undefined;

  const navLinks = dashboardHref
    ? [...publicLinks, { href: dashboardHref, label: "Dashboard" }]
    : publicLinks;

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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 py-1 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 md:hidden" variant="ghost" size="icon" aria-label="Open menu">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-2 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0">
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={`${link.href}-${link.label}`}>
                      <NavigationMenuLink
                        asChild
                        className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          <Link to="/" className="brand-gradient-text text-2xl font-bold">
            GoMove
          </Link>

          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={`${link.href}-${link.label}`}>
                  <NavigationMenuLink
                    asChild
                    className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                  >
                    <Link to={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user?.email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" className="h-9 gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[120px] truncate text-sm font-medium max-sm:hidden">
                    {user.name || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {dashboardHref ? (
                  <DropdownMenuItem asChild>
                    <Link to={dashboardHref}>Dashboard</Link>
                  </DropdownMenuItem>
                ) : null}

                {profileHref ? (
                  <DropdownMenuItem asChild>
                    <Link to={profileHref}>Profile</Link>
                  </DropdownMenuItem>
                ) : null}

                {safetyHref ? (
                  <DropdownMenuItem asChild>
                    <Link to={safetyHref}>Safety Settings</Link>
                  </DropdownMenuItem>
                ) : null}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="brand-gradient-bg text-sm hover:opacity-90">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
