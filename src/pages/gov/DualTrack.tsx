import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Factory, TrendingDown, Award, Flame, Zap, Leaf, Wind } from "lucide-react";

// ===== 管理企业规模 =====
const scaleCards = [
  { label: "企业总数", value: 545, unit: "家", icon: Building2, color: "hsl(217 91% 45%)", bg: "hsl(217 91% 55% / 0.12)" },
  { label: "两高", value: 98, unit: "家", icon: Flame, color: "hsl(0 75% 60%)", bg: "hsl(0 75% 60% / 0.12)" },
  { label: "限额", value: 93, unit: "家", icon: TrendingDown, color: "hsl(40 95% 55%)", bg: "hsl(40 95% 55% / 0.12)" },
  { label: "百千家", value: 8, unit: "家", icon: Award, color: "hsl(217 91% 45%)", bg: "hsl(217 91% 55% / 0.12)" },
];

// ===== 行业分布 =====
const industries = [
  { name: "纺织业", value: 5, pct: 1 },
  { name: "电信、广播电视...", value: 5, pct: 1 },
  { name: "酒、饮料和精制...", value: 5, pct: 1 },
  { name: "印刷和记录媒介...", value: 4, pct: 1 },
  { name: "石油、煤炭及其...", value: 4, pct: 1 },
  { name: "黑色金属冶炼和...", value: 4, pct: 1 },
  { name: "造纸和纸制品业", value: 4, pct: 1 },
  { name: "专业技术服务业", value: 4, pct: 1 },
  { name: "农副食品加工业", value: 4, pct: 1 },
  { name: "其他", value: 4, pct: 1 },
];
const industryColors = [
  "hsl(217 91% 45%)", "hsl(217 91% 55%)", "hsl(265 85% 70%)", "hsl(217 91% 55%)",
  "hsl(265 85% 65%)", "hsl(217 91% 45%)", "hsl(217 80% 75%)", "hsl(217 91% 55%)",
  "hsl(265 80% 75%)", "hsl(220 15% 60%)",
];

// ===== 区县分布统计 =====
const districtRows = [
  { idx: 1, name: "浦东新区", count: 117, energy: 325.239, carbon: 996.268 },
  { idx: 2, name: "嘉定区", count: 64, energy: 101.256, carbon: 195.676 },
  { idx: 3, name: "金山区", count: 56, energy: 90.241, carbon: 207.049 },
  { idx: 4, name: "闵行区", count: 49, energy: 125.342, carbon: 303.787 },
  { idx: 5, name: "松江区", count: 46, energy: 68.591, carbon: 146.062 },
];

// ===== 月度关键数据 (能碳指标) =====
const monthlyKpi = [
  { label: "累计碳排放量", value: "2,386.3", unit: "万tCO2", icon: Factory, color: "hsl(217 91% 45%)" },
  { label: "累计综合能耗(等价值)", value: "954.5", unit: "万tce", icon: Flame, color: "hsl(217 91% 45%)" },
  { label: "累计电耗", value: "97.0", unit: "亿kWh", icon: Zap, color: "hsl(217 91% 45%)" },
  { label: "累计绿色电力/可再生/绿证消耗", value: "24.8", unit: "亿kWh", icon: Wind, color: "hsl(265 85% 65%)" },
];

// ===== 年度关键数据 =====
const yearlyKpi = [
  { label: "累计碳排放量", value: "14,506.4", unit: "万tCO2e", icon: Factory, color: "hsl(217 91% 45%)" },
  { label: "累计综合能耗(等价值)", value: "4,326.9", unit: "万tce", icon: Flame, color: "hsl(217 91% 45%)" },
  { label: "累计电耗", value: "601.1", unit: "亿kWh", icon: Zap, color: "hsl(217 91% 45%)" },
  { label: "累计绿色电力/可再生/绿证消耗", value: "80.5", unit: "亿kWh", icon: Wind, color: "hsl(265 85% 65%)" },
];

// 月度趋势数据
const monthlyTrend = Array.from({ length: 12 }).map((_, i) => {
  const m = i + 1;
  if (m <= 3) {
    return {
      m: `${m}`,
      energy: [180, 580, 820][m - 1],
      carbon: [380, 950, 1380][m - 1],
    };
  }
  return { m: `${m}`, energy: 0, carbon: 0 };
});

