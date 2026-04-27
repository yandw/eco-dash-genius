import { useState } from "react";
import { Database, Factory } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const years = [2014, 2015, 2016, 2017, 2018];

const trendData = [
  { y: "2013", v: 0.27 },
  { y: "2014", v: 0.27 },
  { y: "2015", v: 0.28 },
  { y: "2016", v: 0.26 },
  { y: "2017", v: 0.23 },
  { y: "2018", v: 0.21 },
  { y: "2019", v: 0.19 },
  { y: "2020", v: 0.17 },
  { y: "2021", v: 0.14 },
  { y: "2022", v: 0.13 },
  { y: "2023", v: 0.12 },
  { y: "2024", v: 0.18 },
];

// 仪表盘指针 0-1，当前 0.273 → 角度 -90 + 0.273*180
function GaugeChart({ value }: { value: number }) {
  const pct = Math.min(Math.max(value, 0), 1);
  const angle = -90 + pct * 180;
  const cx = 100;
  const cy = 90;
  const r = 70;

  // 颜色分段：0-0.25 绿,0.25-0.5 蓝,0.5-0.75 黄,0.75-1 红
  const arcs = [
    { from: -90, to: -45, color: "hsl(265 85% 65%)" },
    { from: -45, to: 0, color: "hsl(217 91% 55%)" },
    { from: 0, to: 45, color: "hsl(40 95% 55%)" },
    { from: 45, to: 90, color: "hsl(0 75% 60%)" },
  ];

  const polar = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  const arcPath = (from: number, to: number, radius: number) => {
    const [x1, y1] = polar(from, radius);
    const [x2, y2] = polar(to, radius);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const [px, py] = polar(angle, r - 8);

  return (
    <svg viewBox="0 0 200 120" className="w-full h-[120px]">
      {arcs.map((a, i) => (
        <path
          key={i}
          d={arcPath(a.from, a.to, r)}
          fill="none"
          stroke={a.color}
          strokeWidth={10}
          strokeLinecap="round"
        />
      ))}
      {/* 刻度 */}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => {
        const [tx, ty] = polar(-90 + v * 180, r + 14);
        return (
          <text
            key={v}
            x={tx}
            y={ty}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontSize={9}
          >
            {v}
          </text>
        );
      })}
      {/* 指针 */}
      <line
        x1={cx}
        y1={cy}
        x2={px}
        y2={py}
        stroke="hsl(var(--primary))"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={5} fill="hsl(var(--primary))" />
    </svg>
  );
}

export function DecadeGlance() {
  const [year, setYear] = useState(2016);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-primary" />
        十年节能一眼观
      </h3>

      {/* 年份切换 */}
      <div className="flex items-center justify-between gap-1 mb-3">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`flex-1 text-xs py-1.5 rounded transition-smooth ${
              y === year
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* 两个数据卡 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-md bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-2.5 flex items-center gap-2">
          <Database className="h-7 w-7 text-primary shrink-0" />
          <div className="min-w-0">
            <div className="text-base font-bold tabular-nums truncate">16,221.2</div>
            <div className="text-[10px] text-muted-foreground">企业年产值 (亿元)</div>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 p-2.5 flex items-center gap-2">
          <Factory className="h-7 w-7 text-secondary shrink-0" />
          <div className="min-w-0">
            <div className="text-base font-bold tabular-nums truncate">3,959.7</div>
            <div className="text-[10px] text-muted-foreground">年综合能耗 (万tce)</div>
          </div>
        </div>
      </div>

      {/* 仪表盘 */}
      <div className="rounded-md border border-border/60 bg-card/60 p-2 mb-3">
        <GaugeChart value={0.273} />
        <div className="text-center -mt-2">
          <div className="text-xl font-bold text-primary tabular-nums">0.273</div>
          <div className="text-[10px] text-muted-foreground">tCO₂ / 万元</div>
        </div>
      </div>

      {/* 折线 */}
      <div className="flex-1 min-h-[140px]">
        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-2">
          <span>tCO₂/万元</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-0.5 w-3 bg-primary" />
            碳排放强度
          </span>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="y" fontSize={9} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
