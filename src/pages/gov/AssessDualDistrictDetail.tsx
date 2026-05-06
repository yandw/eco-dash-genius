import { useState } from "react";
import { ArrowLeft, ChevronRight, Download, Undo2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DistrictAssessTable } from "@/components/assess/DistrictAssessTable";
import { districts, energyAssess, type EnergyAssessRow } from "@/mocks/assess";
import { useAssessStatusStore, rollbackAssess } from "@/mocks/assessStatusStore";
import { toast } from "sonner";

export default function AssessDualDistrictDetail() {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();
  const district = districts.find((d) => d.id === districtId);
  const districtName = district?.name ?? "未知区";
  const isQingpu = districtId === "qingpu";
  const store = useAssessStatusStore();
  const entry = districtId ? store[districtId] : undefined;
  const submitted = entry?.status === "完成考核";

  const [rows, setRows] = useState<EnergyAssessRow[]>(energyAssess);
  const update = (id: string, patch: Partial<EnergyAssessRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const summary = {
    count: rows.length,
    pass: rows.filter((r) => {
      if (!r.totalGoal || !r.intensityGoal) return false;
      return r.totalActualNetGreen <= r.totalGoal && r.intensityActualNetGreen <= r.intensityGoal;
    }).length,
  };

  return (
    <AppLayout side="gov" title="双控考核" subtitle={`${districtName} 下属企业能耗目标考评`}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
        <Link to="/gov/assess/dual" className="hover:text-primary">双控考核</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/gov/assess/dual" className="hover:text-primary">区下属单位能耗目标考核</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{districtName} 下属企业能耗目标考评</span>
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/gov/assess/dual")}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />返回列表
        </Button>
        <div className="flex items-center gap-2">
          {entry?.doc && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                const a = document.createElement("a");
                a.href = entry.doc!.url;
                a.download = entry.doc!.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success(`正在下载 ${entry.doc!.name}`);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" />下载盖章证明
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("已导出")}>
            <Download className="h-3.5 w-3.5 mr-1" />导出
          </Button>
          {submitted && districtId && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-warning border-warning/40 hover:text-warning"
              onClick={() => {
                rollbackAssess(districtId);
                toast.success("已退回，列表状态变更为待考核");
                navigate("/gov/assess/dual");
              }}
            >
              <Undo2 className="h-3.5 w-3.5 mr-1" />退回
            </Button>
          )}
        </div>
      </div>

      {isQingpu && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{summary.count}</div></Card>
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">完成</div><div className="text-lg font-semibold text-success">{summary.pass}</div></Card>
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">未完成</div><div className="text-lg font-semibold text-destructive">{summary.count - summary.pass}</div></Card>
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">达标率</div><div className="text-lg font-semibold text-primary">{Math.round((summary.pass / summary.count) * 100)}%</div></Card>
        </div>
      )}

      <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground mb-3">
        考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有1项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
      </div>

      {isQingpu ? (
        <DistrictAssessTable rows={rows} mode="city-edit" onChange={update} />
      ) : (
        <div className="rounded-md border border-border bg-card py-16 text-center text-sm text-muted-foreground">
          演示数据仅包含青浦区，其它区显示样式相同。
        </div>
      )}
    </AppLayout>
  );
}
