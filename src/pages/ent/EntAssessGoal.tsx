import { useEffect, useState } from "react";
import { Save, Send, CheckCircle2, Lock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntCarbonGoalForm } from "@/components/assess/EntCarbonGoalForm";
import { EntBqGoalForm } from "@/components/assess/EntBqGoalForm";
import { ChangeAlert } from "@/components/assess/ChangeAlert";
import { AssessEmptyState } from "@/components/assess/AssessEmptyState";
import { carbonGoals, bqGoals, type CarbonGoalRow, type BqGoalRow } from "@/mocks/assess";
import {
  GOAL_TASK_TYPES,
  hasActiveTask,
  listActiveYears,
  useAssessTasksStore,
} from "@/mocks/assessTasks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = 2026;

type EntStatus = "draft" | "submitted" | "modified";

// 不同年度的初始填报状态：演示历史已提交、当期已被中心修改、过往草稿等不同情形
const INITIAL_YEAR_STATUS: Record<number, EntStatus> = {
  2026: "draft",       // 本期 · 未提交（企业可编辑）
  2025: "submitted",   // 已提交
  2024: "modified",    // 已提交 · 中心已调整
  2023: "draft",       // 未提交
  2022: "submitted",   // 已提交
};

// 2024 年中心负责人修改记录（演示）
const YEAR_CHANGES_2024 = [
  {
    field: "total2026",
    oldValue: 29171,
    newValue: 28300,
    remark: "总量目标按区考核要求收紧 3%",
    by: "节能中心 · 王磊",
    at: "2024-04-12 14:08",
  },
  {
    field: "intensity2026",
    oldValue: 0.221,
    newValue: 0.205,
    remark: "强度目标同步收紧",
    by: "节能中心 · 王磊",
    at: "2024-04-12 14:08",
  },
];