// 年度趋势数据
const yearlyTrend = Array.from({ length: 12 }).map((_, i) => {
  const y = 2013 + i;
  return {
    y: `${y}年`,
    energy: 4000 + Math.round(Math.sin(i / 2) * 400) - i * 10,
    carbon: 14000 + Math.round(Math.cos(i / 2) * 1500),
  };
});

// 限额对标
const quotaResults = [
  { label: "1 优于先进值", value: 55, color: "hsl(217 91% 45%)" },
  { label: "2 限额值至准入值之间", value: 28, color: "hsl(217 91% 45%)" },
  { label: "3 准入值至先进值之间", value: 16, color: "hsl(217 91% 45%)" },
  { label: "4 低于限额值", value: 1, color: "hsl(217 91% 45%)" },
];
const benchResults = [
  { label: "1 标杆水平至基准水平之间", value: 68, color: "hsl(217 91% 45%)" },
  { label: "2 优于标杆水平", value: 32, color: "hsl(217 91% 45%)" },
  { label: "3 低于基准水平", value: 0, color: "hsl(217 91% 45%)" },
];

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
};

function PanelTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h3 className="text-sm font-semibold text-foreground">{children}</h3>
      {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
    </div>
  );
}

function SubTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-end justify-between mb-2">
      <div className="text-xs font-semibold text-primary flex items-center gap-1">
        <span>›</span>
        {children}
      </div>
      {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
    </div>
  );
}

