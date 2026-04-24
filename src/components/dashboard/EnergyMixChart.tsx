import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "电力", value: 4820, target: 5000 },
  { name: "天然气", value: 1240, target: 1300 },
  { name: "蒸汽", value: 880, target: 900 },
  { name: "水", value: 620, target: 700 },
  { name: "煤炭", value: 320, target: 400 },
];

export function EnergyMixChart() {
  return (
    <div className="panel p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">能源结构与限额对比</h3>
          <p className="text-xs text-muted-foreground mt-0.5">本月实际 vs 限额</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="target" name="限额" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="value" name="实际" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
