import {
  FileEdit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  CalendarRange,
  Gauge,
  FolderArchive,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statCards = [
  { label: "待填报任务", value: "5", icon: FileEdit, accent: "text-warning", bg: "from-warning/10 to-warning/5" },
  { label: "审核中", value: "2", icon: Clock, accent: "text-primary", bg: "from-primary/10 to-primary/5" },
  { label: "已通过", value: "18", icon: CheckCircle2, accent: "text-success", bg: "from-success/10 to-success/5" },
  { label: "被退回", value: "1", icon: AlertCircle, accent: "text-destructive", bg: "from-destructive/10 to-destructive/5" },
];

const todoTasks = [
  { id: 1, title: "2025年度节能报告填报", due: "2025-05-31", progress: 45, type: "年报", urgent: true },
  { id: 2, title: "2025年Q2 能源限额季度报送", due: "2025-04-30", progress: 80, type: "限额", urgent: true },
  { id: 3, title: "2024年度绿色制造自评价", due: "2025-06-15", progress: 0, type: "申报", urgent: false },
  { id: 4, title: "重点用能设备清单更新", due: "2025-05-10", progress: 60, type: "档案", urgent: false },
  { id: 5, title: "能源计量器具年度校验记录", due: "2025-05-20", progress: 30, type: "档案", urgent: false },
];

const recentSubmissions = [
  { title: "2025年3月 月度能耗报告", time: "2025-04-08 14:22", status: "已通过" as const },
  { title: "2025年Q1 限额执行报告", time: "2025-04-05 10:11", status: "审核中" as const },
  { title: "节能技改项目立项备案", time: "2025-03-28 16:40", status: "已通过" as const },
  { title: "2024年度节能报告（补充）", time: "2025-03-20 09:08", status: "已退回" as const },
];

const quickEntries = [
  { label: "年度报告填报", to: "/ent/report-yearly", icon: CalendarRange },
  { label: "限额报告填报", to: "/ent/energy-quota", icon: Gauge },
  { label: "节能档案", to: "/ent/archives", icon: FolderArchive },
  { label: "文件下载", to: "/ent/downloads", icon: Download },
];

const statusColor: Record<string, string> = {
  已通过: "bg-success/15 text-success border-success/30",
  审核中: "bg-primary/15 text-primary border-primary/30",
  已退回: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function EntDashboard() {
  return (
    <AppLayout
      side="ent"
      title="我的工作台"
      subtitle="上海某某新材料股份有限公司 · 待办事项与填报进度概览"
    >
      {/* 顶部统计卡 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`panel p-5 bg-gradient-to-br ${s.bg} relative overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-card flex items-center justify-center ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* 待办任务 */}
        <div className="lg:col-span-2 panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">待办填报任务</h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              查看全部 <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {todoTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
                      {t.type}
                    </Badge>
                    {t.urgent && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-destructive/15 text-destructive border-destructive/30 border">
                        紧急
                      </Badge>
                    )}
                    <span className="text-sm font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={t.progress} className="h-1.5 flex-1 max-w-[200px]" />
                    <span className="text-[11px] text-muted-foreground font-mono">{t.progress}%</span>
                    <span className="text-[11px] text-muted-foreground">截止 {t.due}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 h-8">
                  继续填报
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 最近提交 */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">最近提交</h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              历史 <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((s, i) => (
              <div key={i} className="flex flex-col gap-1.5 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-snug">{s.title}</span>
                  <Badge className={`text-[10px] shrink-0 border ${statusColor[s.status]}`}>{s.status}</Badge>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="panel p-5">
        <h3 className="text-base font-semibold mb-4">快捷入口</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickEntries.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border border-border/60 bg-card hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
                <q.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
