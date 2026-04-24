import { AppLayout } from "@/components/AppLayout";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";

const monthly = Array.from({ length: 12 }).map((_, i) => ({
  m: `${i + 1}月`,
  energy: 60 + Math.round(Math.sin(i / 2) * 8) + i * 1.2,
  carbon: 55 + Math.round(Math.cos(i / 2) * 7) + i,
}));

const districts = ["浦东", "闵行", "嘉定", "宝山", "松江", "金山", "奉贤", "青浦"].map((d, i) => ({
  d,
  energy: 60 + ((i * 7) % 35),
  carbon: 50 + ((i * 11) % 40),
}));

export default function DualTrack() {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="双控跟踪 · 能耗双控 / 碳排双控月度进度">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { label: "全市能耗强度下降", value: 4.2, target: 5.0, unit: "%" },
          { label: "全市碳排强度下降", value: 5.6, target: 6.0, unit: "%" },
          { label: "总量控制完成率", value: 78, target: 100, unit: "%" },
        ].map((k) => (
          <div key={k.label} className="panel p-5">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary tabular-nums">{k.value}</span>
              <span className="text-xs text-muted-foreground">/ 目标 {k.target}{k.unit}</span>
            </div>
            <Progress value={(k.value / k.target) * 100} className="mt-3 h-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">月度能碳双控趋势</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="m" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="energy" name="能耗" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="carbon" name="碳排" stroke="hsl(var(--secondary))" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">各区进度对比</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="d" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="energy" name="能耗完成%" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="carbon" name="碳排完成%" fill="hsl(200 90% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
