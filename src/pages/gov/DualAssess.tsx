import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

const radar = [
  { k: "能耗强度", a: 92 },
  { k: "碳排强度", a: 86 },
  { k: "总量控制", a: 78 },
  { k: "节能技改", a: 88 },
  { k: "数据上报", a: 95 },
  { k: "在线监测", a: 82 },
];

const ranking = ["浦东新区", "闵行区", "嘉定区", "宝山区", "松江区", "金山区", "奉贤区", "青浦区"].map((d, i) => ({
  d,
  score: 95 - i * 2.5,
  level: i < 2 ? "优秀" : i < 5 ? "良好" : "合格",
}));

const levelColor: Record<string, string> = {
  优秀: "bg-success/15 text-success border-success/40",
  良好: "bg-primary/15 text-primary border-primary/40",
  合格: "bg-warning/15 text-warning border-warning/40",
};

export default function DualAssess() {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="双控考核 · 各区县考核结果与排行">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">考核维度评分</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="k" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Radar dataKey="a" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h3 className="text-sm font-semibold mb-3">各区考核排行</h3>
          <div className="space-y-2">
            {ranking.map((r, i) => (
              <div key={r.d} className="flex items-center gap-3 p-2 rounded border border-border/60 bg-card hover:border-primary/40">
                <div className={`h-7 w-7 rounded flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className="text-sm font-medium flex-1">{r.d}</span>
                <Badge className={`text-[10px] border ${levelColor[r.level]}`}>{r.level}</Badge>
                <span className="text-sm font-bold text-primary tabular-nums w-12 text-right">{r.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
