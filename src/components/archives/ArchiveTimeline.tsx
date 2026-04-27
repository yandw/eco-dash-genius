import { AuditTimelineItem } from "@/mocks/archives";
import { CheckCircle2, AlertOctagon, FileEdit, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  items: AuditTimelineItem[];
}

const colorMap = {
  info: "bg-primary/15 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  warn: "bg-warning/15 text-warning border-warning/30",
} as const;

const iconFor = (action: string, type: AuditTimelineItem["type"]) => {
  if (type === "success") return CheckCircle2;
  if (type === "danger") return AlertOctagon;
  if (action.includes("提交")) return Send;
  return FileEdit;
};

export function ArchiveTimeline({ items }: Props) {
  if (!items.length)
    return (
      <div className="text-xs text-muted-foreground italic">尚无操作记录</div>
    );
  return (
    <ol className="relative flex flex-wrap gap-4">
      {items.map((it, idx) => {
        const Icon = iconFor(it.action, it.type);
        return (
          <li key={idx} className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-7 w-7 rounded-full border flex items-center justify-center shrink-0",
                  colorMap[it.type],
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              {idx < items.length - 1 && (
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
            <div className="mt-2">
              <div className="text-xs font-medium text-foreground">{it.action}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{it.actor}</div>
              <div className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                {it.time}
              </div>
              {it.comment && (
                <div
                  className={cn(
                    "mt-2 text-[11px] rounded-md border px-2 py-1.5 leading-relaxed",
                    it.type === "danger"
                      ? "border-destructive/30 bg-destructive/5 text-destructive"
                      : "border-success/30 bg-success/5 text-success",
                  )}
                >
                  {it.comment}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