function KpiCard({ item }: { item: typeof monthlyKpi[number] }) {
  const Icon = item.icon;
  return (
    <div className="rounded-lg p-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/15">
      <div className="flex items-start justify-between mb-2">
        <div className="h-9 w-9 rounded-md flex items-center justify-center" style={{ background: `${item.color}15` }}>
          <Icon className="h-4.5 w-4.5" style={{ color: item.color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums" style={{ color: item.color }}>{item.value}</span>
        <span className="text-[10px] text-muted-foreground">{item.unit}</span>
      </div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{item.label}</div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-primary">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          style={{ width: `${Math.max(value, 1)}%` }}
        />
      </div>
    </div>
  );
}

export default function DualTrack() {
  const [districtTab, setDistrictTab] = useState<"区县" | "集团">("区县");

  return (
    <AppLayout fullscreen side="gov" title="双控跟踪" subtitle="月度 / 年度关键数据跟踪 · 能源消耗限额管理">
      <div className="grid grid-cols-12 gap-4">
        {/* ===== 左列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* 管理企业规模 */}
          <div className="panel p-4">
            <PanelTitle>管理企业规模</PanelTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {scaleCards.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="rounded-lg p-3 flex items-center gap-2.5" style={{ background: c.bg }}>
                    <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: c.color }}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold tabular-nums" style={{ color: c.color }}>{c.value}</span>
                        <span className="text-[10px] text-muted-foreground">{c.unit}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{c.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 企业数量行业分布 */}
          <div className="panel p-4">
            <PanelTitle>企业数量行业分布</PanelTitle>
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-2 h-[180px]">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={industries}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {industries.map((_, i) => (
                        <Cell key={i} fill={industryColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-3 space-y-1">
                {industries.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                    <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: industryColors[i] }} />
                    <span className="text-muted-foreground truncate flex-1">{d.name}</span>
                    <span className="tabular-nums w-3 text-right">{d.value}</span>
                    <span className="tabular-nums text-muted-foreground w-6 text-right">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 区县分布统计 */}
          <div className="panel p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">区县分布统计</h3>
              <div className="flex rounded border border-border/60 overflow-hidden">
                {(["区县", "集团"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDistrictTab(t)}
                    className={`px-3 py-0.5 text-[11px] ${
                      districtTab === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-muted-foreground bg-muted/30">
                    <th className="text-left py-1.5 px-1.5 font-medium">序号</th>
                    <th className="text-left py-1.5 px-1.5 font-medium">{districtTab}</th>
                    <th className="text-right py-1.5 px-1.5 font-medium">企业数(家)</th>
                    <th className="text-right py-1.5 px-1.5 font-medium">能耗(万tce)</th>
                    <th className="text-right py-1.5 px-1.5 font-medium">碳排(万tCO2)</th>
                  </tr>
                </thead>
                <tbody>
                  {districtRows.map((r) => (
                    <tr key={r.idx} className="border-b border-border/30">
                      <td className="py-1.5 px-1.5 tabular-nums">{r.idx}</td>
                      <td className="py-1.5 px-1.5">{r.name}</td>
                      <td className="py-1.5 px-1.5 text-right tabular-nums">{r.count}</td>
                      <td className="py-1.5 px-1.5 text-right tabular-nums">{r.energy.toFixed(3)}</td>
                      <td className="py-1.5 px-1.5 text-right tabular-nums">{r.carbon.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== 中列 ===== */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          {/* 月度关键数据跟踪 */}
          <div className="panel p-4">
            <PanelTitle>月度关键数据跟踪</PanelTitle>

            <SubTitle note="*截止2026年3月">能碳指标</SubTitle>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {monthlyKpi.map((k) => <KpiCard key={k.label} item={k} />)}
            </div>

            <SubTitle>关键数据趋势</SubTitle>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={monthlyTrend} margin={{ top: 5, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="L" fontSize={10} stroke="hsl(var(--muted-foreground))" label={{ value: "万tce", position: "insideTopLeft", fontSize: 9, fill: "hsl(var(--muted-foreground))", offset: -5 }} />
                <YAxis yAxisId="R" orientation="right" fontSize={10} stroke="hsl(var(--muted-foreground))" label={{ value: "万tCO2e", position: "insideTopRight", fontSize: 9, fill: "hsl(var(--muted-foreground))", offset: -5 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} iconSize={10} />
                <Bar yAxisId="L" dataKey="energy" name="综合能耗" fill="hsl(217 91% 55%)" radius={[3, 3, 0, 0]} barSize={18} />
                <Line yAxisId="R" type="monotone" dataKey="carbon" name="碳排放量" stroke="hsl(40 95% 55%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(40 95% 55%)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 年度关键数据跟踪 */}
          <div className="panel p-4">
            <PanelTitle>年度关键数据跟踪</PanelTitle>

            <SubTitle note="*来源-2024年年报">能碳指标</SubTitle>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {yearlyKpi.map((k) => <KpiCard key={k.label} item={k} />)}
            </div>

            <SubTitle>关键数据趋势</SubTitle>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={yearlyTrend} margin={{ top: 5, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="L" fontSize={10} stroke="hsl(var(--muted-foreground))" label={{ value: "万tce", position: "insideTopLeft", fontSize: 9, fill: "hsl(var(--muted-foreground))", offset: -5 }} />
                <YAxis yAxisId="R" orientation="right" fontSize={10} stroke="hsl(var(--muted-foreground))" label={{ value: "万tCO2e", position: "insideTopRight", fontSize: 9, fill: "hsl(var(--muted-foreground))", offset: -5 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} iconSize={10} />
                <Bar yAxisId="L" dataKey="energy" name="综合能耗" fill="hsl(217 91% 55%)" radius={[3, 3, 0, 0]} barSize={14} />
                <Line yAxisId="R" type="monotone" dataKey="carbon" name="碳排放量" stroke="hsl(40 95% 55%)" strokeWidth={2} dot={{ r: 2.5, fill: "hsl(40 95% 55%)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== 右列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="panel p-4 flex-1">
            <PanelTitle note="*来源-2024年限额考核">能源消耗限额管理</PanelTitle>

            {/* 限额考核管理指标 */}
            <div className="rounded-lg p-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/15 mb-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/15">
                  <Award className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="flex-1 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">限额考核管理指标</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-primary tabular-nums">183</span>
                    <span className="text-[10px] text-muted-foreground">个</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
              </div>
            </div>

            {/* 限额对标结果 */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2.5 pb-1.5 border-b border-border/40">限额对标结果</div>
              <div className="space-y-2.5">
                {quotaResults.map((r) => (
                  <ResultRow key={r.label} label={r.label} value={r.value} />
                ))}
              </div>
            </div>

            {/* 能效标杆对标结果 */}
            <div>
              <div className="text-xs font-semibold mb-2.5 pb-1.5 border-b border-border/40">能效标杆对标结果</div>
              <div className="space-y-2.5">
                {benchResults.map((r) => (
                  <ResultRow key={r.label} label={r.label} value={r.value} />
                ))}
              </div>
            </div>

            {/* 装饰图标 */}
            <div className="mt-6 flex items-center justify-center gap-3 text-muted-foreground/40">
              <Leaf className="h-5 w-5" />
              <span className="text-[10px]">绿色低碳 · 节能减排</span>
              <Wind className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
