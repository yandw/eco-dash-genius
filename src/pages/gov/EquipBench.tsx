import { AppLayout } from "@/components/AppLayout";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

const benchmark = [
  { name: "电机系统", actual: 68, standard: 75 },
  { name: "锅炉系统", actual: 82, standard: 88 },
  { name: "压缩空气", actual: 71, standard: 78 },
  { name: "冷热源", actual: 65, standard: 72 },
  { name: "工艺加热", actual: 58, standard: 70 },
];

const levelDist = [
  { name: "1级(领跑)", value: 18, color: "hsl(152 65% 50%)" },
  { name: "2级(先进)", value: 35, color: "hsl(217 91% 56%)" },
  { name: "3级(达标)", value: 42, color: "hsl(40 95% 55%)" },
  { name: "未达标", value: 12, color: "hsl(0 75% 60%)" },
];

const overList = [
  { name: "宝钢 #2 加热炉", type: "工艺加热", val: 45.2, std: 38, gap: "+19%" },
  { name: "上海石化 P-101 压缩机", type: "压缩空气", val: 0.32, std: 0.27, gap: "+18%" },
  { name: "华谊 R-2 反应釜", type: "冷热源", val: 88.5, std: 76, gap: "+16%" },
  { name: "吴泾电厂 #3 锅炉", type: "锅炉系统", val: 82, std: 73, gap: "+12%" },
];

export default function EquipBench() {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="设备对标 · 重点用能设备能效水平">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="panel p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">主要设备能效对标 (实际 vs 国标先进值)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={benchmark}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="standard" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">能效等级分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={levelDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {levelDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {levelDist.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} />
                <span className="text-muted-foreground">{l.name}</span>
                <span className="ml-auto tabular-nums font-medium">{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="text-sm font-semibold mb-3">超标设备清单</h3>
        <div className="space-y-2">
          {overList.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-2.5 rounded border border-border/60 bg-card hover:border-destructive/40">
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">{d.type}</Badge>
              <span className="text-sm font-medium flex-1">{d.name}</span>
              <span className="text-xs text-muted-foreground">实际 <span className="font-bold text-foreground">{d.val}</span> · 标准 {d.std}</span>
              <Badge className="bg-destructive/15 text-destructive border-destructive/40 border text-[10px]">{d.gap}</Badge>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
