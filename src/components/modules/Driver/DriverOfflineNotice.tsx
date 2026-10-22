import { Card, CardContent } from "@/components/ui/card";

type DriverOfflineNoticeProps = {
  title?: string;
  description?: string;
};

export const DriverOfflineNotice = ({
  title = "You are offline",
  description = "Go online from Overview to receive and accept incoming ride requests.",
}: DriverOfflineNoticeProps) => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

