import { LucideIcon } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import type { UserSide } from "@/components/AppSidebar";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: string[];
  side?: UserSide;
}

export function PlaceholderPage({ title, subtitle, icon: Icon, features, side }: PlaceholderPageProps) {
  return (
    <AppLayout title={title} subtitle={subtitle} side={side}>
      <div className="panel-glow p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary shadow-glow mb-5">
            <Icon className="h-7 w-7 text-primary-foreground" />
          </div>

          <h2 className="text-xl font-semibold mb-2">{title} · 模块规划中</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            该模块的具体功能与字段定义待业务方确认。下方为预设的核心能力清单，可在后续迭代中逐项实现。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md border border-border/60 bg-card/60 p-3"
              >
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shadow-glow shrink-0" />
                <span className="text-xs text-foreground/90">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90">
              开始配置
            </Button>
            <Button variant="outline" className="border-border/60">
              查看示例数据
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["待办事项", "最近更新", "数据接入"].map((t) => (
          <div key={t} className="panel p-5">
            <h3 className="text-sm font-semibold mb-3">{t}</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-border/40 last:border-0">
                  <span className="text-muted-foreground">占位条目 {i}</span>
                  <span className="font-mono text-muted-foreground/60">--</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
