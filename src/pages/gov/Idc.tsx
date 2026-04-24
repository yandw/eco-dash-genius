import { AppLayout } from "@/components/AppLayout";
import { MonitoringTabs } from "@/components/MonitoringTabs";
import { Server, Zap, HardDrive, Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

const pueDist = [
  { range: "<1.2", count: 3, color: "hsl(152 65% 50%)" },
  { range: "1.2-1.3", count: 9, color: "hsl(200 90% 55%)" },
  { range: "1.3-1.5", count: 23, color: "hsl(217 91% 56%)" },
  { range: "1.5-1.8", count: 14, color: "hsl(40 95% 55%)" },
  { range: "≥1.8", count: 4, color: "hsl(0 75% 60%)" },
];

const idcList = [
  { name: "上海某云计算中心一期", area: "浦东新区", pue: 1.28, racks: 8200, status: "正常" },
  { name: "万国数据 SH3 数据中心", area: "宝山区", pue: 1.35, racks: 6500, status: "正常" },
  { name: "中国电信外高桥数据中心", area: "浦东新区", pue: 1.42, racks: 5800, status: "正常" },
  { name: "鹏博士长宁数据中心", area: "长宁区", pue: 1.62, racks: 3200, status: "预警" },
  { name: "世纪互联宝山数据中心", area: "宝山区", pue: 1.85, racks: 2400, status: "超标" },
];

export default function Idc() {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="IDC 监察 · 数据中心 PUE 与能耗">
      <MonitoringTabs />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { icon: Server, label: "IDC接入数", value: "106", unit: "个", color: "primary" },
          { icon: Zap, label: "平均PUE", value: "1.55", unit: "", color: "secondary" },
          { icon: HardDrive, label: "IT设备能耗", value: "115.4", unit: "万tce", color: "primary" },
          { icon: Activity, label: "在线机柜", value: "82,400", unit: "个", color: "secondary" },
        ].map((k) => (
          <div key={k.label} className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums">{k.value}</span>
                  {k.unit && <span className="text-xs text-muted-foreground">{k.unit}</span>}
                </div>
              </div>
              <k.icon className={`h-8 w-8 ${k.color === "primary" ? "text-primary" : "text-secondary"}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">PUE 区间分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pueDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="range" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {pueDist.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">IDC 项目清单 TOP</h3>
          <div className="space-y-2">
            {idcList.map((d) => (
              <div key={d.name} className="flex items-center gap-3 p-2.5 rounded border border-border/60 bg-card hover:border-primary/40">
                <Server className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.area} · {d.racks.toLocaleString()} 机柜</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary tabular-nums">PUE {d.pue}</div>
                  <Badge className={`text-[10px] mt-0.5 border ${
                    d.status === "正常" ? "bg-success/15 text-success border-success/40" :
                    d.status === "预警" ? "bg-warning/15 text-warning border-warning/40" :
                    "bg-destructive/15 text-destructive border-destructive/40"
                  }`}>{d.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
