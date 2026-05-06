import { useState } from "react";
import { Save, Send, CheckCircle2 } from "lucide-react";
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
import { carbonGoals, bqGoals, type CarbonGoalRow, type BqGoalRow } from "@/mocks/assess";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const YEARS = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = 2026;

export default function EntAssessGoal() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [scope, setScope] = useState<"district" | "city">("district");
  const [myRow, setMyRow] = useState<CarbonGoalRow>(carbonGoals[0]);
  const [bqRow, setBqRow] = useState<BqGoalRow>(bqGoals[1]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const updateMy = (_id: string, patch: Partial<CarbonGoalRow>) => setMyRow((r) => ({ ...r, ...patch }));
  const updateBq = (_id: string, patch: Partial<BqGoalRow>) => setBqRow((r) => ({ ...r, ...patch }));

  const status = scope === "district" ? myRow.status : bqRow.status;

  const handleSaveDraft = () => {
    toast.success("已保存草稿", {
      description: `${year} 年度目标分解填报内容已暂存，可稍后继续编辑。`,
    });
  };

  const handleConfirmSubmit = () => {
    setSubmitOpen(false);
    if (scope === "district") setMyRow((r) => ({ ...r, status: "submitted" }));
    else setBqRow((r) => ({ ...r, status: "submitted" }));
    setSuccessOpen(true);
  };

  return (
    <AppLayout side="ent" title="目标分解" subtitle={`${year}年重点单位碳排放双控目标分解`}>
      {/* 报告年度 */}
      <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
          报告年度
        </span>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <div key={y} className="relative">
              <Button
                size="sm"
                variant={year === y ? "default" : "outline"}
                className={cn(
                  "h-8 min-w-[68px]",
                  year === y && "bg-gradient-primary text-primary-foreground border-0",
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
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Tabs value={scope} onValueChange={(v) => setScope(v as "district" | "city")}>
            <TabsList className="h-9">
              <TabsTrigger value="district" className="h-7 text-xs px-4">区管企业</TabsTrigger>
              <TabsTrigger value="city" className="h-7 text-xs px-4">市管企业</TabsTrigger>
            </TabsList>
          </Tabs>
          <Badge variant="outline" className="text-xs border-primary/40 text-primary">
            状态：{status === "modified" ? "区级已修改" : status === "submitted" ? "已提交" : "草稿"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={handleSaveDraft}>
            <Save className="h-3.5 w-3.5 mr-1" />保存草稿
          </Button>
          <Button
            size="sm"
            className="h-9 bg-gradient-primary text-primary-foreground"
            onClick={() => setSubmitOpen(true)}
            disabled={status === "submitted"}
          >
            <Send className="h-3.5 w-3.5 mr-1" />提交
          </Button>
        </div>
      </div>

      {scope === "district" && <ChangeAlert changes={myRow.changes} />}

      {scope === "district" ? (
        <EntCarbonGoalForm row={myRow} onChange={updateMy} />
      ) : (
        <EntBqGoalForm row={bqRow} onChange={updateBq} />
      )}

      {/* 提交确认 */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>确认提交目标分解？</DialogTitle>
            <DialogDescription>
              提交后将上报至{scope === "district" ? "所属区级主管部门" : "市级主管部门"}审核，审核期间不可修改。请确认 {year} 年度填报内容无误。
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
              {year} 年度目标分解已提交，请等待{scope === "district" ? "区级" : "市级"}主管部门审核。
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
