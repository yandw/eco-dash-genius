import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Tag,
  Download,
  FolderOpen,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
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
import { EnterpriseYearMatrix } from "@/components/archives/EnterpriseYearMatrix";
import { enterprises, ArchiveStatus } from "@/mocks/archives";

const CURRENT_YEAR = 2024;
const YEARS = [2024, 2025];

export default function Archives() {
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ArchiveStatus>("all");

  const districts = useMemo(
    () => Array.from(new Set(enterprises.map((e) => e.district))),
    [],
  );
  const industries = useMemo(
    () => Array.from(new Set(enterprises.map((e) => e.industry))),
    [],
  );

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const matchKw =
        !keyword.trim() ||
        e.name.includes(keyword.trim()) ||
        e.creditCode.includes(keyword.trim());
      const matchDistrict = district === "all" || e.district === district;
      const matchIndustry = industry === "all" || e.industry === industry;
      const matchStatus =
        statusFilter === "all" ||
        e.years.some((y) => y.year === CURRENT_YEAR && y.status === statusFilter);
      return matchKw && matchDistrict && matchIndustry && matchStatus;
    });
  }, [keyword, district, industry, statusFilter]);

  // KPI based on current year across ALL enterprises
  const kpi = useMemo(() => {
    const currentYears = enterprises.map(
      (e) => e.years.find((y) => y.year === CURRENT_YEAR)?.status ?? "pending",
    );
    const total = currentYears.length;
    const reported = currentYears.filter((s) => s !== "pending").length;
    const submitted = currentYears.filter((s) => s === "submitted").length;
    const approved = currentYears.filter((s) => s === "approved").length;
    const rejected = currentYears.filter((s) => s === "rejected").length;
    const rate = total ? Math.round((reported / total) * 100) : 0;
    return { total, reported, submitted, approved, rejected, rate };
  }, []);

  return (
    <AppLayout
      side="gov"
      title="节能管理档案"
      subtitle={`审核 ${CURRENT_YEAR} 年度全市重点用能企业节能档案，跟踪上报与整改进度`}
    >
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索企业名称 / 统一信用代码"
              className="pl-8 h-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="所属区" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="行业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部行业</SelectItem>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">本期状态：</span>
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
                  ? "h-7 bg-gradient-primary text-primary-foreground border-0"
                  : "h-7"
              }
              onClick={() => setStatusFilter(opt.v as any)}
            >
              {opt.l}
            </Button>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Tag className="h-3.5 w-3.5 mr-1" /> 标签
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setKeyword("");
                setDistrict("all");
                setIndustry("all");
                setStatusFilter("all");
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> 重置
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-3.5 w-3.5 mr-1" /> 导出节能档案
            </Button>
            <Button size="sm" className="h-8 bg-gradient-primary text-primary-foreground border-0">
              <FolderOpen className="h-3.5 w-3.5 mr-1" /> 文件中心
            </Button>
          </div>
        </div>
      </div>

      {/* 企业 × 年度矩阵 */}
      <EnterpriseYearMatrix rows={filtered} years={YEARS} currentYear={CURRENT_YEAR} />

      <div className="text-[11px] text-muted-foreground mt-3 px-1">
        共 {filtered.length} 家企业 · 点击单元格进入审核详情
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
