import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const rideHistory = [
  {
    id: "1",
    pickup: "Gulshan 1, Dhaka",
    destination: "Dhanmondi 27, Dhaka",
    status: "completed",
    fare: 350,
  },
  {
    id: "2",
    pickup: "Banani, Dhaka",
    destination: "Mirpur 10, Dhaka",
    status: "cancelled",
    fare: 0,
  },
];

const RideHistory = () => {
  return (
    <div>
         {/* Ride History */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fare</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rideHistory.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.pickup}</TableCell>
                  <TableCell>{ride.destination}</TableCell>
                  <TableCell className="capitalize">{ride.status}</TableCell>
                  <TableCell>{ride.fare} ৳</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideHistory;