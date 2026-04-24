import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "warning" | "success";
}

const accentMap = {
  primary: "from-primary/30 to-primary/0 text-primary",
  secondary: "from-secondary/30 to-secondary/0 text-secondary",
  warning: "from-warning/30 to-warning/0 text-warning",
  success: "from-success/30 to-success/0 text-success",
};

export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  icon: Icon,
  accent = "primary",
}: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="panel relative overflow-hidden p-5 transition-smooth hover:border-primary/50">
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl bg-gradient-to-br opacity-60",
          accentMap[accent]
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground tracking-wider uppercase">{label}</div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tabular-nums tracking-tight">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {delta !== undefined && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5",
                  positive
                    ? "bg-destructive/15 text-destructive"
                    : "bg-success/15 text-success"
                )}
              >
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(delta)}%
              </span>
              <span className="text-muted-foreground">{deltaLabel ?? "环比"}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50",
            accentMap[accent].split(" ").pop()
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
