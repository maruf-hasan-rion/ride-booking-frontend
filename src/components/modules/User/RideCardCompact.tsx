import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import type { RideStatus } from "@/types/domain";
import { formatCurrencyBDT, formatDateTime } from "@/utils/formatters";

type RideLocation = {
  coordinates?: number[];
};

export type CompactRide = {
  _id: string;
  status?: RideStatus;
  fare?: number;
  createdAt?: string;
  pickupLocation?: RideLocation;
  destination?: RideLocation;
};

const formatLocation = (location?: RideLocation) => {
  const coordinates = location?.coordinates;
  if (!coordinates || coordinates.length < 2) return "N/A";
  return `${coordinates[0]}, ${coordinates[1]}`;
};

export default function RideCardCompact({ ride }: { ride: CompactRide }) {
  return (
    <div className="rounded-lg border p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{formatDateTime(ride.createdAt)}</p>
          <p className="text-sm font-medium">Pickup: {formatLocation(ride.pickupLocation)}</p>
          <p className="text-sm text-muted-foreground">Destination: {formatLocation(ride.destination)}</p>
        </div>

        <div className="space-y-2 text-right">
          <p className="text-lg font-bold">{formatCurrencyBDT(ride.fare)}</p>
          <StatusBadge status={ride.status || "REQUESTED"} />
        </div>
      </div>
    </div>
  );
}
