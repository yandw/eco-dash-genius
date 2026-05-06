import { useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Lock, Info } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PassBadge } from "@/components/assess/PassBadge";
import { getEntAssess, energyAssess, type EntAssessYearRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

const YEARS = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = 2026;

type AssessStatus = "passed" | "failed" | "pending";

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
    <div className={cn("space-y-1.5", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

const ro = "px-3 py-2 rounded-md bg-muted/50 border border-border text-sm min-h-[36px] flex items-center";

function rowStatus(r: EntAssessYearRow | undefined): AssessStatus {
  if (!r) return "pending";
  if (r.assessResult === "—") return "pending";
  return r.assessResult === "完成" ? "passed" : "failed";
}

export default function EntAssessDual() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const ent = energyAssess[0];
  const allRows = useMemo(() => getEntAssess(ent.id), [ent.id]);

  // 年度状态映射：基于 mock 现有 3 年（2024/2025/2026），其余年份给一个演示状态
  const yearStatusMap = useMemo<Record<number, AssessStatus>>(() => {
    const map: Record<number, AssessStatus> = {};
    YEARS.forEach((y) => {
      const r = allRows.find((x) => x.year === y);
      map[y] = r ? rowStatus(r) : "pending";
    });
    return map;
  }, [allRows]);

  const currentRow = allRows.find((r) => r.year === year);
  const status = yearStatusMap[year];

  const yearDotClass = (s: AssessStatus) =>
    s === "passed" ? "bg-emerald-500" : s === "failed" ? "bg-destructive" : "bg-muted-foreground/50";
  const yearStatusLabel = (s: AssessStatus) =>
    s === "passed" ? "已达标" : s === "failed" ? "未达标" : "未考核";

  const statusBadge = () => {
    if (status === "passed")
      return (
        <Badge className="bg-success/10 text-success border border-success/30 hover:bg-success/10 inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />已达标
        </Badge>
      );
    if (status === "failed")
      return (
        <Badge className="bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/10 inline-flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />未达标
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-xs border-muted-foreground/40 text-muted-foreground">
        暂未考核
      </Badge>
    );
  };

  return (
    <AppLayout side="ent" title="重点单位能耗双控考核结果" subtitle={`${year} 年度`}>
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        重点单位能耗双控考核结果
      </h1>

      {/* 报告年度 */}
      <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
          报告年度
        </span>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => {
            const s = yearStatusMap[y];
            const active = year === y;
            return (
              <div key={y} className="relative">
                <Button
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className={cn(
                    "h-8 min-w-[92px] gap-1.5",
                    active && "bg-gradient-primary text-primary-foreground border-0",
                  )}
                  onClick={() => setYear(y)}
                  title={`${y} 年 · ${yearStatusLabel(s)}`}
                >
                  <span className={cn("inline-block h-1.5 w-1.5 rounded-full", yearDotClass(s))} />
                  {y}
                  <span className={cn("text-[10px] font-normal", active ? "text-primary-foreground/85" : "text-muted-foreground")}>
                    {yearStatusLabel(s)}
                  </span>
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

      {/* 状态条 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">考核状态</span>
          {statusBadge()}
        </div>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Lock className="h-3.5 w-3.5" />考核结果由系统自动判定，如有异议请联系主管部门
        </span>
      </div>

      {/* 总体结论横幅 */}
      {currentRow && status === "passed" && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">{year} 年度能耗双控考核已通过</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              总量与强度两项指标均达标，结果由系统根据年度能源利用状况报告自动判定。
            </div>
          </div>
        </div>
      )}
      {currentRow && status === "failed" && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">{year} 年度能耗双控考核未通过</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              请关注下方未达标项，并配合主管部门完成后续工作。
            </div>
          </div>
        </div>
      )}
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
          <Card className="p-5">
            <SectionTitle>企业基础信息</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="所属区"><div className={ro}>青浦区</div></Field>
              <Field label="统一信用代码"><div className={cn(ro, "font-mono")}>{ent.creditCode}</div></Field>
              <Field label="企业名称"><div className={ro}>{ent.entName}</div></Field>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>能耗总量目标完成情况（吨标准煤）</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="目标值"><div className={ro}>{currentRow.totalGoal || "—"}</div></Field>
              <Field label="实际值"><div className={ro}>{currentRow.totalActual}</div></Field>
              <Field label="扣除绿电绿证可再生能源的能耗总量"><div className={ro}>{currentRow.totalActualNetGreen}</div></Field>
              <Field label="是否达标">
                <div className={cn(ro, "justify-start")}>
                  {currentRow.totalPass === "—"
                    ? <span className="text-muted-foreground">—</span>
                    : <PassBadge value={currentRow.totalPass} />}
                </div>
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
                <div className={cn(ro, "justify-start")}>
                  {currentRow.intensityPass === "—"
                    ? <span className="text-muted-foreground">—</span>
                    : <PassBadge value={currentRow.intensityPass} />}
                </div>
              </Field>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>双控考核结论</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="考核结果" className="md:col-span-1">
                <div className={cn(ro, "justify-start")}>
                  {currentRow.assessResult === "—"
                    ? <span className="text-muted-foreground">—</span>
                    : <PassBadge value={currentRow.assessResult} />}
                </div>
              </Field>
              <Field label="备注" className="md:col-span-2">
                <div
                  className={cn(
                    ro,
                    "min-h-[60px] items-start py-2",
                    currentRow.dualPass === "未完成" && currentRow.assessResult === "完成" &&
                      "border-warning/40 bg-warning/5",
                  )}
                >
                  {currentRow.remark || <span className="text-muted-foreground">—</span>}
                </div>
              </Field>
            </div>
          </Card>

          <p className="text-[11px] text-muted-foreground">
            ※ 实际值与扣除绿电绿证可再生能源后的能耗值由系统自动从年度能源利用状况报告中提取。是否达标由系统按"扣除绿电绿证后值 ≤ 目标值"规则自动判定。
          </p>
          <p className="text-[11px] text-muted-foreground">
            ※ 考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有 1 项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
          </p>
        </div>
      )}
    </AppLayout>
  );
}
