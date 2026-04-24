export function DualControlTrack() {
  // 金字塔三层
  const pyramid = [
    { label: "百家", value: 1, color: "hsl(40 95% 60%)" },
    { label: "千家", value: 1, color: "hsl(200 90% 60%)" },
    { label: "万家", value: 98, color: "hsl(217 91% 56%)" },
  ];

  // 行业环 - 汽车制造 13%
  const pct = 13;
  const r = 50;
  const c = 2 * Math.PI * r;

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-primary" />
        能碳双控跟踪
      </h3>

      <div className="flex-1 grid grid-cols-2 gap-3 items-center">
        {/* 三角金字塔 */}
        <div className="flex flex-col gap-1.5">
          {pyramid.map((p, i) => {
            const widths = [50, 75, 100];
            return (
              <div key={p.label} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-8 text-right">{p.label}</span>
                <div className="flex-1 flex justify-start">
                  <div
                    className="h-5 rounded-sm flex items-center justify-end pr-2 text-[10px] font-medium text-white"
                    style={{ width: `${widths[i]}%`, background: p.color }}
                  >
                    {p.value}%
                  </div>
                </div>
              </div>
            );
          })}
          {/* 三角底座 */}
          <svg viewBox="0 0 100 30" className="w-full h-6 mt-1">
            <polygon points="0,30 100,30 50,0" fill="hsl(217 91% 56% / 0.3)" />
            <polygon points="20,30 80,30 50,0" fill="hsl(217 91% 56%)" />
          </svg>
        </div>

        {/* 行业环形 */}
        <div className="flex flex-col items-center">
          <div className="relative w-[120px] h-[120px]">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {/* 背景刻度环 */}
              {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i * 360) / 40;
                const rad = (angle * Math.PI) / 180;
                const x1 = 60 + 56 * Math.cos(rad);
                const y1 = 60 + 56 * Math.sin(rad);
                const x2 = 60 + 48 * Math.cos(rad);
                const y2 = 60 + 48 * Math.sin(rad);
                const filled = i / 40 < pct / 100;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={filled ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                    strokeWidth={2}
                  />
                );
              })}
              <circle
                cx={60}
                cy={60}
                r={r}
                fill="none"
                stroke="hsl(var(--muted) / 0.5)"
                strokeWidth={6}
              />
              <circle
                cx={60}
                cy={60}
                r={r}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={6}
                strokeDasharray={`${(c * pct) / 100} ${c}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[10px] text-muted-foreground">汽车制造</div>
              <div className="text-2xl font-bold text-primary tabular-nums">{pct}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
