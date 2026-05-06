import { useState } from "react";
import { Save, Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntCarbonGoalForm } from "@/components/assess/EntCarbonGoalForm";
import { EntBqGoalForm } from "@/components/assess/EntBqGoalForm";
import { ChangeAlert } from "@/components/assess/ChangeAlert";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
import { carbonGoals, bqGoals, type CarbonGoalRow, type BqGoalRow } from "@/mocks/assess";
import { toast } from "sonner";

export default function EntAssessGoal() {
  const [year, setYear] = useState(2026);
  const [scope, setScope] = useState<"district" | "city">("district");
  const [myRow, setMyRow] = useState<CarbonGoalRow>(carbonGoals[0]);
  const [bqRow, setBqRow] = useState<BqGoalRow>(bqGoals[1]);

  const updateMy = (_id: string, patch: Partial<CarbonGoalRow>) => setMyRow((r) => ({ ...r, ...patch }));
  const updateBq = (_id: string, patch: Partial<BqGoalRow>) => setBqRow((r) => ({ ...r, ...patch }));

  const status = scope === "district" ? myRow.status : bqRow.status;

  return (
    <AppLayout side="ent" title="目标分解" subtitle="碳排放目标分解填报">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <AssessYearPicker year={year} onChange={setYear} />
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
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已保存草稿")}>
            <Save className="h-3.5 w-3.5 mr-1" />保存草稿
          </Button>
          <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("已提交至区级审核")}>
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
    </AppLayout>
  );
}
