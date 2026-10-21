import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DriverProfileGateProps = {
  heading?: string;
  description: string;
  profileError?: string;
};

/** Shown when a driver page cannot work without completing the profile. */
export const DriverProfileGate = ({
  heading = "Complete Driver Profile First",
  description,
  profileError,
}: DriverProfileGateProps) => {
  return (
    <Card>
      <CardContent className="space-y-3 py-10 text-center">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <p className="text-muted-foreground">{description}</p>
        <Button asChild>
          <Link to="/driver/dashboard/profile">Go To Profile Setup</Link>
        </Button>
        {profileError ? (
          <p className="text-xs text-muted-foreground">{profileError}</p>
        ) : null}
      </CardContent>
    </Card>
  );
};
