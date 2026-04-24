import { Activity, Droplets, Flame, Leaf, TrendingDown, Zap, FileSearch, AlertTriangle, CheckCircle2, Clock, ChevronRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CarbonTrendChart } from "@/components/dashboard/CarbonTrendChart";
import { PlantMap } from "@/components/dashboard/PlantMap";
import { AlarmList } from "@/components/dashboard/AlarmList";
import { EnergyMixChart } from "@/components/dashboard/EnergyMixChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reviewStats = [
  { label: "待审核报告", value: "32", icon: FileSearch, accent: "text-warning", bg: "from-warning/10 to-warning/5" },
  { label: "今日已审", value: "18", icon: CheckCircle2, accent: "text-success", bg: "from-success/10 to-success/5" },
  { label: "超限预警企业", value: "7", icon: AlertTriangle, accent: "text-destructive", bg: "from-destructive/10 to-destructive/5" },
  { label: "纳入监管企业", value: "1,286", icon: Building2, accent: "text-primary", bg: "from-primary/10 to-primary/5" },
];

const pendingReviews = [
  { id: 1, ent: "上海某某新材料股份有限公司", type: "年度报告", submit: "2025-04-15 09:22", waited: "2小时", urgent: true },
  { id: 2, ent: "上海宝冶钢铁有限公司", type: "限额季报", submit: "2025-04-15 08:40", waited: "3小时", urgent: true },
  { id: 3, ent: "上海化工研究院", type: "绿色制造申报", submit: "2025-04-14 17:15", waited: "1天", urgent: false },
  { id: 4, ent: "上汽大众动力总成厂", type: "年度报告", submit: "2025-04-14 14:30", waited: "1天", urgent: false },
  { id: 5, ent: "宝山钢铁股份有限公司", type: "双控考核", submit: "2025-04-14 10:08", waited: "1天", urgent: false },
];

const Index = () => {
  return (
    <AppLayout side="gov" title="全景监测" subtitle="全市重点用能企业能源全景监测与监管审核">
      {/* 监管 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {reviewStats.map((s) => (
          <div key={s.label} className={`panel p-5 bg-gradient-to-br ${s.bg}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-card flex items-center justify-center ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 实时能耗 KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="全市电耗" value="4,820" unit="万kWh" delta={-3.2} icon={Zap} accent="primary" />
        <KpiCard label="天然气" value="1,240" unit="万m³" delta={1.8} icon={Flame} accent="warning" />
        <KpiCard label="工业新水" value="620" unit="万t" delta={-5.4} icon={Droplets} accent="secondary" />
        <KpiCard label="综合能耗" value="9,860" unit="万tce" delta={-2.1} icon={Activity} accent="primary" />
        <KpiCard label="碳排放" value="1,240" unit="万tCO₂e" delta={-4.6} icon={Leaf} accent="success" />
        <KpiCard label="单位GDP能耗" value="0.082" unit="tce/万元" delta={-7.3} icon={TrendingDown} accent="success" />
      </div>

      {/* 待审核 + 趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" />
              待审核报告
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              进入审核中心 <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {pendingReviews.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate">{r.ent}</span>
                    {r.urgent && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-destructive/15 text-destructive border-destructive/30 border">
                        加急
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                      {r.type}
                    </Badge>
                    <span className="font-mono">{r.submit}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 已等待 {r.waited}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 h-8">
                  立即审核
                </Button>
              </div>
            ))}
          </div>
        </div>
        <AlarmList />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <CarbonTrendChart />
        </div>
        <EnergyMixChart />
      </div>

      <PlantMap />
    </AppLayout>
  );
};

export default Index;
