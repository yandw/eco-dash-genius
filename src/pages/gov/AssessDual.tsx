import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Save, Send, Undo2, Upload, FileCheck2, Eye, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
import { DistrictListTable } from "@/components/assess/DistrictListTable";
import { DistrictAssessTable } from "@/components/assess/DistrictAssessTable";
import { StampedDocDialog, type StampedDocFile } from "@/components/assess/StampedDocDialog";
import {
  energyAssess,
  districtAssessSummary,
  type EnergyAssessRow,
} from "@/mocks/assess";
import {
  useAssessStatusStore,
  submitAssess,
  rollbackAssess,
  setAssessDoc,
} from "@/mocks/assessStatusStore";
import { getCurrentRole, currentUser } from "@/mocks/currentUser";
import { toast } from "sonner";

export default function AssessDual() {
  const role = getCurrentRole();
  const navigate = useNavigate();
  const isCity = role === "city_admin";
  const [year, setYear] = useState(2025);
  const [rows, setRows] = useState<EnergyAssessRow[]>(energyAssess);
  const [uploadOpen, setUploadOpen] = useState(false);
  const statusStore = useAssessStatusStore();

  // 当前区（区级管理员）
  const myDistrictId = (currentUser as unknown as { districtId?: string }).districtId ?? "qingpu";
  const myEntry = statusStore[myDistrictId];
  const myStatus = myEntry?.status ?? "待考核";
  const myDoc = myEntry?.doc;
  const submitted = myStatus === "完成考核";

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

  // 合并 store 状态到列表
  const mergedSummary = useMemo(
    () =>
      districtAssessSummary.map((d) => {
        const e = statusStore[d.districtId];
        return {
          ...d,
          status: (e?.status ?? d.status) as typeof d.status,
          assessTime: e?.assessTime ?? d.assessTime,
          hasStampedDoc: !!e?.doc || d.hasStampedDoc,
        };
      }),
    [statusStore],
  );

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
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">参与区数</div><div className="text-lg font-semibold">{mergedSummary.length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">完成考核</div><div className="text-lg font-semibold text-success">{mergedSummary.filter((d) => (d.status as string) === "完成考核" || d.status === "已考核").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">考核中</div><div className="text-lg font-semibold text-warning">{mergedSummary.filter((d) => d.status === "考核中").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">待考核</div><div className="text-lg font-semibold text-muted-foreground">{mergedSummary.filter((d) => d.status === "待考核").length}</div></Card>
            </div>

            <DistrictListTable variant="assess" rows={mergedSummary} year={year} onAction={(id) => navigate(`/gov/assess/dual/district/${id}`)} />
          </TabsContent>

          <TabsContent value="bq" className="mt-4">
            <Card className="p-6 text-sm text-muted-foreground">"百家"、"千家"、通信业企业能耗考核大表（与区下属考评样式一致），已对接年报数据。</Card>
          </TabsContent>
        </Tabs>

      </AppLayout>
    );
  }

  // ============= 区级视图 =============
  return (
    <AppLayout side="gov" title="双控考核" subtitle="本区企业能耗双控考评">
      <div className="text-xs text-muted-foreground mb-3">双控考核 / 青浦区下属企业能耗目标考评</div>

      <StampedDocDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        year={year}
        initialFile={myDoc}
        onConfirm={(file) => setAssessDoc(myDistrictId, file)}
      />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <AssessYearPicker year={year} onChange={setYear} />
        <div className="flex items-center gap-2 flex-wrap">
          {myDoc ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                title="点击下载"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = myDoc.url;
                  a.download = myDoc.name;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  toast.success(`正在下载 ${myDoc.name}`);
                }}
              >
                <FileCheck2 className="h-3.5 w-3.5 mr-1 text-success" />
                <span className="max-w-[180px] truncate">{myDoc.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                title="预览"
                onClick={() => window.open(myDoc.url, "_blank", "noopener")}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                title="删除"
                onClick={() => { setAssessDoc(myDistrictId, undefined); toast.success("已删除盖章证明"); }}
                disabled={submitted}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-9" onClick={() => setUploadOpen(true)} disabled={submitted}>
                <Upload className="h-3.5 w-3.5 mr-1" />重新上传
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="h-9" onClick={() => setUploadOpen(true)} disabled={submitted}>
              <Upload className="h-3.5 w-3.5 mr-1" />上传盖章证明
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已导出")}>
            <Download className="h-3.5 w-3.5 mr-1" />导出
          </Button>
          {submitted ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-warning border-warning/40 hover:text-warning"
              onClick={() => { rollbackAssess(myDistrictId); toast.success("已退回，可重新编辑"); }}
            >
              <Undo2 className="h-3.5 w-3.5 mr-1" />退回
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已保存")} >
                <Save className="h-3.5 w-3.5 mr-1" />保存
              </Button>
              <Button
                size="sm"
                className="h-9 bg-gradient-primary text-primary-foreground"
                onClick={() => { submitAssess(myDistrictId); toast.success("已提交至市级，状态：完成考核"); }}
              >
                <Send className="h-3.5 w-3.5 mr-1" />提交
              </Button>
            </>
          )}
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

          <DistrictAssessTable rows={rows} mode={submitted ? "city-view" : "district-edit"} onChange={update} />
        </TabsContent>

        <TabsContent value="bq" className="mt-4">
          <Card className="p-6 text-sm text-muted-foreground">"百家"、"千家"、通信业企业能耗考核 — 字段同上，由市级直接派发。</Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