export default function EntAssessGoal() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [scope, setScope] = useState<"district" | "city">("district");
  const [yearStatusDistrict, setYearStatusDistrict] = useState<Record<number, EntStatus>>({ ...INITIAL_YEAR_STATUS });
  const [yearStatusCity, setYearStatusCity] = useState<Record<number, EntStatus>>({ ...INITIAL_YEAR_STATUS });

  const currentYearStatus = scope === "district" ? yearStatusDistrict[year] : yearStatusCity[year];

  const [myRow, setMyRow] = useState<CarbonGoalRow>({
    ...carbonGoals[0],
    status: "draft",
    changes: [],
  });
  const [bqRow, setBqRow] = useState<BqGoalRow>({ ...bqGoals[1], status: currentYearStatus });
  const [submitOpen, setSubmitOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const updateMy = (_id: string, patch: Partial<CarbonGoalRow>) => setMyRow((r) => ({ ...r, ...patch }));
  const updateBq = (_id: string, patch: Partial<BqGoalRow>) => setBqRow((r) => ({ ...r, ...patch }));

  const status: EntStatus = currentYearStatus ?? "draft";
  const submitted = status === "submitted" || status === "modified";
  // 仅未提交（草稿）可编辑；已提交或中心已调整后均锁定
  const editable = status === "draft";
  // 演示：2024 年含中心负责人调整记录
  const yearChanges = scope === "district" && year === 2024 ? YEAR_CHANGES_2024 : myRow.changes;

  const headerScope = (
    <Tabs value={scope} onValueChange={(v) => setScope(v as "district" | "city")}>
      <TabsList className="h-9">
        <TabsTrigger value="district" className="h-7 text-xs px-4">区管企业</TabsTrigger>
        <TabsTrigger value="city" className="h-7 text-xs px-4">市管企业</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const setYearStatus = (s: EntStatus) => {
    if (scope === "district") {
      setYearStatusDistrict((m) => ({ ...m, [year]: s }));
      setMyRow((r) => ({ ...r, status: s }));
    } else {
      setYearStatusCity((m) => ({ ...m, [year]: s }));
      setBqRow((r) => ({ ...r, status: s }));
    }
  };

  const handleSaveDraft = () => {
    setYearStatus("draft");
    toast.success("已保存草稿", {
      description: `${year} 年度目标分解填报内容已暂存，可稍后继续编辑。`,
    });
  };

  const handleConfirmSubmit = () => {
    setSubmitOpen(false);
    setYearStatus("submitted");
    setSuccessOpen(true);
  };

  const yearStatusMap = scope === "district" ? yearStatusDistrict : yearStatusCity;
  const yearDotClass = (s: EntStatus | undefined) => {
    if (s === "submitted") return "bg-emerald-500";
    if (s === "modified") return "bg-amber-500";
    return "bg-muted-foreground/50";
  };
  const yearStatusLabel = (s: EntStatus | undefined) => {
    if (s === "submitted") return "已提交";
    if (s === "modified") return "中心已调整";
    return "未提交";
  };

  const statusBadge = () => {
    if (status === "modified")
      return (
        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/50 hover:bg-amber-500/10 inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />已提交 · 中心已调整
        </Badge>
      );
    if (status === "submitted")
      return (
        <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/10 inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />已提交
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-xs border-muted-foreground/40 text-muted-foreground">
        未提交
      </Badge>
    );
  };

  return (
    <AppLayout
      side="ent"
      title="重点单位碳排放双控目标分解"
      subtitle={`${year} 年度`}
      headerExtra={headerScope}
    >
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        重点单位碳排放双控目标分解
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

      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">填报状态</span>
          {statusBadge()}
        </div>
        <div className="flex items-center gap-2">
          {submitted ? (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />提交后不可修改，如需调整请联系主管部门
            </span>
          ) : (
            <>
              <Button variant="outline" size="sm" className="h-9" onClick={handleSaveDraft}>
                <Save className="h-3.5 w-3.5 mr-1" />保存草稿
              </Button>
              <Button
                size="sm"
                className="h-9 bg-gradient-primary text-primary-foreground"
                onClick={() => setSubmitOpen(true)}
              >
                <Send className="h-3.5 w-3.5 mr-1" />提交
              </Button>
            </>
          )}
        </div>
      </div>

      {scope === "district" && yearChanges.length > 0 && <ChangeAlert changes={yearChanges} year={year} />}

      {submitted && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">{year} 年度目标分解已提交</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              已上报至{scope === "district" ? "区级" : "市级"}主管部门审核。提交后不可修改，仅指定政府侧负责人有权调整目标值。
            </div>
          </div>
        </div>
      )}

      <fieldset disabled={!editable} className={cn(!editable && "[&_input]:cursor-not-allowed [&_textarea]:cursor-not-allowed")}>
        {scope === "district" ? (
          <EntCarbonGoalForm row={{ ...myRow, changes: yearChanges }} onChange={updateMy} />
        ) : (
          <EntBqGoalForm row={bqRow} onChange={updateBq} />
        )}
      </fieldset>

      {/* 提交确认 */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>确认提交目标分解？</DialogTitle>
            <DialogDescription>
              提交后将上报至{scope === "district" ? "所属区级主管部门" : "市级主管部门"}审核，
              <span className="text-foreground font-medium">提交后将不可再修改</span>，
              仅指定政府侧负责人可调整目标值。请确认 {year} 年度填报内容无误。
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-muted/50 border border-border p-3 text-xs space-y-1.5">
            <div className="flex justify-between"><span className="text-muted-foreground">报告年度</span><span className="font-medium">{year} 年</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">归属类型</span><span className="font-medium">{scope === "district" ? "区管企业" : "市管企业"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">企业名称</span><span className="font-medium">{scope === "district" ? myRow.entName : bqRow.entName}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>取消</Button>
            <Button className="bg-gradient-primary text-primary-foreground" onClick={handleConfirmSubmit}>
              <Send className="h-3.5 w-3.5 mr-1" />确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提交成功 */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <div className="flex flex-col items-center text-center py-2">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-semibold mb-1">提交成功</h3>
            <p className="text-sm text-muted-foreground">
              {year} 年度目标分解已提交，提交后不可修改，请等待{scope === "district" ? "区级" : "市级"}主管部门审核。
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button className="bg-gradient-primary text-primary-foreground min-w-[120px]" onClick={() => setSuccessOpen(false)}>
              我知道了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
