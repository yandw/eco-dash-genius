import { Factory, MapPin } from "lucide-react";

const sites = [
  { id: 1, name: "1号生产车间", x: 22, y: 35, status: "normal", load: 78 },
  { id: 2, name: "2号生产车间", x: 48, y: 28, status: "warning", load: 92 },
  { id: 3, name: "锅炉房", x: 70, y: 45, status: "normal", load: 65 },
  { id: 4, name: "制冷站", x: 35, y: 62, status: "normal", load: 54 },
  { id: 5, name: "压缩空气站", x: 60, y: 70, status: "alarm", load: 98 },
  { id: 6, name: "办公楼", x: 82, y: 22, status: "normal", load: 32 },
];

const statusColor: Record<string, string> = {
  normal: "bg-success shadow-[0_0_12px_hsl(var(--success))]",
  warning: "bg-warning shadow-[0_0_12px_hsl(var(--warning))]",
  alarm: "bg-destructive shadow-[0_0_12px_hsl(var(--destructive))]",
};

export function PlantMap() {
  return (
    <div className="panel p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">厂区设备分布</h3>
          <p className="text-xs text-muted-foreground mt-0.5">实时负载 · 6 个监测点</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />正常</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />预警</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />告警</span>
        </div>
      </div>

      <div className="relative h-[280px] rounded-md border border-border/50 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />

        {sites.map((s) => (
          <div
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <div className={`relative h-3 w-3 rounded-full ${statusColor[s.status]}`}>
              <span className={`absolute inset-0 rounded-full ${statusColor[s.status].split(" ")[0]} animate-ping opacity-60`} />
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-smooth bg-popover border border-border rounded px-2 py-1 text-[11px] z-10">
              <div className="font-medium flex items-center gap-1"><Factory className="h-3 w-3" />{s.name}</div>
              <div className="text-muted-foreground">负载 {s.load}%</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          园区平面示意图
        </div>
      </div>
    </div>
  );
}
