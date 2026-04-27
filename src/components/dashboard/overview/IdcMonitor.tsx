import { useState } from "react";
import { Server, Zap, HardDrive } from "lucide-react";

const tabs = ["综合能耗", "机柜数量", "PUE评价"] as const;

const dataMap: Record<(typeof tabs)[number], { label: string; pct: number; count: number; color: string }[]> = {
  综合能耗: [
    { label: "X≥50000", pct: 3.8, count: 2, color: "hsl(0 75% 60%)" },
    { label: "30000≤X<50000", pct: 22.6, count: 12, color: "hsl(40 95% 55%)" },
    { label: "10000≤X<30000", pct: 47.2, count: 25, color: "hsl(217 91% 45%)" },
    { label: "5000≤X<10000", pct: 15.1, count: 8, color: "hsl(217 80% 70%)" },
    { label: "X<5000", pct: 11.3, count: 6, color: "hsl(265 85% 65%)" },
  ],
  机柜数量: [
    { label: "X≥10000", pct: 5.7, count: 3, color: "hsl(0 75% 60%)" },
    { label: "5000≤X<10000", pct: 18.9, count: 10, color: "hsl(40 95% 55%)" },
    { label: "1000≤X<5000", pct: 50.9, count: 27, color: "hsl(217 91% 45%)" },
    { label: "500≤X<1000", pct: 15.1, count: 8, color: "hsl(217 80% 70%)" },
    { label: "X<500", pct: 9.4, count: 5, color: "hsl(265 85% 65%)" },
  ],
  PUE评价: [
    { label: "PUE≥1.8", pct: 7.5, count: 4, color: "hsl(0 75% 60%)" },
    { label: "1.5≤PUE<1.8", pct: 26.4, count: 14, color: "hsl(40 95% 55%)" },
    { label: "1.3≤PUE<1.5", pct: 43.4, count: 23, color: "hsl(217 91% 45%)" },
    { label: "1.2≤PUE<1.3", pct: 17.0, count: 9, color: "hsl(217 80% 70%)" },
    { label: "PUE<1.2", pct: 5.7, count: 3, color: "hsl(265 85% 65%)" },
  ],
};

export function IdcMonitor() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("综合能耗");
  const rows = dataMap[tab];

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-primary" />
        数据中心专项监察
      </h3>

      {/* 三个 KPI */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Server, value: "106", unit: "个", label: "IDC接入数", color: "primary" },
          { icon: Zap, value: "1.55", unit: "", label: "能源利用率PUE", color: "secondary" },
          { icon: HardDrive, value: "115.4", unit: "万tce", label: "IT设备综合能耗", color: "primary" },
        ].map((k) => (
          <div key={k.label} className="text-center px-1">
            <k.icon className={`h-7 w-7 mx-auto mb-1 ${k.color === "primary" ? "text-primary" : "text-secondary"}`} />
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-lg font-bold tabular-nums">{k.value}</span>
              {k.unit && <span className="text-[9px] text-muted-foreground">{k.unit}</span>}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* IDC 分类统计 */}
      <div className="border-t border-border/40 pt-3 flex-1 flex flex-col">
        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
          <span className="text-primary">›</span>IDC分类统计
        </h4>
        <div className="flex gap-1 mb-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[11px] px-2.5 py-1 rounded transition-smooth ${
                t === tab ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground mb-1">
          年{tab}{tab === "综合能耗" ? "(tce)" : tab === "PUE评价" ? "" : ""}
        </div>
        <div className="space-y-1.5 flex-1">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2 text-[10px]">
              <span className="w-24 text-muted-foreground shrink-0">{r.label}</span>
              <div className="flex-1 h-3.5 rounded bg-muted relative overflow-hidden">
                <div
                  className="h-full rounded flex items-center justify-end pr-1.5 text-white font-medium"
                  style={{ width: `${r.pct}%`, background: r.color }}
                >
                  {r.pct >= 10 && <span className="text-[9px]">{r.pct}%</span>}
                </div>
                {r.pct < 10 && (
                  <span className="absolute left-[calc(var(--w)+4px)] top-1/2 -translate-y-1/2 text-[9px] text-foreground" style={{ ["--w" as never]: `${r.pct}%` }}>
                    {r.pct}%
                  </span>
                )}
              </div>
              <span className="w-8 text-right text-muted-foreground">{r.count}家</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
