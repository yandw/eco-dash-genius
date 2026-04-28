import { useState } from "react";
import { Download, Save, Send, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
import { DistrictListTable } from "@/components/assess/DistrictListTable";
import { DistrictAssessTable } from "@/components/assess/DistrictAssessTable";
import {
  energyAssess,
  districtAssessSummary,
  districts,
  type EnergyAssessRow,
} from "@/mocks/assess";
import { getCurrentRole } from "@/mocks/currentUser";
import { toast } from "sonner";

export default function AssessDual() {
  const role = getCurrentRole();
  const isCity = role === "city_admin";
  const [year, setYear] = useState(2025);
  const [rows, setRows] = useState<EnergyAssessRow[]>(energyAssess);
  const [drillId, setDrillId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<EnergyAssessRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const summary = {
    count: rows.length,
    pass: rows.filter((r) => {
      if (!r.totalGoal || !r.intensityGoal) return false;
      return r.totalActualNetGreen <= r.totalGoal && r.intensityActualNetGreen <= r.intensityGoal;
    }).length,
  };

  const drillName = districts.find((d) => d.id === drillId)?.name;

  // ============= 市级视图 =============
  if (isCity) {
    return (
      <AppLayout side="gov" title="双控考核" subtitle="全市 17 区能耗双控考核状态与下钻">
        <div className="text-xs text-muted-foreground mb-3">双控考核 / 区下属单位能耗目标考核</div>

        <div className="flex items-center justify-between mb-4">
          <AssessYearPicker year={year} onChange={setYear} />
        </div>

        <Tabs defaultValue="district">
          <TabsList>
            <TabsTrigger value="district">区下属单位能耗目标考核</TabsTrigger>
            <TabsTrigger value="bq">"百家"、"千家"、通信业企业能耗考核</TabsTrigger>
          </TabsList>

          <TabsContent value="district" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">参与区数</div><div className="text-lg font-semibold">{districtAssessSummary.length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">已考核</div><div className="text-lg font-semibold text-success">{districtAssessSummary.filter((d) => d.status === "已考核").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">考核中</div><div className="text-lg font-semibold text-warning">{districtAssessSummary.filter((d) => d.status === "考核中").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">待考核</div><div className="text-lg font-semibold text-muted-foreground">{districtAssessSummary.filter((d) => d.status === "待考核").length}</div></Card>
            </div>

            <DistrictListTable variant="assess" rows={districtAssessSummary} year={year} onAction={setDrillId} />
          </TabsContent>

          <TabsContent value="bq" className="mt-4">
            <Card className="p-6 text-sm text-muted-foreground">"百家"、"千家"、通信业企业能耗考核大表（与区下属考评样式一致），已对接年报数据。</Card>
          </TabsContent>
        </Tabs>

        {/* 市级下钻 */}
        <Dialog open={!!drillId} onOpenChange={(v) => !v && setDrillId(null)}>
          <DialogContent className="max-w-[95vw] w-[95vw] max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{drillName} 下属企业能耗目标考评</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("已导出")}>
                    <Download className="h-3.5 w-3.5 mr-1" />导出
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => setDrillId(null)}>
                    <X className="h-3.5 w-3.5 mr-1" />关闭
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground mb-2">
              考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有1项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
            </div>
            {drillId === "qingpu" ? (
              <DistrictAssessTable rows={rows} mode="city-view" />
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">演示数据仅包含青浦区，其它区显示样式相同。</div>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  }

  // ============= 区级视图 =============
  return (
    <AppLayout side="gov" title="双控考核" subtitle="本区企业能耗双控考评">
      <div className="text-xs text-muted-foreground mb-3">双控考核 / 青浦区下属企业能耗目标考评</div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <AssessYearPicker year={year} onChange={setYear} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已导出")}>
            <Download className="h-3.5 w-3.5 mr-1" />导出
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已保存")}>
            <Save className="h-3.5 w-3.5 mr-1" />保存
          </Button>
          <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("已提交至市级")}>
            <Send className="h-3.5 w-3.5 mr-1" />提交
          </Button>
        </div>
      </div>

      <Tabs defaultValue="district">
        <TabsList>
          <TabsTrigger value="district">区下属单位能耗目标考核</TabsTrigger>
          <TabsTrigger value="bq">"百家"、"千家"、通信业企业能耗考核</TabsTrigger>
        </TabsList>

        <TabsContent value="district" className="mt-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{summary.count}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">完成</div><div className="text-lg font-semibold text-success">{summary.pass}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">未完成</div><div className="text-lg font-semibold text-destructive">{summary.count - summary.pass}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">达标率</div><div className="text-lg font-semibold text-primary">{Math.round((summary.pass / summary.count) * 100)}%</div></Card>
          </div>

          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有1项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
          </div>

          <DistrictAssessTable rows={rows} mode="district-edit" onChange={update} />
        </TabsContent>

        <TabsContent value="bq" className="mt-4">
          <Card className="p-6 text-sm text-muted-foreground">"百家"、"千家"、通信业企业能耗考核 — 字段同上，由市级直接派发。</Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
