import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntCarbonGoalForm } from "@/components/assess/EntCarbonGoalForm";
import { EntBqGoalForm } from "@/components/assess/EntBqGoalForm";
import { ChangeAlert } from "@/components/assess/ChangeAlert";
import { carbonGoals, bqGoals, type CarbonGoalRow, type BqGoalRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

const YEARS = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = 2026;

export default function EntAssessGoal() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [scope, setScope] = useState<"district" | "city">("district");
  const [myRow, setMyRow] = useState<CarbonGoalRow>(carbonGoals[0]);
  const [bqRow, setBqRow] = useState<BqGoalRow>(bqGoals[1]);

  const updateMy = (_id: string, patch: Partial<CarbonGoalRow>) => setMyRow((r) => ({ ...r, ...patch }));
  const updateBq = (_id: string, patch: Partial<BqGoalRow>) => setBqRow((r) => ({ ...r, ...patch }));

  const status = scope === "district" ? myRow.status : bqRow.status;
  const submitted = status === "submitted";

  const headerScope = (
    <Tabs value={scope} onValueChange={(v) => setScope(v as "district" | "city")}>
      <TabsList className="h-9">
        <TabsTrigger value="district" className="h-7 text-xs px-4">区管企业</TabsTrigger>
        <TabsTrigger value="city" className="h-7 text-xs px-4">市管企业</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <AppLayout
      side="ent"
      title="目标分解"
      subtitle={`${year}年重点单位碳排放双控目标分解`}
      headerExtra={headerScope}
    >
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
        <div className="ml-auto">
          {submitted ? (
            <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/10 inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />提交成功
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs border-primary/40 text-primary">
              状态：{status === "modified" ? "区级已修改" : "草稿"}
            </Badge>
          )}
        </div>
      </div>

      {scope === "district" && <ChangeAlert changes={myRow.changes} />}

      {submitted && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground">{year} 年度目标分解已提交</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              内容已上报至{scope === "district" ? "区级" : "市级"}主管部门审核，提交后不可修改。
            </div>
          </div>
        </div>
      )}

      <fieldset disabled={submitted} className={cn(submitted && "opacity-95")}>
        {scope === "district" ? (
          <EntCarbonGoalForm row={myRow} onChange={updateMy} />
        ) : (
          <EntBqGoalForm row={bqRow} onChange={updateBq} />
        )}
      </fieldset>
    </AppLayout>
  );
}
