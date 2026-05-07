import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Upload, FileCheck2, Trash2, Eye } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarbonGoalTable } from "@/components/assess/CarbonGoalTable";
import { BqGoalTable } from "@/components/assess/BqGoalTable";
import { DistrictListTable } from "@/components/assess/DistrictListTable";
import { StampedDocDialog, type StampedDocFile } from "@/components/assess/StampedDocDialog";

import {
  carbonGoals,
  bqGoals,
  districtGoalSummary,
  type CarbonGoalRow,
  type BqGoalRow,
  type ChangeRecord,
} from "@/mocks/assess";
import { getCurrentRole } from "@/mocks/currentUser";
import {
  GOAL_TASK_TYPES,
  getActiveTask,
  getDisplayTask,
  hasActiveTask,
  listActiveYears,
  useAssessTasksStore,
} from "@/mocks/assessTasks";
import { AssessEmptyState } from "@/components/assess/AssessEmptyState";
import { TaskCountdownBadge } from "@/components/assess/TaskCountdownBadge";
import { toast } from "sonner";

const CURRENT_YEAR = 2026;

export default function AssessGoal() {
  const role = getCurrentRole();
  const navigate = useNavigate();
  useAssessTasksStore(); // 订阅任务变化

  const isCity = role === "city_admin";
  // 区级：仅"区下属单位碳排放目标分解"；市级：两类都看
  const districtType = "区下属单位碳排放目标分解" as const;
  const bqType = "\"百家\"、\"千家\"、通信业企业碳排放目标分解" as const;
  const relevantTypes = isCity ? GOAL_TASK_TYPES : [districtType];

  const activeYears = listActiveYears(relevantTypes);
  const YEARS = activeYears.length > 0 ? activeYears : [CURRENT_YEAR];
  const initialYear = activeYears.includes(CURRENT_YEAR)
    ? CURRENT_YEAR
    : (activeYears[0] ?? CURRENT_YEAR);

  const [year, setYear] = useState(initialYear);
  const [rows, setRows] = useState<CarbonGoalRow[]>(carbonGoals);
  const [bqRows, setBqRows] = useState<BqGoalRow[]>(bqGoals);
  const [stampedDoc, setStampedDoc] = useState<Record<number, StampedDocFile | undefined>>({});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [modifiedFilter, setModifiedFilter] = useState<"all" | "modified" | "unmodified">("all");
  const [bqKeyword, setBqKeyword] = useState("");
  const [bqModifiedFilter, setBqModifiedFilter] = useState<"all" | "modified" | "unmodified">("all");

  useEffect(() => {
    if (activeYears.length && !activeYears.includes(year)) {
      setYear(activeYears[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYears.join(",")]);

  const hasDistrictTask = hasActiveTask(year, [districtType]);
  const hasBqTask = hasActiveTask(year, [bqType]);
  const hasAnyGoalTask = activeYears.length > 0;


  const summary = useMemo(() => {
    const total = rows.reduce((s, r) => s + (r.total2026 ?? 0), 0);
    const avgIntensity = (rows.filter((r) => r.intensity2026).reduce((s, r) => s + (r.intensity2026 ?? 0), 0) / Math.max(1, rows.filter((r) => r.intensity2026).length)).toFixed(3);
    const completed = rows.filter((r) => r.total2026 != null || r.intensity2026 != null).length;
    const modified = rows.filter((r) => r.status === "modified").length;
    return { total, avgIntensity, completed, modified, count: rows.length };
  }, [rows]);

  const currentDoc = stampedDoc[year];

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (modifiedFilter === "modified" && r.status !== "modified") return false;
      if (modifiedFilter === "unmodified" && r.status === "modified") return false;
      if (keyword.trim()) {
        const k = keyword.trim().toLowerCase();
        if (!r.entName.toLowerCase().includes(k) && !r.creditCode.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [rows, keyword, modifiedFilter]);

  const handleSaveEdit = (id: string, patch: Partial<CarbonGoalRow>, changes: ChangeRecord[]) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...patch, changes: [...r.changes, ...changes] }
          : r,
      ),
    );
  };

  const handleUploadConfirm = (file: StampedDocFile) => {
    setStampedDoc((m) => {
      const prev = m[year];
      if (prev) URL.revokeObjectURL(prev.url);
      return { ...m, [year]: file };
    });
  };

  const handleRemoveDoc = () => {
    const prev = stampedDoc[year];
    if (prev) URL.revokeObjectURL(prev.url);
    setStampedDoc((m) => ({ ...m, [year]: undefined }));
    toast.success("已删除盖章证明");
  };

  const handleDownload = () => {
    if (!currentDoc) return;
    const a = document.createElement("a");
    a.href = currentDoc.url;
    a.download = currentDoc.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success(`正在下载 ${currentDoc.name}`);
  };

  const handlePreview = () => {
    if (!currentDoc) return;
    window.open(currentDoc.url, "_blank", "noopener");
  };

  return (
    <AppLayout side="gov" title="目标分解" subtitle={isCity ? "全市 17 区目标分解汇总与下钻" : "本区企业碳排放目标分解"}>
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        {isCity ? "全市重点单位碳排放目标分解" : "区下属单位碳排放目标分解"}
      </h1>

      {!hasAnyGoalTask ? (
        <AssessEmptyState
          title="请在任务管理中创建目标分解任务"
          description={isCity ? "尚未创建任何目标分解任务，相关考核内容将在任务创建后展示。" : "市级管理员尚未下发目标分解任务，请稍后再来查看。"}
          showGoToTasks
        />
      ) : (
      <>

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

      <StampedDocDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        year={year}
        initialFile={currentDoc}
        onConfirm={handleUploadConfirm}
      />



      {isCity ? (
        !hasDistrictTask && !hasBqTask ? (
          <AssessEmptyState
            title={`${year} 年暂无目标分解任务`}
            description="请切换年份或在任务管理中创建该年度的目标分解任务。"
            showGoToTasks
          />
        ) : (
        <Tabs defaultValue={hasDistrictTask ? "district" : "bq"}>
          <TabsList>
            {hasDistrictTask && <TabsTrigger value="district">区下属单位碳排放目标分解</TabsTrigger>}
            {hasBqTask && <TabsTrigger value="bq">"百家"、"千家"、通信业企业碳排放目标分解</TabsTrigger>}
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

          <TabsContent value="bq" className="mt-4 space-y-4">
            {(() => {
              const bqTotal = bqRows.reduce((s, r) => s + (r.totalGoal ?? 0), 0);
              const bqIntens = bqRows.filter((r) => r.intensityGoal != null);
              const bqAvgIntensity = (bqIntens.reduce((s, r) => s + (r.intensityGoal ?? 0), 0) / Math.max(1, bqIntens.length)).toFixed(3);
              const bqCompleted = bqRows.filter((r) => r.totalGoal != null || r.intensityGoal != null).length;
              const bqModified = bqRows.filter((r) => r.status === "modified").length;
              const bqFiltered = bqRows.filter((r) => {
                if (bqModifiedFilter === "modified" && r.status !== "modified") return false;
                if (bqModifiedFilter === "unmodified" && r.status === "modified") return false;
                if (bqKeyword.trim()) {
                  const k = bqKeyword.trim().toLowerCase();
                  if (!r.entName.toLowerCase().includes(k) && !r.creditCode.toLowerCase().includes(k)) return false;
                }
                return true;
              });
              return (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{bqRows.length}</div></Card>
                    <Card className="p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{bqCompleted}</div></Card>
                    <Card className="p-3"><div className="text-[11px] text-muted-foreground">已修改</div><div className="text-lg font-semibold text-warning">{bqModified}</div></Card>
                    <Card className="p-3"><div className="text-[11px] text-muted-foreground">总量目标（万吨CO₂）</div><div className="text-lg font-semibold text-primary">{bqTotal.toLocaleString()}</div></Card>
                    <Card className="p-3"><div className="text-[11px] text-muted-foreground">平均强度</div><div className="text-lg font-semibold">{bqAvgIntensity}</div></Card>
                  </div>
                  <div className="panel p-3 flex items-end gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-muted-foreground">企业名称 / 信用代码</span>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input value={bqKeyword} onChange={(e) => setBqKeyword(e.target.value)} placeholder="输入关键字搜索" className="h-9 pl-7 w-64" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-muted-foreground">是否已修改</span>
                      <Select value={bqModifiedFilter} onValueChange={(v) => setBqModifiedFilter(v as typeof bqModifiedFilter)}>
                        <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="modified">已修改</SelectItem>
                          <SelectItem value="unmodified">未修改</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(bqKeyword || bqModifiedFilter !== "all") && (
                      <Button variant="ghost" size="sm" className="h-9" onClick={() => { setBqKeyword(""); setBqModifiedFilter("all"); }}>重置</Button>
                    )}
                    <Button variant="outline" size="sm" className="h-9 ml-auto" onClick={() => toast.success("已导出 Excel")}>
                      <Download className="h-3.5 w-3.5 mr-1" />导出
                    </Button>
                  </div>
                  <BqGoalTable
                    rows={bqFiltered}
                    mode="city-view"
                    onInlineSave={(id, patch, changes) =>
                      setBqRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, changes: [...r.changes, ...changes] } : r)))
                    }
                  />
                </>
              );
            })()}
          </TabsContent>
        </Tabs>
        )
      ) : !hasDistrictTask ? (
        <AssessEmptyState
          title={`${year} 年暂无目标分解任务`}
          description="市级管理员尚未在该年度下发本区任务。"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{summary.count}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{summary.completed}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">已修改</div><div className="text-lg font-semibold text-warning">{summary.modified}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">总量目标（万吨CO₂）</div><div className="text-lg font-semibold text-primary">{summary.total.toLocaleString()}</div></Card>
            <Card className="p-3"><div className="text-[11px] text-muted-foreground">平均强度</div><div className="text-lg font-semibold">{summary.avgIntensity}</div></Card>
          </div>
          <div className="panel p-3 flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">企业名称 / 信用代码</span>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="输入关键字搜索"
                  className="h-9 pl-7 w-64"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">是否已修改</span>
              <Select value={modifiedFilter} onValueChange={(v) => setModifiedFilter(v as typeof modifiedFilter)}>
                <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="modified">已修改</SelectItem>
                  <SelectItem value="unmodified">未修改</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(keyword || modifiedFilter !== "all") && (
              <Button variant="ghost" size="sm" className="h-9" onClick={() => { setKeyword(""); setModifiedFilter("all"); }}>
                重置
              </Button>
            )}
            <div className="ml-auto flex items-end gap-2 flex-wrap">
              {currentDoc ? (
                <>
                  <Button variant="outline" size="sm" className="h-9" onClick={handleDownload} title="点击下载">
                    <FileCheck2 className="h-3.5 w-3.5 mr-1 text-success" />
                    <span className="max-w-[180px] truncate">{currentDoc.name}</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handlePreview} title="预览">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={handleRemoveDoc}
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-9" onClick={() => setUploadOpen(true)}>
                    <Upload className="h-3.5 w-3.5 mr-1" />重新上传
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="h-9" onClick={() => setUploadOpen(true)}>
                  <Upload className="h-3.5 w-3.5 mr-1" />上传盖章证明
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已导出 Excel")}>
                <Download className="h-3.5 w-3.5 mr-1" />导出
              </Button>
            </div>
          </div>
          <CarbonGoalTable rows={filteredRows} mode="district-view" onInlineSave={handleSaveEdit} />
        </div>
      )}
      </>
      )}
    </AppLayout>
  );
}
