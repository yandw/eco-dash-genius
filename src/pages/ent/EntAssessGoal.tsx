import { useState } from "react";
import { Save, Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarbonGoalTable } from "@/components/assess/CarbonGoalTable";
import { BqGoalTable } from "@/components/assess/BqGoalTable";
import { ChangeAlert } from "@/components/assess/ChangeAlert";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
import { carbonGoals, bqGoals, type CarbonGoalRow, type BqGoalRow } from "@/mocks/assess";
import { toast } from "sonner";

export default function EntAssessGoal() {
  const [year, setYear] = useState(2026);
  // 企业用户取第一条作为本企业
  const [myRow, setMyRow] = useState<CarbonGoalRow>(carbonGoals[0]);
  const [bqRow, setBqRow] = useState<BqGoalRow>(bqGoals[1]);

  const updateMy = (_id: string, patch: Partial<CarbonGoalRow>) => setMyRow((r) => ({ ...r, ...patch }));
  const updateBq = (_id: string, patch: Partial<BqGoalRow>) => setBqRow((r) => ({ ...r, ...patch }));

  return (
    <AppLayout side="ent" title="目标分解" subtitle="重点用能单位 / 百千家通信业 — 碳排放目标分解填报">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AssessYearPicker year={year} onChange={setYear} />
          <Badge variant="outline" className="text-xs border-primary/40 text-primary">
            状态：{myRow.status === "modified" ? "区级已修改" : myRow.status === "submitted" ? "已提交" : "草稿"}
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

      <ChangeAlert changes={myRow.changes} />

      <Tabs defaultValue="district">
        <TabsList>
          <TabsTrigger value="district">区下属单位碳排放目标分解</TabsTrigger>
          <TabsTrigger value="bq">"百家"、"千家"、通信业企业碳排放目标分解</TabsTrigger>
        </TabsList>

        <TabsContent value="district" className="mt-4">
          <CarbonGoalTable rows={[myRow]} mode="ent-edit" onChange={updateMy} />
          <p className="text-[11px] text-muted-foreground mt-2">
            ※ 推荐值由系统根据上一年实际碳排放与减排任务自动测算，仅供参考。
          </p>
        </TabsContent>

        <TabsContent value="bq" className="mt-4">
          <BqGoalTable rows={[bqRow]} mode="ent-edit" onChange={updateBq} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
