import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DecadeShanghaiMap } from "@/components/dashboard/overview/DecadeShanghaiMap";
import {
  EnterprisePortraitDialog,
  type EnterpriseInfo,
} from "@/components/dashboard/overview/EnterprisePortraitDialog";

// === 企业能耗等级变化 (2010-2024) ===
const levelData = Array.from({ length: 15 }).map((_, i) => ({
  y: `${2010 + i}`,
  "5k~50k": 320 + i * 8 + ((i * 7) % 18),
  "50k~500k": 75 + i * 3 + ((i * 5) % 9),
  "500k~5000k": 22 + (i % 6),
  "5000k~": 6 + (i % 3),
}));

// === 能源消费结构变化 (2012-2023) ===
const mixYearData = Array.from({ length: 12 }).map((_, i) => {
  const electric = 36 + i * 0.4;
  const gas = 6 + (i % 3);
  const oil = 24 - i * 0.3;
  const coal = 30 - i * 0.5;
  const other = 100 - electric - gas - oil - coal;
  return {
    y: `${2012 + i}`,
    煤品: +coal.toFixed(1),
    油品: +oil.toFixed(1),
    天然气: +gas.toFixed(1),
    电力: +electric.toFixed(1),
    其他: +Math.max(0, other).toFixed(1),
  };
});

// === 2012年能源消费结构 (环形) ===
const mixDonut = [
  { name: "电力", value: 39.81, color: "hsl(217 91% 56%)" },
  { name: "煤品", value: 29.73, color: "hsl(220 10% 55%)" },
  { name: "油品", value: 24.02, color: "hsl(40 95% 55%)" },
  { name: "天然气", value: 6.35, color: "hsl(32 95% 60%)" },
  { name: "其他", value: 0.09, color: "hsl(152 65% 50%)" },
];

// === 重点用能单位综合能耗 (2010-2024) ===
const totalForecast = Array.from({ length: 15 }).map((_, i) => ({
  y: `${2010 + i}`,
  v: 4500 + Math.round(Math.sin(i / 1.5) * 250) - i * 8,
}));

// === 综合能耗强度 (2013-2024) ===
const intensity = Array.from({ length: 12 }).map((_, i) => ({
  y: `${2013 + i}`,
  v: +(0.21 - i * 0.012 + Math.sin(i / 2) * 0.008).toFixed(3),
}));

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
};

function PanelHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-primary">
      <span>›</span>
      {title}
    </h3>
  );
}

export default function Decade() {
  const [enterprise, setEnterprise] = useState<EnterpriseInfo | null>(null);

  return (
    <AppLayout side="gov" title="十年节能" subtitle="重点用能单位历年趋势 · 2010—2024">
      <div className="grid grid-cols-12 gap-4">
        {/* ===== 左列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* 企业能耗等级变化 */}
          <div className="panel p-3">
            <div className="text-sm font-semibold mb-2">企业能耗等级变化</div>
            <PanelHeader title="企业数量和能耗等级 - 2010至2024" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={levelData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={9} stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={40} interval={0} />
                <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 9 }} iconSize={8} />
                <Bar dataKey="5k~50k" stackId="a" fill="hsl(152 65% 50%)" />
                <Bar dataKey="50k~500k" stackId="a" fill="hsl(217 91% 56%)" />
                <Bar dataKey="500k~5000k" stackId="a" fill="hsl(40 95% 55%)" />
                <Bar dataKey="5000k~" stackId="a" fill="hsl(0 75% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 能源消费结构变化 */}
          <div className="panel p-3">
            <div className="text-sm font-semibold mb-2">能源消费结构变化</div>
            <PanelHeader title="能源消费结构（占比%）" />
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mixYearData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={9} stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={40} interval={0} />
                <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 9 }} iconSize={8} />
                <Bar dataKey="煤品" stackId="b" fill="hsl(220 10% 55%)" />
                <Bar dataKey="油品" stackId="b" fill="hsl(40 95% 55%)" />
                <Bar dataKey="天然气" stackId="b" fill="hsl(32 95% 60%)" />
                <Bar dataKey="电力" stackId="b" fill="hsl(217 91% 56%)" />
                <Bar dataKey="其他" stackId="b" fill="hsl(152 65% 50%)" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[9px] text-muted-foreground mt-1">*数据导入样本图可查看相应年度能源消费机构</p>
          </div>

          {/* 2012年能源消费结构 */}
          <div className="panel p-3">
            <div className="text-sm font-semibold mb-2">2012年能源消费结构</div>
            <PanelHeader title="占比明细" />
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="relative h-[160px]">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={mixDonut}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={66}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {mixDonut.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[10px] text-muted-foreground">电力</div>
                  <div className="text-base font-bold text-primary tabular-nums">39.81%</div>
                </div>
              </div>
              <div className="space-y-1">
                {mixDonut.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-0.5 w-4" style={{ background: d.color }} />
                    <span className="text-muted-foreground w-10">{d.name}</span>
                    <span className="ml-auto font-semibold tabular-nums" style={{ color: d.color }}>
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== 中列：地图 ===== */}
        <div className="col-span-12 lg:col-span-6">
          <div className="h-[760px]">
            <DecadeShanghaiMap onEnterpriseClick={(e) => setEnterprise(e)} />
          </div>
        </div>

        {/* ===== 右列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* 能耗总量及预测 */}
          <div className="panel p-3">
            <div className="text-sm font-semibold mb-2">能耗总量及预测</div>
            <PanelHeader title="重点用能单位综合能耗（吨标煤）" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={totalForecast} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={9} stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={40} interval={0} />
                <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
                <defs>
                  <linearGradient id="totalBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200 90% 65%)" />
                    <stop offset="100%" stopColor="hsl(217 91% 70%)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <Bar dataKey="v" name="综合能耗等价值" fill="url(#totalBar)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 能效强度变化 */}
          <div className="panel p-3">
            <div className="text-sm font-semibold mb-2">能效强度变化</div>
            <PanelHeader title="综合能耗强度(等价值)" />
            <div className="text-[10px] text-muted-foreground mb-1">tce/万元</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={intensity} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="intensityArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={9} stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={40} interval={0} />
                <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                  fill="url(#intensityArea)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <EnterprisePortraitDialog
        open={!!enterprise}
        onOpenChange={(v) => !v && setEnterprise(null)}
        enterprise={enterprise}
      />
    </AppLayout>
  );
}
