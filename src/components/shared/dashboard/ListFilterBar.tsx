import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusOption = {
  label: string;
  value: string;
};

type ListFilterBarProps = {
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateSearch: string;
  onDateSearchChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  statusOptions: StatusOption[];
  onReset: () => void;
  children?: ReactNode;
};

const ALL_STATUS_VALUE = "__ALL__";

export const ListFilterBar = ({
  searchPlaceholder = "Search...",
  searchTerm,
  onSearchChange,
  dateSearch,
  onDateSearchChange,
  statusValue,
  onStatusChange,
  statusOptions,
  onReset,
  children,
}: ListFilterBarProps) => {
  const normalizedStatusValue = statusValue || ALL_STATUS_VALUE;

  return (
    <section className="mb-4 flex flex-wrap items-center justify-center gap-3">
      <div className="w-full min-w-[250px] flex-grow sm:w-auto">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full min-w-[250px] flex-grow sm:w-auto">
        <Input
          type="date"
          value={dateSearch}
          onChange={(e) => onDateSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full bg-background sm:w-[200px]">
        <Select
          onValueChange={(value) =>
            onStatusChange(value === ALL_STATUS_VALUE ? "" : value)
          }
          value={normalizedStatusValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem
                key={`${status.label}-${status.value || "all"}`}
                value={status.value || ALL_STATUS_VALUE}
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-[150px]">
        <Button className="w-full" variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
      {children}
    </section>
  );
};
