import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Target, TrendingDown, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== 总体监控顶部 KPI =====
const overviewKpis = [
  {
    label: "十四五规上工业增加值能耗下降率",
    value: "-14.0",
    unit: "%",
    icon: Target,
    color: "hsl(217 91% 50%)",
  },
  {
    label: "全市累计下降率",
    value: "-12.3",
    unit: "%",
    icon: TrendingDown,
    color: "hsl(40 95% 55%)",
  },
  {
    label: "全市目标完成率",
    value: "87.9",
    unit: "%",
    icon: CheckCircle2,
    color: "hsl(217 91% 50%)",
  },
];

const overviewLag = [
  { label: "区县滞后情况", lag: 35.29, num: 6, denom: 17 },
  { label: "集团滞后情况(含通信业)", lag: 15.38, num: 4, denom: 26 },
  { label: "百千家企业滞后情况", lag: 41.67, num: 5, denom: 12 },
];

type StatusKey = "全部" | "提前" | "适中" | "滞后" | "严重滞后";
const statusList: StatusKey[] = ["全部", "提前", "适中", "滞后", "严重滞后"];

interface RowData {
  name: string;
  goal: number | null;
  actual: number | null;
  progress: number | null;
  status: Exclude<StatusKey, "全部">;
}

// ===== 区县 =====
const districtRows: RowData[] = [
  { name: "宝山区", goal: -14, actual: -17.36, progress: 124, status: "提前" },
  { name: "崇明区", goal: -14, actual: 2.42, progress: -17, status: "严重滞后" },
  { name: "奉贤区", goal: -14, actual: -12.16, progress: 87, status: "提前" },
  { name: "虹口区", goal: -14, actual: 5.24, progress: -37, status: "严重滞后" },
  { name: "黄浦区", goal: -13, actual: -14.84, progress: 114, status: "提前" },
  { name: "嘉定区", goal: -13, actual: -5.53, progress: 43, status: "适中" },
  { name: "金山区", goal: -14, actual: -5.87, progress: 42, status: "适中" },
  { name: "静安区", goal: -13, actual: -8.92, progress: 69, status: "提前" },
  { name: "闵行区", goal: -14, actual: -3.21, progress: 23, status: "滞后" },
  { name: "浦东新区", goal: -14, actual: -10.85, progress: 78, status: "提前" },
  { name: "普陀区", goal: -13, actual: -2.18, progress: 17, status: "滞后" },
  { name: "青浦区", goal: -14, actual: -8.47, progress: 60, status: "适中" },
  { name: "松江区", goal: -14, actual: -6.91, progress: 49, status: "适中" },
  { name: "徐汇区", goal: -13, actual: -11.27, progress: 87, status: "提前" },
  { name: "杨浦区", goal: -13, actual: 1.82, progress: -14, status: "严重滞后" },
  { name: "长宁区", goal: -13, actual: -7.42, progress: 57, status: "适中" },
  { name: "中心城区", goal: -13, actual: -4.18, progress: 32, status: "适中" },
];

// ===== 集团 =====
const groupRows: RowData[] = [
  { name: "东方国际（集团）有限公司", goal: -14, actual: -0.76, progress: 5, status: "滞后" },
  { name: "光明食品(集团)有限公司", goal: -14, actual: -0.72, progress: 5, status: "滞后" },
  { name: "华能国际电力股份有限公司上海分公司", goal: null, actual: -18.19, progress: 0, status: "适中" },
  { name: "上海城投（集团）有限公司", goal: null, actual: -15.77, progress: 0, status: "适中" },
  { name: "上海电力股份有限公司", goal: null, actual: -14.73, progress: 0, status: "适中" },
  { name: "上海电气控股集团有限公司", goal: -14, actual: 4.12, progress: -29, status: "严重滞后" },
  { name: "上海航天局", goal: -13, actual: -18.25, progress: 140, status: "提前" },
  { name: "上海华谊（集团）公司", goal: -14, actual: -8.42, progress: 60, status: "适中" },
  { name: "上海建工(集团)总公司", goal: -13, actual: -10.18, progress: 78, status: "提前" },
  { name: "上海机场(集团)有限公司", goal: -13, actual: -2.41, progress: 19, status: "滞后" },
  { name: "上海国盛(集团)有限公司", goal: -14, actual: -11.85, progress: 85, status: "提前" },
  { name: "上海纺织(集团)有限公司", goal: -14, actual: -6.27, progress: 45, status: "适中" },
  { name: "上海仪电(集团)有限公司", goal: -13, actual: -9.18, progress: 71, status: "提前" },
  { name: "上海现代建筑设计(集团)", goal: -13, actual: -3.58, progress: 28, status: "滞后" },
  { name: "上海轻工控股(集团)公司", goal: -14, actual: -7.94, progress: 57, status: "适中" },
  { name: "上海医药(集团)有限公司", goal: -14, actual: -12.48, progress: 89, status: "提前" },
];

