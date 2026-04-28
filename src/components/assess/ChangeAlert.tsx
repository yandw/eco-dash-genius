import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ChangeRecord } from "@/mocks/assess";

interface Props {
  changes: ChangeRecord[];
}

export function ChangeAlert({ changes }: Props) {
  if (!changes.length) return null;
  const latest = changes[changes.length - 1];
  return (
    <Alert className="border-warning/40 bg-warning/10 mb-4">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning text-sm">区级已修改本企业目标值</AlertTitle>
      <AlertDescription className="text-xs text-foreground/80">
        {latest.by} 于 {latest.at} 修改了
        <span className="font-mono mx-1 px-1 rounded bg-muted">{latest.field}</span>
        （{String(latest.oldValue ?? "—")} → <span className="font-semibold text-destructive">{String(latest.newValue ?? "—")}</span>），备注：{latest.remark}
      </AlertDescription>
    </Alert>
  );
}
