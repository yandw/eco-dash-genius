import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Circle } from "lucide-react";
import type { FilingStatus } from "@/mocks/posts";

const config: Record<FilingStatus, { label: string; className: string; Icon: typeof Check }> = {
  complete: {
    label: "已备案",
    className: "bg-success/15 text-success border-success/40",
    Icon: Check,
  },
  partial: {
    label: "待完善",
    className: "bg-warning/15 text-warning border-warning/40",
    Icon: AlertCircle,
  },
  empty: {
    label: "未备案",
    className: "bg-muted text-muted-foreground border-border",
    Icon: Circle,
  },
};

export function PostStatusBadge({ status, label }: { status: FilingStatus; label?: string }) {
  const c = config[status];
  return (
    <Badge variant="outline" className={`${c.className} border gap-1 text-[11px] font-medium`}>
      <c.Icon className="h-3 w-3" />
      {label ?? c.label}
    </Badge>
  );
}
