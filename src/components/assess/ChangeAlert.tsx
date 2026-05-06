import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ChangeRecord } from "@/mocks/assess";

interface Props {
  changes: ChangeRecord[];
}

export function ChangeAlert({ changes }: Props) {
  if (!changes.length) return null;
  return (
    <Alert className="border-amber-400/50 bg-amber-50 dark:bg-amber-500/10 mb-4">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-700 dark:text-amber-300 text-sm">中心负责人已调整本企业 2026 年碳排放目标</AlertTitle>
      <AlertDescription className="text-xs text-foreground/80">
        最终目标以中心调整后的值为准。
      </AlertDescription>
    </Alert>
  );
}
