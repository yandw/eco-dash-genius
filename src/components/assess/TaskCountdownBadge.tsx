import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil, formatCnDate } from "@/mocks/assessTasks";

interface Props {
  endDate: string;
  className?: string;
}

export function TaskCountdownBadge({ endDate, className }: Props) {
  const d = daysUntil(endDate);
  const cn_date = formatCnDate(endDate);

  let tone = "text-primary";
  let node: React.ReactNode;
  if (d < 0) {
    tone = "text-muted-foreground";
    node = (
      <>
        <span className="font-semibold">{cn_date}</span>
        <span> 任务已截止 </span>
        <span className="font-semibold">{Math.abs(d)}</span>
        <span> 天</span>
      </>
    );
  } else if (d === 0) {
    tone = "text-warning";
    node = (
      <>
        <span className="font-semibold">{cn_date}</span>
        <span> 任务今日截止</span>
      </>
    );
  } else {
    if (d <= 7) tone = "text-warning";
    node = (
      <>
        <span>距 </span>
        <span className="font-semibold">{cn_date}</span>
        <span> 任务结束截止还剩 </span>
        <span className="font-semibold">{d}</span>
        <span> 天</span>
      </>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs whitespace-nowrap",
        tone,
        className,
      )}
      title={`截止 ${endDate}`}
    >
      <Clock className="h-3.5 w-3.5" />
      {node}
    </span>
  );
}