// ===== 百千家 =====
const bqRows: RowData[] = [
  { name: "宝山钢铁股份有限公司", goal: -15, actual: -0.55, progress: 4, status: "滞后" },
  { name: "中国石化上海石油化工股份有限公司", goal: -15, actual: -5.67, progress: 38, status: "滞后" },
  { name: "上海赛科石油化工有限责任公司", goal: -15, actual: 9.77, progress: -65, status: "严重滞后" },
  { name: "中国石化上海高桥石油化工有限公司", goal: -15, actual: 7.5, progress: -50, status: "严重滞后" },
  { name: "国网上海市电力公司", goal: null, actual: 0, progress: 0, status: "适中" },
  { name: "上海华谊能源化工有限公司", goal: null, actual: 0, progress: 0, status: "适中" },
  { name: "宝武碳业科技股份有限公司", goal: -14, actual: -6.62, progress: 47, status: "适中" },
  { name: "上海赛科聚烯烃有限公司", goal: -14, actual: -8.91, progress: 64, status: "适中" },
  { name: "中国商飞上海飞机制造", goal: -13, actual: -10.42, progress: 80, status: "提前" },
  { name: "上海大众动力总成有限公司", goal: -13, actual: -3.18, progress: 24, status: "滞后" },
  { name: "华虹半导体（上海）有限公司", goal: -13, actual: -7.85, progress: 60, status: "适中" },
  { name: "中芯国际集成电路制造", goal: -13, actual: -9.41, progress: 72, status: "提前" },
];

function StatusTag({ s }: { s: RowData["status"] }) {
  const map: Record<RowData["status"], string> = {
    提前: "bg-success/15 text-success border-success/30",
    适中: "bg-primary/15 text-primary border-primary/30",
    滞后: "bg-warning/15 text-warning border-warning/30",
    严重滞后: "bg-destructive/15 text-destructive border-destructive/30",
  };
  const labelMap: Record<RowData["status"], string> = {
    提前: "进度提前",
    适中: "进度适中",
    滞后: "进度滞后",
    严重滞后: "严重滞后",
  };
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border", map[s])}>
      {labelMap[s]}
    </span>
  );
}

interface ListPanelProps {
  badge: string;
  title: string;
  unitLabel: string;
  rows: RowData[];
  status: StatusKey;
}

function ListPanel({ badge, title, unitLabel, rows, status }: ListPanelProps) {
  const filtered = useMemo(
    () => (status === "全部" ? rows : rows.filter((r) => r.status === status)),
    [rows, status],
  );

  return (
    <div className="panel p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[11px] font-semibold">
            {badge}
          </span>
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">*累计数据</span>
      </div>

      <div className="flex-1 overflow-auto -mx-1">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-muted-foreground border-b border-border/50">
              <th className="text-left py-2 px-2 font-medium w-[40%]">{unitLabel}</th>
              <th className="text-right py-2 px-1.5 font-medium">十四五产值单耗<br />下降率目标(%)</th>
              <th className="text-right py-2 px-1.5 font-medium">累计产值单耗下<br />降率实际值(%)</th>
              <th className="text-right py-2 px-2 font-medium">完成进度(%)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const negProgress = r.progress !== null && r.progress < 0;
              return (
                <tr key={i} className="border-b border-border/30 hover:bg-accent/20">
                  <td className="py-2 px-2 text-foreground/90">{r.name}</td>
                  <td className="py-2 px-1.5 text-right tabular-nums">
                    {r.goal === null ? <span className="text-muted-foreground">/</span> : r.goal}
                  </td>
                  <td className={cn("py-2 px-1.5 text-right tabular-nums", r.actual !== null && r.actual > 0 && "text-destructive")}>
                    {r.actual === null ? "—" : r.actual}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span className={cn("tabular-nums font-semibold", negProgress ? "text-destructive" : "text-primary")}>
                        {r.progress}
                      </span>
                      <StatusTag s={r.status} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground text-[11px]">
                  无符合筛选的数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DualAssess() {
  const [year, setYear] = useState("累计数据");
  const [status, setStatus] = useState<StatusKey>("全部");

  return (
    <AppLayout side="gov" title="双控考核" subtitle="全市规上企业十四五能耗双控跟踪">
      <div className="flex flex-col gap-3">
        {/* ===== 顶部：全市能耗双控总体完成情况实时监控 ===== */}
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-base">›</span>
            <h3 className="text-sm font-semibold">全市能耗双控总体完成情况实时监控</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {overviewKpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="rounded-lg p-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/15 flex items-center gap-3"
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${k.color}1a` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: k.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>
                        {k.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{k.unit}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {k.label}
                    </div>
                  </div>
                </div>
              );
            })}

            {overviewLag.map((l) => (
              <div
                key={l.label}
                className="rounded-lg p-3 bg-gradient-to-br from-warning/5 to-transparent border border-warning/15"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground">滞后率</span>
                  <span className="text-[11px] font-semibold text-warning tabular-nums">
                    {l.lag}%
                  </span>
                </div>
                <div className="h-1 bg-muted/40 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-warning/70 to-warning"
                    style={{ width: `${l.lag}%` }}
                  />
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-foreground tabular-nums">{l.num}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">/{l.denom}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{l.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 管理对象跟踪 ===== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-base">›</span>
            <h3 className="text-sm font-semibold">管理对象跟踪</h3>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">年份选择：</span>
              <button className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border/60 bg-card text-foreground hover:border-primary/40">
                {year}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">完成状态：</span>
              <div className="flex rounded border border-border/60 overflow-hidden">
                {statusList.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] transition-colors",
                      status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-[520px]">
          <ListPanel
            badge="区县"
            title="十四五期间能耗双控完成情况"
            unitLabel="区县"
            rows={districtRows}
            status={status}
          />
          <ListPanel
            badge="集团"
            title="十四五期间能耗双控完成情况(含通讯业)"
            unitLabel="集团"
            rows={groupRows}
            status={status}
          />
          <ListPanel
            badge="百千家"
            title="企业十四五期间能耗双控完成情况"
            unitLabel="企业"
            rows={bqRows}
            status={status}
          />
        </div>
      </div>
    </AppLayout>
  );
}
