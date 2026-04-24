import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "1月", carbon: 1240, energy: 980 },
  { month: "2月", carbon: 1180, energy: 950 },
  { month: "3月", carbon: 1320, energy: 1080 },
  { month: "4月", carbon: 1100, energy: 920 },
  { month: "5月", carbon: 1050, energy: 880 },
  { month: "6月", carbon: 980, energy: 820 },
  { month: "7月", carbon: 1120, energy: 940 },
  { month: "8月", carbon: 1080, energy: 900 },
  { month: "9月", carbon: 960, energy: 800 },
  { month: "10月", carbon: 890, energy: 740 },
  { month: "11月", carbon: 820, energy: 690 },
  { month: "12月", carbon: 760, energy: 640 },
];

export function CarbonTrendChart() {
  return (
    <div className="panel p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">碳排放与能耗趋势</h3>
          <p className="text-xs text-muted-foreground mt-0.5">近12个月 · 单位 tCO₂e / tce</p>
        </div>
        <div className="flex gap-2">
          {["年", "季", "月"].map((p, i) => (
            <button
              key={p}
              className={`text-xs px-2 py-1 rounded border transition-smooth ${
                i === 2
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="carbon"
            name="碳排放"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#carbonGrad)"
          />
          <Area
            type="monotone"
            dataKey="energy"
            name="综合能耗"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            fill="url(#energyGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
