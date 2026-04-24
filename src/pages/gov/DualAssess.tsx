import { AppLayout } from "@/components/AppLayout";
import { ClipboardCheck } from "lucide-react";

export default function DualAssess() {
  return (
    <AppLayout side="gov" title="双控考核" subtitle="能耗双控 / 碳排双控考核结果">
      <div className="panel p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <ClipboardCheck className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">双控考核看板</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          该模块正在规划设计中，将围绕能耗双控与碳排双控的考核指标、完成度与排名等维度提供可视化分析。
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/40 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          待设计 · Coming Soon
        </div>
      </div>
    </AppLayout>
  );
}
