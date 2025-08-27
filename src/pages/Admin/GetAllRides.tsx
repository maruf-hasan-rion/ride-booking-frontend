/* eslint-disable @typescript-eslint/no-explicit-any */


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllRidesQuery } from "@/redux/features/ride/ride.api";

// interface Ride {
//   _id: string;
//   rider: string;
//   driver: string;
//   pickupLocation: {
//     lat: number;
//     lng: number;
//     address: string;
//   };
//   destination: {
//     lat: number;
//     lng: number;
//     address: string;
//   };
//   status: string;
//   fare: number;
// }

export default function GetAllRides() {
  const { data } = useGetAllRidesQuery(undefined);

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-8">
        <h1 className="text-xl font-semibold">All Rides</h1>
      </div>
      <div className="border border-muted rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pickup Location</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Driver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {data?.map((item: any) => (
    <TableRow key={item._id}>
      <TableCell>{item.pickupLocation?.address}</TableCell>
      <TableCell>{item.destination?.address}</TableCell>
      <TableCell>
        {item.driver?.name || item.driver?._id || "Unassigned"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
}

