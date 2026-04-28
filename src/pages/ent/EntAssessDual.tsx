import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
import { EntAssessResultTable } from "@/components/assess/EntAssessResultTable";
import { getEntAssess, energyAssess } from "@/mocks/assess";
import { Bell, FileWarning } from "lucide-react";

export default function EntAssessDual() {
  const [year, setYear] = useState(2026);
  const ent = energyAssess[0];
  const rows = getEntAssess(ent.id);

  return (
    <AppLayout side="ent" title="考核结果" subtitle="本企业能耗双控考核结果与历年记录">
      <div className="text-xs text-muted-foreground mb-3">企业自评 / 重点用能单位考核结果</div>

      <div className="flex items-center gap-3 mb-4">
        <AssessYearPicker year={year} onChange={setYear} />
      </div>

      <Tabs defaultValue="result">
        <TabsList>
          <TabsTrigger value="result">考核结果</TabsTrigger>
          <TabsTrigger value="rectify">整改任务</TabsTrigger>
          <TabsTrigger value="appeal">考核申诉</TabsTrigger>
        </TabsList>

        <TabsContent value="result" className="mt-4">
          <EntAssessResultTable rows={rows} entName={ent.entName} />
          <p className="text-[11px] text-muted-foreground mt-2">
            ※ 实际值与扣除绿电绿证可再生能源后的能耗值由系统自动从年度能源利用状况报告中提取。是否达标由系统按"扣除绿电绿证后值 ≤ 目标值"规则自动判定。
          </p>
        </TabsContent>

        <TabsContent value="rectify" className="mt-4">
          <Card className="p-6 text-sm">
            <div className="flex items-center gap-2 text-warning font-medium mb-2">
              <FileWarning className="h-4 w-4" />区级派发整改任务
            </div>
            <div className="text-xs text-muted-foreground">暂无待整改任务。</div>
          </Card>
        </TabsContent>

        <TabsContent value="appeal" className="mt-4">
          <Card className="p-6 text-sm">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Bell className="h-4 w-4" />考核申诉
            </div>
            <div className="text-xs text-muted-foreground">如对考核结果有异议，请在公示期内提交申诉材料。</div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
