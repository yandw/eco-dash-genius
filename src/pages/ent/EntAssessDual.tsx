import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PassBadge } from "@/components/assess/PassBadge";
import { AssessEmptyState } from "@/components/assess/AssessEmptyState";
import { getEntAssess, energyAssess, type EntAssessYearRow } from "@/mocks/assess";
import { useEntType } from "@/mocks/entTypeStore";
import { EntAssessDualBqBody } from "@/components/assess/EntAssessDualBqBody";
import {
  hasActiveTask,
  listActiveYears,
  useAssessTasksStore,
} from "@/mocks/assessTasks";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = 2026;

type AssessStatus = "passed" | "failed";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-4 bg-primary rounded-sm" />
      <h3 className="text-sm font-medium text-foreground">{children}</h3>
    </div>
  );
}

function Field({ label, children, className }: { label: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

const ro = "text-sm font-medium text-foreground";

function rowStatus(r: EntAssessYearRow | undefined): AssessStatus {
  if (!r) return "failed";
  return r.assessResult === "完成" ? "passed" : "failed";
}

export default function EntAssessDual() {
  const entType = useEntType();
  useAssessTasksStore();
  const taskType = entType === "city"
    ? "\"百家\"、\"千家\"、通信业企业能耗考核"
    : "区下属单位能耗考核";
  const activeYears = listActiveYears([taskType]);
  const YEARS = activeYears.length > 0 ? activeYears : [CURRENT_YEAR];
  const initialYear = activeYears.includes(CURRENT_YEAR)
    ? CURRENT_YEAR
    : (activeYears[0] ?? CURRENT_YEAR);
  const [year, setYear] = useState(initialYear);
  const hasTask = hasActiveTask(year, [taskType]);
  const hasAnyTask = activeYears.length > 0;

  useEffect(() => {
    if (activeYears.length && !activeYears.includes(year)) {
      setYear(activeYears[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYears.join(",")]);
  const ent = energyAssess[0];
  const allRows = useMemo(() => getEntAssess(ent.id), [ent.id]);

  // 用户手动选择的考核结果（按年份保存）
  const [resultOverride, setResultOverride] = useState<Record<number, "完成" | "未完成" | "">>({});
  // 用户填写的备注（按年份保存）
  const [remarkInput, setRemarkInput] = useState<Record<number, string>>({});

  // 年度状态映射：手动选择优先，其次系统判定
  const yearStatusMap = useMemo<Record<number, AssessStatus>>(() => {
    const map: Record<number, AssessStatus> = {};
    YEARS.forEach((y) => {
      const override = resultOverride[y];
      if (override === "完成") map[y] = "passed";
      else if (override === "未完成") map[y] = "failed";
      else {
        const r = allRows.find((x) => x.year === y);
        map[y] = rowStatus(r);
      }
    });
    return map;
  }, [allRows, resultOverride]);

  const currentRow = allRows.find((r) => r.year === year);
  const status = yearStatusMap[year];
  const currentOverride = resultOverride[year] || "";
  const effectiveResult: string = currentOverride || (currentRow?.assessResult && currentRow.assessResult !== "—" ? currentRow.assessResult : "");

  const yearStatusLabel = (s: AssessStatus) => (s === "passed" ? "已达标" : "未达标");

  const statusBadge = () => {
    if (status === "passed")
      return (
        <Badge className="bg-success/10 text-success border border-success/30 hover:bg-success/10 inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />已达标
        </Badge>
      );
    return (
      <Badge className="bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/10 inline-flex items-center gap-1">
        <AlertCircle className="h-3.5 w-3.5" />未达标
      </Badge>
    );
  };

  if (entType === "city") {
    return (
      <AppLayout side="ent" title="重点单位能耗双控考核结果" subtitle="市管企业">
        {!hasAnyTask ? (
          <AssessEmptyState
            title="今年考核未开始"
            description="市级管理员尚未在任务管理中创建考核任务，请等待任务下发。"
          />
        ) : !hasTask ? (
          <AssessEmptyState
            title={`${year} 年考核未开始`}
            description="该年度尚未下发考核任务，请切换年份或等待任务下发。"
          />
        ) : (
          <EntAssessDualBqBody editable />
        )}
      </AppLayout>
    );
  }

  return (
    <AppLayout side="ent" title="重点单位能耗双控考核结果" subtitle={`${year} 年度`}>
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        重点单位能耗双控考核结果
      </h1>

      {!hasAnyTask ? (
        <AssessEmptyState
          title="今年考核未开始"
          description="市级管理员尚未在任务管理中创建考核任务，请等待任务下发。"
        />
      ) : !hasTask ? (
        <AssessEmptyState
          title={`${year} 年考核未开始`}
          description="该年度尚未下发考核任务，请切换年份或等待任务下发。"
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
                    "h-8 min-w-[72px]",
                    active && "bg-gradient-primary text-primary-foreground border-0",
                  )}
                  onClick={() => setYear(y)}
                >
                  {y}
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

      {/* 系统判定提示 */}
      <div className="flex items-center justify-end mb-3">
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Lock className="h-3.5 w-3.5" />考核结果由系统自动判定，如有异议请联系主管部门
        </span>
      </div>

      {!currentRow && (
        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">{year} 年度暂无考核结果</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              该年度尚未完成数据归集或暂未开展考核。
            </div>
          </div>
        </div>
      )}

      {currentRow && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
              <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
              企业基础信息
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">所属区</div>
                <div className="text-sm font-medium text-foreground">青浦区</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">统一信用代码</div>
                <div className="text-sm font-medium text-foreground font-mono">{ent.creditCode}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">企业名称</div>
                <div className="text-sm font-medium text-foreground truncate" title={ent.entName}>{ent.entName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">考核状态</div>
                <div>{statusBadge()}</div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>能耗总量目标完成情况（吨标准煤）</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="目标值"><div className={ro}>{currentRow.totalGoal || "—"}</div></Field>
              <Field label="实际值"><div className={ro}>{currentRow.totalActual}</div></Field>
              <Field label="扣除绿电绿证可再生能源的能耗总量"><div className={ro}>{currentRow.totalActualNetGreen}</div></Field>
              <Field label="是否达标">
                {currentRow.totalPass === "—"
                  ? <span className="text-muted-foreground text-sm">—</span>
                  : <PassBadge value={currentRow.totalPass} />}
              </Field>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>能耗强度目标完成情况</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="能耗强度指标"><div className={ro}>{currentRow.intensityIndicator}</div></Field>
              <Field label="能耗强度单位"><div className={ro}>{currentRow.intensityUnit}</div></Field>
              <Field label="目标值"><div className={ro}>{currentRow.intensityGoal || "—"}</div></Field>
              <Field label="实际值"><div className={ro}>{currentRow.intensityActual}</div></Field>
              <Field label="扣除绿电绿证可再生能源的能耗强度"><div className={ro}>{currentRow.intensityActualNetGreen}</div></Field>
              <Field label="是否达标">
                {currentRow.intensityPass === "—"
                  ? <span className="text-muted-foreground text-sm">—</span>
                  : <PassBadge value={currentRow.intensityPass} />}
              </Field>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>双控考核结论</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="考核结果">
                {effectiveResult ? (
                  <PassBadge value={effectiveResult} />
                ) : (
                  <span className="text-muted-foreground text-sm">待区级管理员填写</span>
                )}
              </Field>
              <Field label="备注">
                <div className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                  {currentRow.remark || <span className="text-muted-foreground font-normal">—</span>}
                </div>
              </Field>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Lock className="h-3 w-3" />考核结果与备注由区级管理员填写，企业用户仅可查看
            </p>
          </Card>

          <p className="text-[11px] text-muted-foreground">
            ※ 实际值与扣除绿电绿证可再生能源后的能耗值由系统自动从年度能源利用状况报告中提取。是否达标由系统按"扣除绿电绿证后值 ≤ 目标值"规则自动判定。
          </p>
          <p className="text-[11px] text-muted-foreground">
            ※ 考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有 1 项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
          </p>
        </div>
      )}
      </>
      )}
    </AppLayout>
  );
}
