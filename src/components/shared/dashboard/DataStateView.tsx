import { BounceLoader } from "react-spinners";

type DataStateViewProps = {
  isLoading: boolean;
  hasData: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
};

export const DataStateView = ({
  isLoading,
  hasData,
  emptyMessage = "No data found",
  children,
}: DataStateViewProps) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <BounceLoader color="var(--primary)" size={72} />
      </div>
    );
  }

  if (!hasData) {
    return <p className="py-10 text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return <>{children}</>;
};
