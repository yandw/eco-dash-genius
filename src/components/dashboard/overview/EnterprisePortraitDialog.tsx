import { useState } from "react";
import { Factory, Zap, Gauge, ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import districtBg from "@/assets/dashboard/district-bg.jpg";

export interface EnterpriseInfo {
  name: string;
  district: string;
  industry: string;
  energyLevel: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  enterprise: EnterpriseInfo | null;
}

const tabs = ["工业产值(亿元)", "碳排放(万CO2e)", "综合能耗(等价万tce)", "产值能耗(tce/万元)"];

// 按企业名 hash 生成稳定假数据
function makeData(name: string, tab: string) {
  const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = ((seed % 50) + 10) / 10; // 1.0~6.0
  const factor =
    tab === "工业产值(亿元)" ? 1 :
    tab === "碳排放(万CO2e)" ? 0.4 :
    tab === "综合能耗(等价万tce)" ? 0.6 : 0.3;
  return [2017, 2018, 2022, 2023].map((y, i) => ({
    y: String(y),
    v: +(base * factor * (0.8 + ((seed + i) % 7) / 10)).toFixed(2),
  }));
}

export function EnterprisePortraitDialog({ open, onOpenChange, enterprise }: Props) {
  const [year, setYear] = useState("2023");
  const [tab, setTab] = useState(tabs[0]);

  if (!enterprise) return null;
  const data = makeData(enterprise.name, tab);

  // 三个 KPI 也用 hash 生成
  const seed = enterprise.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const kpis = [
    { icon: Factory, label: "综合能耗(等价)", value: ((seed % 50) / 100 + 0.2).toFixed(1), unit: "万tce" },
    { icon: Zap, label: "总电能消耗", value: (((seed * 3) % 3000) + 100).toFixed(1), unit: "万kwh" },
    { icon: Gauge, label: "产值能耗", value: ((seed % 9) / 10 + 0.1).toFixed(1), unit: "tce/万元" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] p-0 gap-0 bg-card border-primary/30">
        <div className="flex items-center px-5 py-3 border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-base font-semibold flex items-center gap-2 truncate">
            <span className="text-primary shrink-0">›</span>
            <span className="truncate">{enterprise.name}能碳全景画像</span>
          </h2>
          <div className="ml-auto flex items-center gap-2 mr-7 shrink-0">
            <span className="text-xs text-muted-foreground">时间选择</span>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none text-xs bg-card border border-border/60 rounded px-2.5 py-1 pr-7 focus:outline-none focus:border-primary"
              >
                {[2020, 2021, 2022, 2023].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 企业简介 */}
            <div className="rounded-md border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 border-b border-border/40">
                › 企业简介
              </div>
              <div
                className="relative h-[180px] p-3"
                style={{
                  backgroundImage: `linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)/0.6) 35%, transparent 100%), url(${districtBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "right center",
                }}
              >
                <div className="text-[11px] text-muted-foreground absolute top-3 right-3 opacity-70">基本信息</div>
                <div className="grid grid-cols-3 gap-2 mt-7">
                  <div className="rounded bg-card/90 backdrop-blur border border-primary/30 px-2 py-2.5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">所在区县</div>
                    <div className="text-xs font-bold text-primary leading-tight">{enterprise.district}</div>
                  </div>
                  <div className="rounded bg-card/90 backdrop-blur border border-primary/30 px-2 py-2.5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">行业</div>
                    <div className="text-xs font-bold text-primary leading-tight line-clamp-2">{enterprise.industry}</div>
                  </div>
                  <div className="rounded bg-card/90 backdrop-blur border border-primary/30 px-2 py-2.5 text-center">
                    <div className="text-[10px] text-muted-foreground mb-1">能耗等级</div>
                    <div className="text-xs font-bold text-primary leading-tight">{enterprise.energyLevel}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 指标跟踪 */}
            <div className="rounded-md border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 border-b border-border/40">
                › 指标跟踪
              </div>
              <div className="p-4 grid grid-cols-3 gap-3 h-[180px]">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded border border-border/60 bg-gradient-to-b from-primary/5 to-transparent p-3 flex flex-col items-center text-center">
                    <div className="text-[11px] text-muted-foreground mb-1">{k.label}</div>
                    <k.icon className="h-9 w-9 text-primary my-2" />
                    <div className="text-xl font-bold text-foreground tabular-nums">{k.value}</div>
                    <div className="text-[10px] text-muted-foreground">{k.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border/60 overflow-hidden">
            <div className="flex items-center px-3 py-1.5 bg-primary/5 border-b border-border/40 gap-1">
              <span className="text-xs font-semibold text-primary">› 逐年能耗曲线</span>
              <div className="ml-auto flex gap-1 flex-wrap">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-[11px] px-2.5 py-1 rounded transition-smooth ${
                      t === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="entBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                      <stop offset="100%" stopColor="hsl(200 90% 70%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="y" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="v" fill="url(#entBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
