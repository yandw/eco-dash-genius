import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children?: ReactNode;
  value?: string;
  readOnly?: boolean;
  annotation?: ReactNode;
  className?: string;
}

export function ArchiveField({
  label,
  required,
  hint,
  children,
  value,
  readOnly,
  annotation,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {required && <span className="text-destructive">*</span>}
        <span>{label}</span>
        {hint && <span className="text-muted-foreground/60">（{hint}）</span>}
      </div>
      {readOnly ? (
        <div className="text-sm font-medium text-foreground border-b border-border/70 pb-1.5 min-h-[28px]">
          {value || <span className="text-muted-foreground/60">—</span>}
        </div>
      ) : (
        children
      )}
      {annotation}
    </div>
  );
}

export function ArchiveSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span className="h-4 w-1 rounded bg-gradient-primary" />
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}
