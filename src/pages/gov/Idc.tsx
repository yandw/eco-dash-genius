import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Sun } from "lucide-react";
import { IdcShanghaiMap } from "@/components/dashboard/overview/IdcShanghaiMap";
import { IdcPortraitDialog, type IdcInfo } from "@/components/dashboard/overview/IdcPortraitDialog";

// === IDC 分类统计 ===
const classifyTabs = ["综合能耗", "机柜数量", "PUE评价"] as const;
type ClassifyTab = (typeof classifyTabs)[number];

const classifyData: Record<ClassifyTab, { range: string; pct: number; count: number }[]> = {
  综合能耗: [
    { range: "X≥50000", pct: 3.8, count: 2 },
    { range: "30000≤X<50000", pct: 22.6, count: 12 },
    { range: "10000≤X<3000", pct: 47.2, count: 25 },
    { range: "5000≤X<10000", pct: 15.1, count: 8 },
    { range: "X<5000", pct: 11.3, count: 6 },
  ],
  机柜数量: [
    { range: "X≥10000", pct: 5.7, count: 3 },
    { range: "5000≤X<10000", pct: 18.9, count: 10 },
    { range: "2000≤X<5000", pct: 41.5, count: 22 },
    { range: "500≤X<2000", pct: 22.6, count: 12 },
    { range: "X<500", pct: 11.3, count: 6 },
  ],
  PUE评价: [
    { range: "1.0~1.3", pct: 28.3, count: 15 },
    { range: "1.3~1.5", pct: 41.5, count: 22 },
    { range: "1.5~1.7", pct: 22.6, count: 12 },
    { range: ">1.7", pct: 7.6, count: 4 },
  ],
};

// === IDC 区县分析 (堆叠柱) ===
const districtAnalysis = [
  { d: "浦东新区", a: 18, b: 5, c: 3, dd: 1 },
  { d: "宝山区", a: 12, b: 3, c: 2, dd: 0 },
  { d: "闵行区", a: 6, b: 2, c: 1, dd: 0 },
  { d: "松江区", a: 5, b: 1, c: 1, dd: 0 },
  { d: "嘉定区", a: 4, b: 2, c: 1, dd: 0 },
  { d: "静安区", a: 3, b: 1, c: 0, dd: 0 },
  { d: "黄浦区", a: 3, b: 1, c: 1, dd: 0 },
  { d: "奉贤区", a: 2, b: 1, c: 0, dd: 0 },
  { d: "宝山区", a: 2, b: 0, c: 0, dd: 0 },
  { d: "崇明区", a: 1, b: 0, c: 0, dd: 0 },
];

// === 排名数据 ===
const energyRank = [
  { name: "上海悦科观工数据中心", v: 58012.35 },
  { name: "中国移动上海国际数据中心", v: 55206.87 },
  { name: "上海万国新发展数据中心", v: 48214.67 },
  { name: "宝信宝之云四期3号楼", v: 46944.1 },
  { name: "华京路四号数据中心", v: 44850.4 },
];
const pueRank = [
  { name: "安晓数据中心", v: 1.193 },
  { name: "宝信宝之云四期3号楼", v: 1.211 },
  { name: "浦江数据中心", v: 1.222 },
  { name: "宝信宝之云四期2号楼", v: 1.232 },
  { name: "上海万国D9数据中心", v: 1.242 },
];
const rackRank = [
  { name: "上海颛桥云基地", rack: 10093, rate: 79.26 },
  { name: "中国移动上海国际数据…", rack: 10083, rate: 100 },
  { name: "上海万国新发展数据中心", rack: 6932, rate: 92.2 },
  { name: "上海悦科观工数据中心", rack: 5149, rate: 100 },
];

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
};

function PanelTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold">{children}</h3>
      {action}
    </div>
  );
}

const barColors = ["hsl(217 91% 45%)", "hsl(40 95% 55%)", "hsl(40 95% 55%)", "hsl(217 91% 45%)", "hsl(217 91% 45%)"];

