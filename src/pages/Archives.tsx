import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Download,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  X,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnterpriseYearMatrix } from "@/components/archives/EnterpriseYearMatrix";
import { ArchiveFilterDrawer } from "@/components/archives/ArchiveFilterDrawer";
import { enterprises, ArchiveStatus, ArchiveStatusLabel } from "@/mocks/archives";
import {
  AdvancedFilters,
  countAdvancedFilters,
  emptyAdvancedFilters,
  findGroupLabel,
} from "@/mocks/archiveFilters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENT_YEAR = 2024;
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export default function Archives() {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ArchiveStatus>("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportYear, setExportYear] = useState<number>(CURRENT_YEAR);
  const [filterOpen, setFilterOpen] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(emptyAdvancedFilters());

  const advancedCount = countAdvancedFilters(advanced);

  const handleExport = () => {
    const header = ["序号", "企业名称", "统一社会信用代码", "行业", "所属区", `${exportYear}年度状态`];
    const lines = enterprises.map((e, idx) => {
      const yr = e.years.find((y) => y.year === exportYear);
      const status = yr ? ArchiveStatusLabel[yr.status] : "未上报";
      return [idx + 1, e.name, e.creditCode, e.industry, e.district, status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csv = "\uFEFF" + [header.join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `节能档案_${exportYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportOpen(false);
    toast.success(`${exportYear} 年度节能档案已导出`);
  };

  const removeAdvanced = (groupKey: string, opt: string) => {
    setAdvanced((prev) => ({
      ...prev,
      [groupKey]: (prev[groupKey] ?? []).filter((x) => x !== opt),
    }));
  };

  const clearAll = () => {
    setKeyword("");
    setStatusFilter("all");
    setAdvanced(emptyAdvancedFilters());
  };

  // 已知能与 mock 数据对接的两个维度：主管区/上级区县 → district，行业 → industry
  const districtSelected = useMemo(() => {
    const set = new Set<string>([
      ...(advanced.govDistrict ?? []),
      ...(advanced.superior ?? []),
    ]);
    return set;
  }, [advanced]);
  const industrySelected = useMemo(
    () => new Set<string>(advanced.industry ?? []),
    [advanced],
  );

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const matchKw =
        !keyword.trim() ||
        e.name.includes(keyword.trim()) ||
        e.creditCode.includes(keyword.trim());
      const matchDistrict = districtSelected.size === 0 || districtSelected.has(e.district);
      const matchIndustry = industrySelected.size === 0 || industrySelected.has(e.industry);
      const matchStatus =
        statusFilter === "all" ||
        e.years.some((y) => y.year === selectedYear && y.status === statusFilter);
      return matchKw && matchDistrict && matchIndustry && matchStatus;
    });
  }, [keyword, districtSelected, industrySelected, statusFilter, selectedYear]);

  // KPI based on selected year across ALL enterprises
  const kpi = useMemo(() => {
    const currentYears = enterprises.map(
      (e) => e.years.find((y) => y.year === selectedYear)?.status ?? "pending",
    );
    const total = currentYears.length;
    const reported = currentYears.filter((s) => s !== "pending").length;
    const submitted = currentYears.filter((s) => s === "submitted").length;
    const approved = currentYears.filter((s) => s === "approved").length;
    const rejected = currentYears.filter((s) => s === "rejected").length;
    const rate = total ? Math.round((reported / total) * 100) : 0;
    return { total, reported, submitted, approved, rejected, rate };
  }, [selectedYear]);

  return (
    <AppLayout
      side="gov"
      title="节能管理档案"
      subtitle={`审核 ${CURRENT_YEAR} 年度全市重点用能企业节能档案，跟踪上报与整改进度`}
    >
      {/* 报告年度选择 */}
      <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
          报告年度
        </span>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <Button
              key={y}
              size="sm"
              variant={selectedYear === y ? "default" : "outline"}
              className={
                selectedYear === y
                  ? "h-8 min-w-[68px] bg-gradient-primary text-primary-foreground border-0"
                  : "h-8 min-w-[68px]"
              }
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </Button>
          ))}
        </div>
        {selectedYear === CURRENT_YEAR && (
          <span className="text-[11px] text-primary ml-1">本期</span>
        )}
      </div>

      {/* KPI 行 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <KpiCard label="应报企业" value={kpi.total} unit="家" icon={Building2} tone="primary" />
        <KpiCard label="已上报" value={kpi.reported} unit="家" icon={TrendingUp} tone="primary" />
        <KpiCard
          label="上报率"
          value={kpi.rate}
          unit="%"
          icon={TrendingUp}
          tone="primary"
          highlight
        />
        <KpiCard label="待我审核" value={kpi.submitted} unit="家" icon={Clock} tone="warning" />
        <KpiCard label="已通过" value={kpi.approved} unit="家" icon={CheckCircle2} tone="success" />
        <KpiCard label="已退回" value={kpi.rejected} unit="家" icon={AlertOctagon} tone="danger" />
      </div>

      {/* 筛选区 */}
      <div className="panel p-4 mb-4 space-y-3">
        {/* 顶部快搜行 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索企业名称 / 统一信用代码"
              className="pl-8 h-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground ml-2">本期状态：</span>
          {(
            [
              { v: "all", l: "全部" },
              { v: "submitted", l: "待审核" },
              { v: "approved", l: "已通过" },
              { v: "rejected", l: "已退回" },
              { v: "pending", l: "未上报" },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.v}
              variant={statusFilter === opt.v ? "default" : "outline"}
              size="sm"
              className={
                statusFilter === opt.v
                  ? "h-8 bg-gradient-primary text-primary-foreground border-0"
                  : "h-8"
              }
              onClick={() => setStatusFilter(opt.v as any)}
            >
              {opt.l}
            </Button>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              高级筛选
              {advancedCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary-foreground/20 text-primary-foreground text-[10px] font-mono px-1">
                  {advancedCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={clearAll}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> 重置
            </Button>
            <Button
              size="sm"
              className="h-8 bg-success text-success-foreground hover:bg-success/90 border-0"
              onClick={() => setExportOpen(true)}
            >
              <Download className="h-3.5 w-3.5 mr-1" /> 导出节能档案
            </Button>
          </div>
        </div>

        {/* 已选条件 chips */}
        {advancedCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
            <span className="text-[11px] text-muted-foreground mr-1">已选条件：</span>
            {Object.entries(advanced).flatMap(([gKey, opts]) =>
              opts.map((opt) => (
                <span
                  key={`${gKey}-${opt}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/30 text-[11px]"
                >
                  <span className="text-muted-foreground">{findGroupLabel(gKey)}:</span>
                  <span className="font-medium">{opt}</span>
                  <button
                    type="button"
                    onClick={() => removeAdvanced(gKey, opt)}
                    className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`移除 ${opt}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )),
            )}
            <button
              type="button"
              onClick={() => setAdvanced(emptyAdvancedFilters())}
              className="ml-1 text-[11px] text-muted-foreground hover:text-destructive underline-offset-2 hover:underline"
            >
              清空全部
            </button>
          </div>
        )}
      </div>


      {/* 企业上报明细 */}
      <EnterpriseYearMatrix rows={filtered} year={selectedYear} />

      <div className="text-[11px] text-muted-foreground mt-3 px-1">
        共 {filtered.length} 家企业 · 点击单元格进入审核详情
      </div>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              导出节能档案
            </DialogTitle>
            <DialogDescription>
              选择需要导出的年度，确认后浏览器将自动下载 CSV 文件。
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="text-xs text-muted-foreground mb-1.5">
              <span className="text-destructive">*</span> 导出年度
            </div>
            <Select
              value={String(exportYear)}
              onValueChange={(v) => setExportYear(Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y} 年度
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleExport}
              className="bg-gradient-primary text-primary-foreground border-0"
            >
              <Download className="h-3.5 w-3.5 mr-1" /> 确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ArchiveFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        value={advanced}
        onApply={setAdvanced}
      />
    </AppLayout>
  );
}

function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  icon: any;
  tone: "primary" | "success" | "warning" | "danger";
  highlight?: boolean;
}) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
  };
  return (
    <div className={`panel p-3 flex items-center gap-3 ${highlight ? "ring-1 ring-primary/30" : ""}`}>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${colorMap[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="text-lg font-bold font-mono leading-none mt-1">
          {value}
          <span className="text-[10px] text-muted-foreground ml-1 font-sans font-normal">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
