import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FareRange = {
  min: string;
  max: string;
};

type FareRangeInputsProps = {
  value: FareRange;
  onChange: (next: FareRange) => void;
};

/** Shared min/max fare filter widgets for history tables (used by rider and
 * driver history screens with identical behaviour). */
export const FareRangeInputs = ({
  value,
  onChange,
}: FareRangeInputsProps) => {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
      <div className="space-y-1">
        <Label htmlFor="fareMin" className="text-xs text-muted-foreground">
          Min Fare
        </Label>
        <Input
          id="fareMin"
          type="number"
          min={0}
          value={value.min}
          onChange={(event) => onChange({ ...value, min: event.target.value })}
          placeholder="0"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="fareMax" className="text-xs text-muted-foreground">
          Max Fare
        </Label>
        <Input
          id="fareMax"
          type="number"
          min={0}
          value={value.max}
          onChange={(event) => onChange({ ...value, max: event.target.value })}
          placeholder="2000"
        />
      </div>
    </div>
  );
};
