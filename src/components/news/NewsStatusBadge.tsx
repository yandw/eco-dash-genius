import { CheckCircle2, FileEdit, EyeOff } from "lucide-react";
import { NewsStatus, STATUS_LABELS } from "@/mocks/news";
import { cn } from "@/lib/utils";

interface Props {
  status: NewsStatus;
  className?: string;
}

const STYLE: Record<NewsStatus, string> = {
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  draft: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  offline: "bg-zinc-400/10 text-zinc-500 border-zinc-400/30",
};

const ICON: Record<NewsStatus, React.ComponentType<{ className?: string }>> = {
  published: CheckCircle2,
  draft: FileEdit,
  offline: EyeOff,
};

export function NewsStatusBadge({ status, className }: Props) {
  const Icon = ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border",
        STYLE[status],
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}
