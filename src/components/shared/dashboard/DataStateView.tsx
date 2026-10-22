import { BounceLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

type DataStateViewProps = {
  isLoading: boolean;
  hasData: boolean;
  emptyMessage?: string;
  errorMessage?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
};

export const DataStateView = ({
  isLoading,
  hasData,
  emptyMessage = "No data found",
  errorMessage,
  onRetry,
  children,
}: DataStateViewProps) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <BounceLoader color="var(--primary)" size={72} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="max-w-md text-sm text-destructive">{errorMessage}</p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (!hasData) {
    return <p className="py-10 text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return <>{children}</>;
};
