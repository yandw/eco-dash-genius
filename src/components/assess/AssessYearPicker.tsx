import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  year: number;
  onChange: (y: number) => void;
  years?: number[];
}

export function AssessYearPicker({ year, onChange, years = [2024, 2025, 2026] }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Select value={String(year)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="h-9 w-32 text-xs">
          <Calendar className="mr-1 h-3.5 w-3.5 opacity-60" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onChange(year)}>
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
