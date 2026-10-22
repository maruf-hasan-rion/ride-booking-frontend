import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type AnalyticsStatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
};

export const AnalyticsStatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: AnalyticsStatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          <Icon className="size-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
