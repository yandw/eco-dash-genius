import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChangeRecord } from "@/mocks/assess";

interface Props {
  changes: ChangeRecord[];
  field: string;
}

export function ChangeBadge({ changes, field }: Props) {
  const c = changes.find((x) => x.field === field);
  if (!c) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive/20 text-destructive">
            <AlertCircle className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          <div className="space-y-1">
            <div>
              <span className="text-muted-foreground">原值：</span>
              <span className="line-through">{String(c.oldValue ?? "—")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">新值：</span>
              <span className="font-semibold text-destructive">{String(c.newValue ?? "—")}</span>
            </div>
            <div className="text-muted-foreground border-t pt-1 mt-1">
              {c.by} · {c.at}
            </div>
            <div>备注：{c.remark}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
