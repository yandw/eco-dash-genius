import { AppLayout } from "@/components/AppLayout";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const levelData = Array.from({ length: 15 }).map((_, i) => ({
  y: 2010 + i,
  "5k~50k": 320 + i * 10,
  "50k~500k": 80 + i * 4,
  "500k~5000k": 30 + (i % 4),
  "5000k~": 8,
}));

const intensity = Array.from({ length: 12 }).map((_, i) => ({
  y: 2013 + i,
  v: +(0.42 - i * 0.018 + Math.sin(i) * 0.01).toFixed(3),
}));

const totalForecast = Array.from({ length: 15 }).map((_, i) => ({
  y: 2010 + i,
  v: 4200 + Math.round(Math.sin(i) * 200) + i * 20,
}));

export default function Decade() {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="十年节能 · 重点用能单位历年趋势">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">企业数量与能耗等级 · 2010—2024</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={levelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="y" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="5k~50k" stackId="a" fill="hsl(152 65% 50%)" />
              <Bar dataKey="50k~500k" stackId="a" fill="hsl(217 91% 56%)" />
              <Bar dataKey="500k~5000k" stackId="a" fill="hsl(40 95% 55%)" />
              <Bar dataKey="5000k~" stackId="a" fill="hsl(0 75% 60%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">综合能耗强度(等价) · 2013—2024</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={intensity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="y" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">重点用能单位综合能耗(吨标煤) · 含预测</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={totalForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="y" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="v" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
