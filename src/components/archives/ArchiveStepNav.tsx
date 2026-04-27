import { CheckCircle2, AlertCircle, Circle, MessageSquareWarning } from "lucide-react";
import { ARCHIVE_STEPS, StepKey } from "@/mocks/archives";
import { cn } from "@/lib/utils";

interface Props {
  active: StepKey;
  onChange: (key: StepKey) => void;
  completed: Record<StepKey, boolean>;
  annotationsByStep?: Partial<Record<StepKey, number>>;
}

export function ArchiveStepNav({ active, onChange, completed, annotationsByStep = {} }: Props) {
  return (
    <ol className="space-y-1.5">
      {ARCHIVE_STEPS.map((step, idx) => {
        const isActive = step.key === active;
        const isDone = completed[step.key];
        const issues = annotationsByStep[step.key] ?? 0;
        return (
          <li key={step.key}>
            <button
              type="button"
              onClick={() => onChange(step.key)}
              className={cn(
                "w-full text-left rounded-lg border px-3 py-3 transition-all flex gap-3 items-start group",
                isActive
                  ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
                  : "border-border/60 hover:border-primary/40 hover:bg-muted/40",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center text-xs font-mono shrink-0 border",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground border-transparent"
                    : isDone
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-muted text-muted-foreground border-border",
                )}
              >
                {issues > 0 ? (
                  <MessageSquareWarning className="h-4 w-4" />
                ) : isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive ? (
                  <Circle className="h-4 w-4" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {step.title}
                  </span>
                  {issues > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                      {issues} 条退回
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {step.desc}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
