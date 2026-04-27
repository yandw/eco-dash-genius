import { useState } from "react";
import { Factory, Zap, Gauge, ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import districtBg from "@/assets/dashboard/district-bg.jpg";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  districtName: string;
}

const tabs = ["工业产值(亿元)", "碳排放(万CO2e)", "综合能耗(等价万tce)", "产值能耗(tce/万元)"];

const baseData: Record<string, { y: string; v: number }[]> = {
  "工业产值(亿元)": [
    { y: "2017", v: 0.0 },
    { y: "2018", v: 0.0 },
    { y: "2022", v: 0.0 },
    { y: "2023", v: 0.65 },
  ],
  "碳排放(万CO2e)": [
    { y: "2017", v: 0.32 },
    { y: "2018", v: 0.30 },
    { y: "2022", v: 0.28 },
    { y: "2023", v: 0.26 },
  ],
  "综合能耗(等价万tce)": [
    { y: "2017", v: 0.55 },
    { y: "2018", v: 0.58 },
    { y: "2022", v: 0.60 },
    { y: "2023", v: 0.62 },
  ],
  "产值能耗(tce/万元)": [
    { y: "2017", v: 0.95 },
    { y: "2018", v: 0.88 },
    { y: "2022", v: 0.82 },
    { y: "2023", v: 0.80 },
  ],
};

export function DistrictPortraitDialog({ open, onOpenChange, districtName }: Props) {
  const [year, setYear] = useState("2022");
  const [tab, setTab] = useState(tabs[0]);
  const data = baseData[tab];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] p-0 gap-0 bg-card border-primary/30">
        <div className="flex items-center px-5 py-3 border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span className="text-primary">›</span>
            {districtName}能碳全景画像
          </h2>
          <div className="ml-auto flex items-center gap-2 mr-7">
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
            <div className="rounded-md border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 border-b border-border/40">
                › 简介
              </div>
              <div
                className="relative h-[180px] p-4 flex items-center gap-3"
                style={{
                  backgroundImage: `linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)/0.6) 40%, transparent 100%), url(${districtBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "right center",
                }}
              >
                <div className="rounded bg-card/90 backdrop-blur border border-primary/30 px-4 py-3 text-center min-w-[100px]">
                  <div className="text-[10px] text-muted-foreground mb-1">下属企业</div>
                  <div className="text-base font-bold text-primary">100家</div>
                </div>
                <div className="rounded bg-card/90 backdrop-blur border border-primary/30 px-4 py-3 text-center min-w-[120px]">
                  <div className="text-[10px] text-muted-foreground mb-1">能耗等级</div>
                  <div className="text-sm font-bold text-primary">5000吨~50万吨</div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border/60 overflow-hidden">
              <div className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 border-b border-border/40">
                › 指标跟踪
              </div>
              <div className="p-4 grid grid-cols-3 gap-3 h-[180px]">
                {[
                  { icon: Factory, label: "综合能耗(等价)", value: "0.6", unit: "万tce" },
                  { icon: Zap, label: "总电能消耗", value: "326.4", unit: "万kwh" },
                  { icon: Gauge, label: "产值能耗", value: "0.8", unit: "tce/万元" },
                ].map((k) => (
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
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217 91% 55%)" />
                      <stop offset="100%" stopColor="hsl(217 91% 45%)" />
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
                  <Bar dataKey="v" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
