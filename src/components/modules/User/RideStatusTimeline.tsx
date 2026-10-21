import type { RideStatus } from "@/types/domain";
import type { RideTimestamps } from "@/types/ride";
import { formatDateTime } from "@/utils/formatters";
import { cn } from "@/lib/utils";

type TimelineItem = {
  key: string;
  label: string;
  timestamp?: string | null;
  isCompleted: boolean;
};

type RideStatusTimelineProps = {
  status?: RideStatus;
  timestamps?: RideTimestamps;
};

const STATUS_FLOW: Array<{ status: RideStatus; label: string; timestampKey: keyof RideTimestamps }> = [
  { status: "REQUESTED", label: "Ride Requested", timestampKey: "requestedAt" },
  { status: "ACCEPTED", label: "Driver Accepted", timestampKey: "acceptedAt" },
  { status: "PICKED_UP", label: "Picked Up", timestampKey: "pickedUpAt" },
  { status: "IN_TRANSIT", label: "In Transit", timestampKey: "startedAt" },
  { status: "ARRIVED", label: "Arrived", timestampKey: "arrivedAt" },
  { status: "COMPLETED", label: "Completed", timestampKey: "completedAt" },
];

const getTimelineItems = (
  status: RideStatus | undefined,
  timestamps: RideTimestamps | undefined
): TimelineItem[] => {
  if (status === "CANCELLED") {
    return [
      {
        key: "REQUESTED",
        label: "Ride Requested",
        timestamp: timestamps?.requestedAt,
        isCompleted: true,
      },
      {
        key: "CANCELLED",
        label: "Cancelled",
        timestamp: timestamps?.cancelledAt,
        isCompleted: true,
      },
    ];
  }

  if (status === "REJECTED") {
    return [
      {
        key: "REQUESTED",
        label: "Ride Requested",
        timestamp: timestamps?.requestedAt,
        isCompleted: true,
      },
      {
        key: "REJECTED",
        label: "Rejected",
        timestamp: timestamps?.cancelledAt,
        isCompleted: true,
      },
    ];
  }

  const activeStatus = status || "REQUESTED";
  const currentIndex = STATUS_FLOW.findIndex((item) => item.status === activeStatus);

  return STATUS_FLOW.map((item, index) => {
    const timestamp = timestamps?.[item.timestampKey];
    return {
      key: item.status,
      label: item.label,
      timestamp,
      isCompleted: Boolean(timestamp) || (currentIndex >= 0 && index <= currentIndex),
    };
  });
};

export const RideStatusTimeline = ({ status, timestamps }: RideStatusTimelineProps) => {
  const items = getTimelineItems(status, timestamps);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.key} className="relative flex gap-3 pl-1">
            {!isLast ? (
              <span
                className={cn(
                  "absolute left-[8px] top-5 h-10 w-[2px]",
                  item.isCompleted ? "bg-primary/50" : "bg-border"
                )}
              />
            ) : null}
            <span
              className={cn(
                "mt-1 h-4 w-4 rounded-full border",
                item.isCompleted
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30 bg-background"
              )}
            />
            <div className="space-y-1 pb-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  item.isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.timestamp ? formatDateTime(item.timestamp) : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

