import { useEffect } from "react";
import { driver } from "driver.js";
import { Button } from "@/components/ui/button";

type GuidedTourProps = {
  role?: string;
};

const TOUR_VERSION = "v1";

const getRoleTourContent = (role?: string) => {
  switch (role) {
    case "ADMIN":
      return {
        navTitle: "Admin Navigation",
        navDescription: "Open user management, ride oversight, and analytics from this menu.",
        workspaceDescription: "Use this workspace to manage users, drivers, rides, and platform insights.",
      };
    case "DRIVER":
      return {
        navTitle: "Driver Navigation",
        navDescription: "Open availability, incoming requests, active ride, and earnings pages here.",
        workspaceDescription: "This workspace helps you accept rides, update statuses, and track earnings.",
      };
    case "RIDER":
      return {
        navTitle: "Rider Navigation",
        navDescription: "Open request ride, history, and profile pages from this menu.",
        workspaceDescription: "Use this area to request rides, monitor progress, and review ride history.",
      };
    default:
      return {
        navTitle: "Role Menu",
        navDescription: "Access all role-specific features from here.",
        workspaceDescription: "This area updates based on your selected menu item.",
      };
  }
};

export const GuidedTour = ({ role }: GuidedTourProps) => {
  const storageKey = `guided-tour:${role || "guest"}:${TOUR_VERSION}`;
  const tourContent = getRoleTourContent(role);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        {
          element: '[data-tour="dash-toggle"]',
          popover: {
            title: "Sidebar Toggle",
            description: "Open or collapse the sidebar anytime.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: '[data-tour="dash-nav"]',
          popover: {
            title: tourContent.navTitle,
            description: tourContent.navDescription,
            side: "right",
          },
        },
        {
          element: '[data-tour="dash-theme"]',
          popover: {
            title: "Theme Switch",
            description: "Use this to switch between light and dark mode.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="dash-home"]',
          popover: {
            title: "Back to Home",
            description: "Quickly return to the public landing pages.",
            side: "bottom",
          },
        },
        {
          element: '[data-tour="dash-content"]',
          popover: {
            title: "Main Workspace",
            description: tourContent.workspaceDescription,
            side: "top",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem(storageKey, "done");
      },
    });

    driverObj.drive();
  };

  useEffect(() => {
    if (!role) return;

    const done = localStorage.getItem(storageKey);
    if (done === "done") return;

    const timer = setTimeout(() => {
      startTour();
    }, 450);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <Button type="button" variant="outline" onClick={startTour}>
      Start Tour
    </Button>
  );
};
