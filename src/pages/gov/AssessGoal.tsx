import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessYearPicker } from "@/components/assess/AssessYearPicker";
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

export default function AssessGoal() {
  const role = getCurrentRole();
  const navigate = useNavigate();
  const [year, setYear] = useState(2026);
  const [rows, setRows] = useState<CarbonGoalRow[]>(carbonGoals);

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

  const handleSaveEdit = (id: string, patch: Partial<CarbonGoalRow>, changes: ChangeRecord[]) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...patch, changes: [...r.changes, ...changes] }
          : r,
      ),
    );
  };

  return (
    <AppLayout side="gov" title="目标分解" subtitle={isCity ? "全市 17 区目标分解汇总与下钻" : "本区企业碳排放目标分解"}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <AssessYearPicker year={year} onChange={setYear} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("已导出 Excel")}>
            <Download className="h-3.5 w-3.5 mr-1" />导出
          </Button>
        </div>
      </div>

      <Tabs defaultValue="district">
        <TabsList>
          <TabsTrigger value="district">区下属单位碳排放目标分解</TabsTrigger>
          {isCity && (
            <TabsTrigger value="bq">"百家"、"千家"、通信业企业碳排放目标分解</TabsTrigger>
          )}
        </TabsList>

        {/* ========= 区下属 ========= */}
        <TabsContent value="district" className="mt-4 space-y-4">
          {!isCity ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{summary.count}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">已提交</div><div className="text-lg font-semibold text-success">{summary.submitted}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">已修改</div><div className="text-lg font-semibold text-warning">{summary.modified}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">总量目标（万吨CO₂）</div><div className="text-lg font-semibold text-primary">{summary.total.toLocaleString()}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">平均强度</div><div className="text-lg font-semibold">{summary.avgIntensity}</div></Card>
              </div>

              <CarbonGoalTable rows={rows} mode="district-view" onEdit={setEditing} />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">参与区数</div><div className="text-lg font-semibold">{districtGoalSummary.length}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{districtGoalSummary.filter((d) => d.status === "已完成").length}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">进行中</div><div className="text-lg font-semibold text-warning">{districtGoalSummary.filter((d) => d.status === "进行中").length}</div></Card>
                <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold text-primary">{districtGoalSummary.reduce((s, d) => s + d.count, 0)}</div></Card>
              </div>

              <DistrictListTable variant="goal" rows={districtGoalSummary} year={year} onAction={(id) => navigate(`/gov/assess/goal/district/${id}`)} />
            </>
          )}
        </TabsContent>

        {/* ========= 百千家 ========= */}
        <TabsContent value="bq" className="mt-4">
          <BqGoalTable rows={bqGoals} mode={isCity ? "city-view" : "district-view"} />
        </TabsContent>
      </Tabs>

      <EditWithRemarkSheet
        open={!!editing}
        row={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveEdit}
      />

    </AppLayout>
  );
}
