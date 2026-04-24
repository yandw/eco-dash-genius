import { Building2, Cloud, Factory, BarChart3, Zap } from "lucide-react";

const items = [
  {
    icon: Building2,
    main: { value: "536", unit: "家", label: "管理企业数" },
    sub: { value: "113", unit: "家", label: "两高企业数" },
  },
  {
    icon: Cloud,
    main: { value: "14,506.4", unit: "万tCO₂", label: "年碳排放量" },
    bars: [
      { label: "占比全市", v: 45 },
      { label: "占全市工业", v: 85 },
    ],
  },
  {
    icon: Factory,
    main: { value: "4,326.9", unit: "万tce", label: "年综合能耗(等价值)" },
    bars: [
      { label: "占比全市", v: 36 },
      { label: "占全市工业", v: 83 },
    ],
  },
  {
    icon: BarChart3,
    main: { value: "21,304.2", unit: "亿元", label: "企业年产值" },
    bars: [
      { label: "占比全市", v: 69 },
      { label: "占全市工业", v: 82 },
    ],
  },
  {
    icon: Zap,
    main: { value: "601.1", unit: "亿kWh", label: "年电力消耗量" },
    bars: [
      { label: "占比全市", v: 24 },
      { label: "占全市工业", v: 54 },
    ],
  },
];

export function TopKpiBar() {
  return (
    <div className="panel p-4 flex items-stretch gap-3 overflow-x-auto">
      {/* 左侧装饰竖排文字 */}
      <div className="hidden md:flex flex-col justify-center px-2 py-1 rounded bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 text-[11px] tracking-[0.3em] text-primary/80 leading-tight whitespace-nowrap shrink-0">
        <span>节</span><span>约</span><span>能</span><span>源</span>
        <span className="my-1.5 h-px w-full bg-primary/20" />
        <span>监</span><span>察</span><span>有</span><span>力</span>
      </div>
      <div className="hidden md:flex flex-col justify-center px-2 py-1 rounded bg-gradient-to-b from-secondary/10 to-transparent border border-secondary/20 text-[11px] tracking-[0.3em] text-secondary/80 leading-tight whitespace-nowrap shrink-0">
        <span>高</span><span>效</span><span>廉</span><span>洁</span>
        <span className="my-1.5 h-px w-full bg-secondary/20" />
        <span>服</span><span>务</span><span>社</span><span>会</span>
      </div>

      {items.map((it, idx) => (
        <div
          key={idx}
          className="flex-1 min-w-[180px] rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-border/60 p-3 flex flex-col"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
              <it.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-muted-foreground truncate">{it.main.label}</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold tabular-nums text-foreground">{it.main.value}</span>
                <span className="text-[10px] text-muted-foreground">{it.main.unit}</span>
              </div>
            </div>
          </div>

          {it.sub && (
            <div className="mt-2 pt-2 border-t border-border/40 flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-secondary tabular-nums">{it.sub.value}</span>
              <span className="text-[10px] text-muted-foreground">{it.sub.unit}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{it.sub.label}</span>
            </div>
          )}

          {it.bars && (
            <div className="mt-2 space-y-1.5">
              {it.bars.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-14 shrink-0">{b.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${b.v}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-primary w-7 text-right">{b.v}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
