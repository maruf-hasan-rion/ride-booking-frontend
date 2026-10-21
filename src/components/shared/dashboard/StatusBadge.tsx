import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status?: string | null;
  className?: string;
};

/** Status chips derive from design tokens (primary/destructive/muted) with
 * /10 fills and /25 borders so they stay legible in light AND dark mode with
 * no per-status dark: overrides. */
const STYLE_BY_STATUS: Record<string, string> = {
  COMPLETED: "bg-primary/10 text-primary border-primary/25",
  IN_TRANSIT: "bg-primary/10 text-primary border-primary/25",
  PICKED_UP: "bg-primary/10 text-primary border-primary/25",
  ACCEPTED: "bg-primary/15 text-primary border-primary/30",
  REQUESTED: "bg-muted text-muted-foreground border-border",
  ARRIVED: "bg-primary/20 text-primary border-primary/35",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/25",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/25",
  BLOCKED: "bg-destructive/10 text-destructive border-destructive/25",
  SUSPENDED: "bg-destructive/10 text-destructive border-destructive/25",
  PENDING: "bg-muted text-muted-foreground border-border",
  ACTIVE: "bg-primary/10 text-primary border-primary/25",
  ONLINE: "bg-primary/10 text-primary border-primary/25",
  OFFLINE: "bg-muted text-muted-foreground border-border",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalized = (status || "N/A").toUpperCase();

  return (
    <Badge
      variant="outline"
      className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", STYLE_BY_STATUS[normalized], className)}
    >
      {normalized.replaceAll("_", " ")}
    </Badge>
  );
};
