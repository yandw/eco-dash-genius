import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Building2, Flame, Zap, Gauge } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface IdcInfo {
  id: string;
  name: string;
  pue: number;
  energy: number;
  rack: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  idc: IdcInfo | null;
}

const TABS = [
  { key: "PUE", label: "PUE", unit: "", color: "hsl(217 91% 45%)" },
  { key: "上架率", label: "上架率(%)", unit: "%", color: "hsl(217 91% 45%)" },
  { key: "电耗", label: "电耗(万kWh)", unit: "万kWh", color: "hsl(40 95% 55%)" },
  { key: "综合能耗", label: "综合能耗(当量tce)", unit: "tce", color: "hsl(265 85% 65%)" },
] as const;

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
};

export function IdcPortraitDialog({ open, onOpenChange, idc }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("PUE");
  const [year] = useState("2023");

  if (!idc) return null;

  // 仅 2023 一根柱（参照图）
  const data = [{ y: "2023", v: tab === "PUE" ? idc.pue : tab === "上架率" ? 78 : tab === "电耗" ? 3317.6 : 10000 }];
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-card border-primary/30">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-primary/15 to-transparent border-b border-primary/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">›</span>
            {idc.name.includes("数据中心") ? idc.name : `${idc.name}数据中心`}全景画像
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">时间选择</span>
            <div className="px-3 py-1 text-xs rounded border border-border/60 bg-muted/30 tabular-nums">
              {year}
            </div>
            <button onClick={() => onOpenChange(false)} className="h-7 w-7 rounded border border-border/60 flex items-center justify-center hover:bg-muted">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            {/* 数据中心简介 */}
            <div className="col-span-12 lg:col-span-7 panel p-4">
              <div className="text-xs font-semibold text-primary mb-3 flex items-center gap-1">
                <span>›</span> 数据中心简介
              </div>
              <div className="grid grid-cols-12 gap-3">
                {/* 3D 大楼装饰 */}
                <div className="col-span-4 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5 h-[150px] flex items-center justify-center relative overflow-hidden">
                  <Building2 className="h-16 w-16 text-primary/60" />
                  <div className="absolute inset-0 grid-bg opacity-30" />
                </div>
                <div className="col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-muted-foreground">业主单位</div>
                    <div className="text-base font-semibold text-primary mt-1">{idc.name.includes("数据中心") ? idc.name.replace("数据中心", "") : idc.name}华工技术服务有限公司</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { label: "建设时间", value: "2018.10" },
                      { label: "设计机柜数", value: `${idc.rack.toLocaleString()}个` },
                      { label: "建筑面积", value: "22,216.7㎡" },
                    ].map((it) => (
                      <div key={it.label} className="rounded border border-border/60 bg-muted/20 p-2 text-center">
                        <div className="text-[10px] text-muted-foreground">{it.label}</div>
                        <div className="text-sm font-bold text-primary tabular-nums mt-1">{it.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 指标跟踪 */}
            <div className="col-span-12 lg:col-span-5 panel p-4">
              <div className="text-xs font-semibold text-primary mb-3 flex items-center gap-1">
                <span>›</span> 指标跟踪
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "综合能耗", value: "1.0", unit: "万tce", icon: Flame, color: "hsl(217 91% 45%)" },
                  { label: "总电能消耗", value: "3,317.6", unit: "万kwh", icon: Zap, color: "hsl(40 95% 55%)" },
                  { label: "PUE", value: idc.pue.toFixed(1), unit: "", icon: Gauge, color: "hsl(217 91% 45%)" },
                ].map((it) => {
                  const Icon = it.icon;
                  return (
                    <div key={it.label} className="rounded-lg p-3 bg-gradient-to-br from-primary/8 to-transparent border border-primary/15 text-center">
                      <div className="text-[11px] text-muted-foreground mb-1">{it.label}</div>
                      <div className="h-9 w-9 rounded-md mx-auto flex items-center justify-center" style={{ background: `${it.color}20` }}>
                        <Icon className="h-4.5 w-4.5" style={{ color: it.color }} />
                      </div>
                      <div className="mt-2 flex items-baseline justify-center gap-0.5">
                        <span className="text-lg font-bold tabular-nums" style={{ color: it.color }}>{it.value}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{it.unit}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 逐年能耗曲线 */}
          <div className="panel p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                <span>›</span> 逐年能耗曲线
              </div>
              <div className="flex gap-1.5 ml-2">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-4 py-1 text-[11px] rounded transition ${
                      tab === t.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="idcBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={active.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={active.color} stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="y" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="v" name={active.label} fill="url(#idcBar)" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
