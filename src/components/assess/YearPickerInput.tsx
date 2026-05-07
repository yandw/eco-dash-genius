import { useMemo, useState } from "react";
import { Calendar, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  value?: number;
  onChange: (y: number | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
  className?: string;
}

/** Ant Design 风格的年份选择器：弹出 10 年面板 */
export function YearPickerInput({
  value,
  onChange,
  placeholder = "请选择年份",
  allowClear = true,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const baseYear = value ?? new Date().getFullYear();
  const [decadeStart, setDecadeStart] = useState<number>(Math.floor(baseYear / 10) * 10);

  const years = useMemo(
    () => Array.from({ length: 10 }, (_, i) => decadeStart + i),
    [decadeStart],
  );

  return (
    <Popover open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o) setDecadeStart(Math.floor((value ?? new Date().getFullYear()) / 10) * 10);
    }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-left transition-colors hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring",
            className,
          )}
        >
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={cn("flex-1 truncate", value ? "text-foreground" : "text-muted-foreground")}>
            {value ? `${value}年` : placeholder}
          </span>
          {allowClear && value !== undefined && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
            onClick={() => setDecadeStart((d) => d - 10)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium tabular-nums">
            {decadeStart} 年 - {decadeStart + 9} 年
          </div>
          <button
            type="button"
            className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
            onClick={() => setDecadeStart((d) => d + 10)}
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => {
            const active = value === y;
            return (
              <button
                key={y}
                type="button"
                onClick={() => {
                  onChange(y);
                  setOpen(false);
                }}
                className={cn(
                  "h-10 rounded text-sm tabular-nums transition-colors",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent text-foreground",
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
