import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const alarms = [
  { id: 1, level: "critical", title: "压缩空气站功率超限", source: "压缩空气站 #3", time: "12:42:18" },
  { id: 2, level: "warning", title: "2号车间能耗偏高", source: "2号生产车间", time: "11:30:05" },
  { id: 3, level: "warning", title: "锅炉效率低于阈值", source: "锅炉房 B-02", time: "10:18:44" },
  { id: 4, level: "info", title: "月度限额完成度 85%", source: "能源限额", time: "09:00:00" },
  { id: 5, level: "critical", title: "变压器温度异常", source: "高压配电室", time: "08:24:11" },
  { id: 6, level: "warning", title: "制冷站COP下降", source: "制冷站 #1", time: "07:55:30" },
  { id: 7, level: "info", title: "节能技改项目验收", source: "节能档案", time: "昨日" },
];

const config = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "紧急" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "预警" },
  info: { icon: Info, color: "text-secondary", bg: "bg-secondary/10", label: "提示" },
};

export function AlarmList() {
  return (
    <div className="panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">告警与异常</h3>
          <p className="text-xs text-muted-foreground mt-0.5">实时推送 · 今日 12 条</p>
        </div>
        <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">
          2 紧急
        </Badge>
      </div>
      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-2">
          {alarms.map((a) => {
            const c = config[a.level as keyof typeof config];
            const Icon = c.icon;
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-md border border-border/50 bg-muted/20 p-3 transition-smooth hover:border-primary/40 hover:bg-muted/40 cursor-pointer"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${c.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${c.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate">{a.title}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{a.source}</span>
                    <span className="font-mono">{a.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
