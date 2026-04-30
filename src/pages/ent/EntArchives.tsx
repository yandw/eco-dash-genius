import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowRight,
  History,
  Pencil,
  Send,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArchiveStatusBadge } from "@/components/archives/ArchiveStatusBadge";
import {
  enterprises,
  CURRENT_ENT_ID,
  ARCHIVE_STEPS,
  ArchiveStatus,
} from "@/mocks/archives";

export default function EntArchives() {
  const ent = enterprises.find((e) => e.id === CURRENT_ENT_ID)!;
  const [statusFilter, setStatusFilter] = useState<"all" | ArchiveStatus>("all");
  const [keyword, setKeyword] = useState("");

  const years = useMemo(
    () =>
      ent.years.filter(
        (y) =>
          (statusFilter === "all" || y.status === statusFilter) &&
          (keyword === "all" || String(y.year) === keyword),
      ),
    [ent.years, statusFilter, keyword],
  );

  const yearOptions = [2023, 2024, 2025, 2026, 2027];

  const kpi = useMemo(() => {
    const total = ent.years.length;
    const submitted = ent.years.filter((y) =>
      ["submitted", "approved"].includes(y.status),
    ).length;
    const rejected = ent.years.filter((y) => y.status === "rejected").length;
    const approved = ent.years.filter((y) => y.status === "approved").length;
    return { total, submitted, rejected, approved };
  }, [ent.years]);

  return (
    <AppLayout
      side="ent"
      title="节能档案"
      subtitle="按年度填报本企业节能管理档案，提交后由经信委进行审核"
    >
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="累计归档年度"
          value={kpi.total}
          unit="年"
          icon={Calendar}
          tone="primary"
        />
        <KpiCard
          label="已提交"
          value={kpi.submitted}
          unit="份"
          icon={Send}
          tone="primary"
        />
        <KpiCard
          label="已通过"
          value={kpi.approved}
          unit="份"
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="待整改退回"
          value={kpi.rejected}
          unit="份"
          icon={AlertOctagon}
          tone="danger"
        />
      </div>

      {/* 工具栏 */}
      <div className="panel p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="按年度搜索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="submitted">待审核</SelectItem>
            <SelectItem value="approved">已通过</SelectItem>
            <SelectItem value="rejected">已退回</SelectItem>
          </SelectContent>
        </Select>
        <Button
          asChild
          className="h-9 ml-auto bg-gradient-primary text-primary-foreground border-0"
        >
          <Link to={`/ent/archives/${new Date().getFullYear()}`}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            新建年度档案
          </Link>
        </Button>
      </div>

      {/* 年度档案卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {years.map((y) => {
          const completedCount = Object.values(y.detail.completed).filter(Boolean).length;
          const total = ARCHIVE_STEPS.length;
          const pct = Math.round((completedCount / total) * 100);
          return (
            <Link
              key={y.year}
              to={`/ent/archives/${y.year}`}
              className="panel p-5 hover:border-primary/50 hover:shadow-elevated transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-gradient">
                    {y.year}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">节能档案</div>
                </div>
                <ArchiveStatusBadge status={y.status} />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>填报完成度</span>
                  <span className="font-mono text-foreground">
                    {completedCount}/{total}
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  创建：<span className="font-mono">{y.createdAt || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <History className="h-3 w-3" />
                  最近更新：<span className="font-mono">{y.updatedAt || "—"}</span>
                </div>
                {y.reviewer && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    审核人：{y.reviewer}
                  </div>
                )}
              </div>

              {y.status === "rejected" && y.rejectReason && (
                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-[11px] text-destructive leading-relaxed line-clamp-2">
                  退回原因：{y.rejectReason}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {y.status === "rejected"
                    ? "立即整改"
                    : y.status === "draft"
                      ? "继续填报"
                      : y.status === "submitted"
                        ? "查看进度"
                        : "查看详情"}
                </span>
                <span className="text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  <Pencil className="h-3 w-3" /> 进入
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}

function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  unit: string;
  icon: any;
  tone: "primary" | "success" | "danger";
}) {
  const cls =
    tone === "success"
      ? "text-success bg-success/10"
      : tone === "danger"
        ? "text-destructive bg-destructive/10"
        : "text-primary bg-primary/10";
  return (
    <div className="panel p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-bold font-mono mt-0.5">
          {value}
          <span className="text-xs text-muted-foreground ml-1 font-sans font-normal">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
