import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = "pass" | "fail" | "neutral" | "done" | "undone" | "pending";

const styles: Record<Variant, string> = {
  pass: "bg-success/15 text-success border-success/30",
  done: "bg-success/15 text-success border-success/30",
  fail: "bg-destructive/15 text-destructive border-destructive/30",
  undone: "bg-destructive/15 text-destructive border-destructive/30",
  neutral: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/15 text-warning border-warning/30",
};

interface Props {
  value: string;
  className?: string;
}

export function PassBadge({ value, className }: Props) {
  let v: Variant = "neutral";
  if (value === "达标" || value === "完成" || value === "已考核" || value === "已完成" || value === "完成考核") v = "pass";
  else if (value === "未达标" || value === "未完成") v = "fail";
  else if (value === "考核中" || value === "进行中" || value === "待考核" || value === "待提交") v = "pending";
  else if (value === "#VALUE!") v = "fail";

  return (
    <Badge variant="outline" className={cn("border font-medium", styles[v], className)}>
      {value}
    </Badge>
  );
}
