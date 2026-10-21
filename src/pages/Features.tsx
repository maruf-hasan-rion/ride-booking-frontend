import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Car,
  Shield,
  UserRound,
  CarTaxiFront,
  UserCog,
  BarChart3,
  Clock,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";

type RoleFeature = {
  title: string;
  description: string;
  icon: ReactNode;
};

type RoleSection = {
  role: "Rider" | "Driver" | "Admin";
  summary: string;
  ctaLabel: string;
  ctaPath: string;
  color: string;
  features: RoleFeature[];
};

const roleSections: RoleSection[] = [
  {
    role: "Rider",
    summary:
      "Book and manage rides with real-time tracking, complete history, profile control, and safety support.",
    ctaLabel: "Start as Rider",
    ctaPath: "/register",
    color: "from-emerald-500 to-teal-600",
    features: [
      {
        title: "Ride Request & Fare Estimate",
        description:
          "Set pickup and destination, preview fare estimation, and choose payment method before confirming.",
        icon: <CarTaxiFront className="h-5 w-5" />,
      },
      {
        title: "Live Ride Tracking",
        description:
          "Track active rides with route progress, driver details, and current status updates.",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        title: "History, Details, and Safety",
        description:
          "Review paginated trip history, ride timeline details, and use SOS options during active rides.",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    role: "Driver",
    summary:
      "Manage availability, respond to incoming ride requests, update active ride status, and monitor earnings.",
    ctaLabel: "Apply as Driver",
    ctaPath: "/register",
    color: "from-teal-500 to-emerald-600",
    features: [
      {
        title: "Availability Control",
        description:
          "Go online/offline from dashboard to control incoming requests based on your schedule.",
        icon: <Car className="h-5 w-5" />,
      },
      {
        title: "Incoming Requests Workflow",
        description:
          "Accept or reject rider requests with clear filtering and status-aware handling.",
        icon: <UserRound className="h-5 w-5" />,
      },
      {
        title: "Ride Progress + Earnings",
        description:
          "Update active ride statuses and review earnings insights with charts and history views.",
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
  },
  {
    role: "Admin",
    summary:
      "Oversee users, rides, and platform performance with centralized controls and analytics dashboards.",
    ctaLabel: "Contact for Admin Access",
    ctaPath: "/contact",
    color: "from-emerald-600 to-emerald-700",
    features: [
      {
        title: "User Management",
        description:
          "Search/filter users, block or unblock riders, and approve or suspend drivers.",
        icon: <UserCog className="h-5 w-5" />,
      },
      {
        title: "Ride Oversight",
        description:
          "Inspect all rides with filtering by date, rider, driver, status, and transaction information.",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        title: "Analytics Dashboard",
        description:
          "Track ride volume, revenue trends, and driver activity through API-driven charts.",
        icon: <BarChart3 className="h-5 w-5" />,
      },
    ],
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-br from-emerald-50/30 via-background to-teal-50/30 py-16 md:py-24">
      <div className="section-shell space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 brand-gradient-bg text-primary-foreground">Platform Capabilities</Badge>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Features by Role</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore how GoMove supports Riders, Drivers, and Admins through consistent workflows and safe, real-time operations.
          </p>
        </div>

        <div className="grid gap-6">
          {roleSections.map((section) => (
            <article
              key={section.role}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8"
            >
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{section.role} Features</h2>
                  <p className="mt-2 max-w-3xl text-muted-foreground">{section.summary}</p>
                </div>

                <Button asChild className={`bg-gradient-to-r ${section.color} text-white hover:opacity-90`}>
                  <Link to={section.ctaPath}>
                    {section.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {section.features.map((feature) => (
                  <div
                    key={`${section.role}-${feature.title}`}
                    className="rounded-xl border border-border/70 bg-background/80 p-4"
                  >
                    <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