export default function Idc() {
  const [tab, setTab] = useState<ClassifyTab>("综合能耗");
  const [idc, setIdc] = useState<IdcInfo | null>(null);

  const data = classifyData[tab];

  return (
    <AppLayout side="gov" title="IDC监察" subtitle="数据中心能耗 / PUE / 机柜分布">
      <div className="grid grid-cols-12 gap-4">
        {/* ===== 左列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* IDC 分类统计 */}
          <div className="panel p-4">
            <PanelTitle>IDC分类统计</PanelTitle>
            <div className="flex gap-1 mb-3 border-b border-border/40">
              {classifyTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-2.5 py-1 text-[11px] -mb-px border-b-2 transition ${
                    tab === t ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mb-2">
              {tab === "综合能耗" ? "年综合能耗(tce)" : tab === "机柜数量" ? "机柜数量(个)" : "PUE 区间"}
            </div>
            <div className="space-y-2.5">
              {data.map((row, i) => (
                <div key={row.range} className="grid grid-cols-[90px_1fr_40px] items-center gap-2 text-[11px]">
                  <span className="text-muted-foreground tabular-nums truncate">{row.range}</span>
                  <div className="relative h-5 bg-muted/30 rounded">
                    <div
                      className="absolute inset-y-0 left-0 rounded flex items-center justify-end px-2 text-[10px] font-semibold text-white"
                      style={{ width: `${Math.max(row.pct * 1.6, 18)}%`, background: barColors[i % barColors.length] }}
                    >
                      {row.pct}%
                    </div>
                  </div>
                  <span className="text-right tabular-nums text-muted-foreground">{row.count} 家</span>
                </div>
              ))}
            </div>
          </div>

          {/* IDC 区县分析 */}
          <div className="panel p-4">
            <PanelTitle action={<button className="text-[10px] text-primary hover:underline">查看详情</button>}>IDC区县分析</PanelTitle>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] mb-2">
              {[
                { l: "1.0~1.3", c: "hsl(265 85% 65%)" },
                { l: "1.3~1.5", c: "hsl(217 91% 56%)" },
                { l: "1.5~1.7", c: "hsl(40 95% 55%)" },
                { l: ">1.7", c: "hsl(0 75% 60%)" },
              ].map((it) => (
                <div key={it.l} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm" style={{ background: it.c }} />
                  <span className="text-muted-foreground">{it.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={districtAnalysis} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="d" fontSize={8} stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={50} interval={0} />
                <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="a" stackId="x" fill="hsl(265 85% 65%)" />
                <Bar dataKey="b" stackId="x" fill="hsl(217 91% 45%)" />
                <Bar dataKey="c" stackId="x" fill="hsl(40 95% 55%)" />
                <Bar dataKey="dd" stackId="x" fill="hsl(0 75% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 可再生能源利用总量 */}
          <div className="panel p-4 flex-1">
            <PanelTitle>可再生能源利用总量</PanelTitle>
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/15 p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sun className="h-7 w-7 text-amber-400" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary tabular-nums">30,400</span>
                  <span className="text-[10px] text-muted-foreground">万千瓦时</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">可再生能源利用总量</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 中列：地图 ===== */}
        <div className="col-span-12 lg:col-span-6">
          <div className="h-[760px]">
            <IdcShanghaiMap onIdcClick={(d) => setIdc(d)} />
          </div>
        </div>

        {/* ===== 右列 ===== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* IDC 能耗排名 */}
          <div className="panel p-4">
            <PanelTitle>IDC能耗排名（tce）</PanelTitle>
            <div className="space-y-2">
              {energyRank.map((it, i) => (
                <div key={it.name} className="flex items-center gap-2 text-[11px]">
                  <span className="h-5 w-5 rounded flex items-center justify-center text-[10px] font-semibold bg-primary/15 text-primary tabular-nums">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{it.name}</span>
                  <div className="w-12 h-1 rounded bg-gradient-to-r from-orange-300 to-orange-500" />
                  <span className="tabular-nums w-16 text-right text-muted-foreground">{it.v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IDC PUE 排名 */}
          <div className="panel p-4">
            <PanelTitle>IDC PUE 排名</PanelTitle>
            <div className="space-y-2">
              {pueRank.map((it, i) => (
                <div key={it.name} className="flex items-center gap-2 text-[11px]">
                  <span className="h-5 w-5 rounded flex items-center justify-center text-[10px] font-semibold bg-primary/15 text-primary tabular-nums">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{it.name}</span>
                  <div className="w-12 h-1 rounded bg-gradient-to-r from-sky-300 to-sky-500" />
                  <span className="tabular-nums w-12 text-right text-muted-foreground">{it.v.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IDC 设备上架率排名 */}
          <div className="panel p-4 flex-1">
            <PanelTitle>IDC设备上架率排名</PanelTitle>
            <div className="grid grid-cols-[1fr_60px_50px] gap-1 text-[10px] text-muted-foreground pb-1.5 border-b border-border/40">
              <span>IDC名称</span>
              <span className="text-right">实际机柜数</span>
              <span className="text-right">上架率</span>
            </div>
            <div className="space-y-2.5 mt-2">
              {rackRank.map((it, i) => (
                <div key={it.name}>
                  <div className="grid grid-cols-[20px_1fr_60px_50px] gap-1 items-center text-[11px]">
                    <span className="h-4 w-4 rounded flex items-center justify-center text-[9px] font-semibold bg-primary/15 text-primary tabular-nums">
                      {i + 1}
                    </span>
                    <span className="truncate">{it.name}</span>
                    <span className="text-right tabular-nums">{it.rack.toLocaleString()} 个</span>
                    <span className="text-right tabular-nums text-primary">{it.rate} %</span>
                  </div>
                  <div className="ml-5 mt-1 h-1 bg-muted/30 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary/60 to-primary rounded" style={{ width: `${it.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <IdcPortraitDialog open={!!idc} onOpenChange={(v) => !v && setIdc(null)} idc={idc} />
    </AppLayout>
  );
}
