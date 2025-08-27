import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RideDetails = () => {
  return (
    <div>
      
      {/* Active Ride Section */}
      {activeRide && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Active Ride</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Pickup:</strong> {activeRide.pickup}
            </p>
            <p>
              <strong>Destination:</strong> {activeRide.destination}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{activeRide.status}</span>
            </p>
            <Button variant="destructive" className="mt-4">
              Cancel Ride
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RideDetails;