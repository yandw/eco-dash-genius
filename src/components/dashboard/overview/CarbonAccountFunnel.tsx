const layers = [
  { label: "企业级", count: "1,200", pct: "78.13%", color: "hsl(152 65% 50%)" },
  { label: "集团级", count: "200", pct: "13.02%", color: "hsl(155 55% 28%)" },
  { label: "园区级", count: "100", pct: "6.51%", color: "hsl(40 95% 60%)" },
  { label: "区级", count: "16", pct: "1.04%", color: "hsl(0 70% 60%)" },
  { label: "市级", count: "20", pct: "1.30%", color: "hsl(280 60% 60%)" },
];

export function CarbonAccountFunnel() {
  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-primary" />
        碳账户分布
      </h3>

      <div className="flex-1 flex flex-col items-stretch justify-center gap-1 py-2">
        {layers.map((l, i) => {
          const widths = [100, 84, 68, 52, 36];
          return (
            <div key={l.label} className="flex items-center gap-3">
              <div className="flex-1 flex justify-center">
                <div
                  className="relative h-9 flex items-center justify-center text-white text-[11px] font-medium shadow-sm"
                  style={{
                    width: `${widths[i]}%`,
                    background: l.color,
                    clipPath:
                      i === layers.length - 1
                        ? "polygon(8% 0, 92% 0, 100% 100%, 0 100%)"
                        : "polygon(6% 0, 94% 0, 88% 100%, 12% 100%)",
                  }}
                >
                  <div className="leading-tight text-center">
                    <div className="font-semibold">{l.label}</div>
                    <div className="text-[9px] opacity-90">{l.count}个</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 w-16 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs font-medium tabular-nums" style={{ color: l.color }}>
                  {l.pct}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
