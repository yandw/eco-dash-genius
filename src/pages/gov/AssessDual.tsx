import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Save, Send, Undo2, Upload, FileCheck2, Eye, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DistrictListTable } from "@/components/assess/DistrictListTable";
import { DistrictAssessTable } from "@/components/assess/DistrictAssessTable";
import { StampedDocDialog } from "@/components/assess/StampedDocDialog";
import { BqEntAssessTable } from "@/components/assess/BqEntAssessTable";
import { AssessEmptyState } from "@/components/assess/AssessEmptyState";
import {
  energyAssess,
  districtAssessSummary,
  type EnergyAssessRow,
} from "@/mocks/assess";
import { useBqAssessStore, setBqReport } from "@/mocks/bqAssessStore";
import {
  useAssessStatusStore,
  submitAssess,
  rollbackAssess,
  setAssessDoc,
} from "@/mocks/assessStatusStore";
import { getCurrentRole, currentUser } from "@/mocks/currentUser";
import {
  DUAL_TASK_TYPES,
  hasActiveTask,
  listActiveYears,
  useAssessTasksStore,
} from "@/mocks/assessTasks";
import { toast } from "sonner";

const CURRENT_YEAR = 2026;

function YearTabs({ year, onChange, years }: { year: number; onChange: (y: number) => void; years: number[] }) {
  return (
    <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
        <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
        报告年度
      </span>
      <div className="flex flex-wrap gap-2">
        {years.map((y) => {
          const active = year === y;
          return (
            <div key={y} className="relative">
              <Button
                size="sm"
                variant={active ? "default" : "outline"}
                className={cn("h-8 min-w-[80px]", active && "bg-gradient-primary text-primary-foreground border-0")}
                onClick={() => onChange(y)}
              >
                {y}年
              </Button>
              {y === CURRENT_YEAR && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 h-4 leading-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium shadow-sm pointer-events-none">
                  本期
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AssessDual() {
  const role = getCurrentRole();
  const navigate = useNavigate();
  const isCity = role === "city_admin";
  const [year, setYear] = useState(CURRENT_YEAR);
  const [rows, setRows] = useState<EnergyAssessRow[]>(energyAssess);
  const [uploadOpen, setUploadOpen] = useState(false);
  const bqRows = useBqAssessStore();
  const statusStore = useAssessStatusStore();

  const bqStats = useMemo(() => ({
    total: bqRows.length,
    done: bqRows.filter((r) => r.status === "已完成").length,
    doing: bqRows.filter((r) => r.status === "考核中").length,
    pending: bqRows.filter((r) => r.status === "待考核").length,
    uploaded: bqRows.filter((r) => !!r.reportFile).length,
  }), [bqRows]);



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

        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
          重点单位能耗双控考核结果
        </h1>

        <YearTabs year={year} onChange={setYear} />

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

          <TabsContent value="bq" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{bqStats.total}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{bqStats.done}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">考核中</div><div className="text-lg font-semibold text-warning">{bqStats.doing}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">待考核</div><div className="text-lg font-semibold text-muted-foreground">{bqStats.pending}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">已上传报告</div><div className="text-lg font-semibold text-primary">{bqStats.uploaded}</div></Card>
            </div>
            <BqEntAssessTable
              rows={bqRows}
              onOpenDetail={(r) => navigate(`/gov/assess/dual/bq/${r.id}`)}
              onUploadReport={setBqReport}
            />

          </TabsContent>
        </Tabs>

      </AppLayout>
    );
  }

  // ============= 区级视图 =============
  return (
    <AppLayout side="gov" title="双控考核" subtitle="本区企业能耗双控考评">
      <div className="text-xs text-muted-foreground mb-3">双控考核 / 青浦区下属企业能耗目标考评</div>

      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        重点单位能耗双控考核结果
      </h1>

      <YearTabs year={year} onChange={setYear} />

      <StampedDocDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        year={year}
        initialFile={myDoc}
        onConfirm={(file) => setAssessDoc(myDistrictId, file)}
      />

      <div className="flex items-center justify-end mb-4 flex-wrap gap-2">
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

      <div className="space-y-3">
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
      </div>
    </AppLayout>
  );
}
