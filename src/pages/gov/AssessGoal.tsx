import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Upload, FileCheck2, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CarbonGoalTable } from "@/components/assess/CarbonGoalTable";
import { BqGoalTable } from "@/components/assess/BqGoalTable";
import { DistrictListTable } from "@/components/assess/DistrictListTable";
import { EditWithRemarkSheet } from "@/components/assess/EditWithRemarkSheet";
import {
  carbonGoals,
  bqGoals,
  districtGoalSummary,
  type CarbonGoalRow,
  type ChangeRecord,
} from "@/mocks/assess";
import { getCurrentRole } from "@/mocks/currentUser";
import { toast } from "sonner";

const YEARS = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = 2026;

export default function AssessGoal() {
  const role = getCurrentRole();
  const navigate = useNavigate();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [rows, setRows] = useState<CarbonGoalRow[]>(carbonGoals);
  const [stampedDoc, setStampedDoc] = useState<Record<number, { name: string; size: number } | undefined>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // 区级编辑
  const [editing, setEditing] = useState<CarbonGoalRow | null>(null);

  const summary = useMemo(() => {
    const total = rows.reduce((s, r) => s + (r.total2026 ?? 0), 0);
    const avgIntensity = (rows.filter((r) => r.intensity2026).reduce((s, r) => s + (r.intensity2026 ?? 0), 0) / Math.max(1, rows.filter((r) => r.intensity2026).length)).toFixed(3);
    const submitted = rows.filter((r) => r.status !== "draft").length;
    const modified = rows.filter((r) => r.status === "modified").length;
    return { total, avgIntensity, submitted, modified, count: rows.length };
  }, [rows]);

  const isCity = role === "city_admin";
  const currentDoc = stampedDoc[year];

  const handleSaveEdit = (id: string, patch: Partial<CarbonGoalRow>, changes: ChangeRecord[]) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...patch, changes: [...r.changes, ...changes] }
          : r,
      ),
    );
  };

  const handleUpload = (file: File) => {
    setStampedDoc((m) => ({ ...m, [year]: { name: file.name, size: file.size } }));
    toast.success(`已上传盖章证明：${file.name}`);
  };

  const handleDownload = () => {
    if (!currentDoc) return;
    toast.success(`正在下载 ${currentDoc.name}`);
  };

  return (
    <AppLayout side="gov" title="目标分解" subtitle={isCity ? "全市 17 区目标分解汇总与下钻" : "本区企业碳排放目标分解"}>
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        {isCity ? "全市重点单位碳排放目标分解" : "区下属单位碳排放目标分解"}
      </h1>

      {/* 报告年度 */}
      <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
          报告年度
        </span>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => {
            const active = year === y;
            return (
              <div key={y} className="relative">
                <Button
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className={cn(
                    "h-8 min-w-[80px]",
                    active && "bg-gradient-primary text-primary-foreground border-0",
                  )}
                  onClick={() => setYear(y)}
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

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {!isCity && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = "";
                }}
              />
              {currentDoc ? (
                <>
                  <Button variant="outline" size="sm" className="h-9" onClick={handleDownload}>
                    <FileCheck2 className="h-3.5 w-3.5 mr-1 text-success" />
                    {currentDoc.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-muted-foreground hover:text-destructive"
                    onClick={() => setStampedDoc((m) => ({ ...m, [year]: undefined }))}
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />重新上传
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="h-9" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5 mr-1" />上传盖章证明
                </Button>
              )}
            </>
          )}
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已导出 Excel")}>
          <Download className="h-3.5 w-3.5 mr-1" />导出
        </Button>
      </div>

      {isCity ? (
        <Tabs defaultValue="district">
          <TabsList>
            <TabsTrigger value="district">区下属单位碳排放目标分解</TabsTrigger>
            <TabsTrigger value="bq">"百家"、"千家"、通信业企业碳排放目标分解</TabsTrigger>
          </TabsList>

          <TabsContent value="district" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">参与区数</div><div className="text-lg font-semibold">{districtGoalSummary.length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{districtGoalSummary.filter((d) => d.status === "已完成").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">进行中</div><div className="text-lg font-semibold text-warning">{districtGoalSummary.filter((d) => d.status === "进行中").length}</div></Card>
              <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold text-primary">{districtGoalSummary.reduce((s, d) => s + d.count, 0)}</div></Card>
            </div>
            <DistrictListTable variant="goal" rows={districtGoalSummary} year={year} onAction={(id) => navigate(`/gov/assess/goal/district/${id}`)} />
          </TabsContent>

          <TabsContent value="bq" className="mt-4">
            <BqGoalTable rows={bqGoals} mode="city-view" />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{summary.count}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">已提交</div><div className="text-lg font-semibold text-success">{summary.submitted}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">已修改</div><div className="text-lg font-semibold text-warning">{summary.modified}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">总量目标（万吨CO₂）</div><div className="text-lg font-semibold text-primary">{summary.total.toLocaleString()}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">平均强度</div><div className="text-lg font-semibold">{summary.avgIntensity}</div></Card>
          </div>
          <CarbonGoalTable rows={rows} mode="district-view" onEdit={setEditing} />
        </div>
      )}

      <EditWithRemarkSheet
        open={!!editing}
        row={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveEdit}
      />
    </AppLayout>
  );
}
