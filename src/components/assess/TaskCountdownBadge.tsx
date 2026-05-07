import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/mocks/assessTasks";

interface Props {
  endDate: string;
  label?: string;
  className?: string;
}

export function TaskCountdownBadge({ endDate, label = "距任务结束", className }: Props) {
  const d = daysUntil(endDate);

  let tone = "bg-primary/10 text-primary border-primary/30";
  let text = `${label} ${d} 天`;
  if (d < 0) {
    tone = "bg-muted text-muted-foreground border-border";
    text = `已截止 ${Math.abs(d)} 天`;
  } else if (d === 0) {
    tone = "bg-warning/10 text-warning border-warning/30";
    text = "今日截止";
  } else if (d <= 7) {
    tone = "bg-warning/10 text-warning border-warning/30";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap",
        tone,
        className,
      )}
      title={`截止 ${endDate}`}
    >
      <Clock className="h-3 w-3" />
      {text}
      <span className="text-[10px] font-normal opacity-70 ml-1">截止 {endDate}</span>
    </span>
  );
}
