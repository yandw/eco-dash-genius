import { AppLayout } from "@/components/AppLayout";
import { Wrench } from "lucide-react";

export default function EquipBench() {
  return (
    <AppLayout side="gov" title="设备对标" subtitle="重点用能设备能效对标分析">
      <div className="panel p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">设备对标看板</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          该模块正在规划设计中，将围绕重点用能设备的能效水平、对标基准与改造潜力等维度提供可视化分析。
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/40 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          待设计 · Coming Soon
        </div>
      </div>
    </AppLayout>
  );
}
