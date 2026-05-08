import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import { PassBadge } from "./PassBadge";
import { dualResult, passByValue, type EnergyAssessRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  rows: EnergyAssessRow[];
  mode: "district-edit" | "city-view" | "city-edit";
  onChange?: (id: string, patch: Partial<EnergyAssessRow>) => void;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";

type Draft = {
  totalActual: number;
  intensityActual: number;
  resultOverride?: "完成" | "未完成";
  remark: string;
};

export function DistrictAssessTable({ rows, mode, onChange }: Props) {
  const editable = mode === "district-edit" || mode === "city-edit";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const pageRows = paginate(rows, page, pageSize);

  const startEdit = (r: EnergyAssessRow) => {
    setEditingId(r.id);
    setDraft({
      totalActual: r.totalActual,
      intensityActual: r.intensityActual,
      resultOverride: r.resultOverride,
      remark: r.remark ?? "",
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };
  const confirmEdit = (r: EnergyAssessRow) => {
    if (!draft) return;
    // 同步 net 值（演示数据：保留实际值与 net 值的差额）
    const totalDelta = (r.totalActual || 0) - (r.totalActualNetGreen || 0);
    const intensityDelta = (r.intensityActual || 0) - (r.intensityActualNetGreen || 0);
    onChange?.(r.id, {
      totalActual: draft.totalActual,
      intensityActual: draft.intensityActual,
      totalActualNetGreen: Math.max(0, draft.totalActual - totalDelta),
      intensityActualNetGreen: Math.max(0, +(draft.intensityActual - intensityDelta).toFixed(3)),
      resultOverride: draft.resultOverride,
      remark: draft.remark,
    });
    setEditingId(null);
    setDraft(null);
    toast.success("已更新");
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-[1800px] w-full border-collapse text-xs">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="border-b border-border">
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">区名称</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border min-w-[200px]">企业名称</th>
            <th colSpan={4} className="px-3 py-2 font-medium border-r border-border text-center">能耗总量目标完成情况<br /><span className="text-[10px] opacity-70">（吨标准煤）</span></th>
            <th colSpan={6} className="px-3 py-2 font-medium border-r border-border text-center">能耗强度目标完成情况</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">双控指标<br />完成情况</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">考核结果</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border min-w-[160px]">备注</th>
            {editable && <th rowSpan={3} className="px-3 py-2 font-medium min-w-[140px]">操作</th>}
          </tr>
          <tr className="border-b border-border">
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">目标值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">实际值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证<br />可再生能源的<br />能耗总量</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">是否达标</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">目标值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">实际值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证<br />可再生能源的<br />能耗强度</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">是否达标</th>
            <th colSpan={2} className="px-3 py-2 font-medium border-r border-border text-center">强度指标</th>
          </tr>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium border-r border-border">名称</th>
            <th className="px-3 py-2 font-medium border-r border-border">单位</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r, idx) => {
            const isEditing = editingId === r.id && draft;
            // 用于显示的行数据（编辑态使用草稿派生）
            const totalDelta = (r.totalActual || 0) - (r.totalActualNetGreen || 0);
            const intensityDelta = (r.intensityActual || 0) - (r.intensityActualNetGreen || 0);
            const dispTotalActual = isEditing ? draft!.totalActual : r.totalActual;
            const dispIntensityActual = isEditing ? draft!.intensityActual : r.intensityActual;
            const dispTotalNet = isEditing ? Math.max(0, draft!.totalActual - totalDelta) : r.totalActualNetGreen;
            const dispIntensityNet = isEditing ? Math.max(0, +(draft!.intensityActual - intensityDelta).toFixed(3)) : r.intensityActualNetGreen;

            const totalPass = passByValue(r.totalGoal, dispTotalNet);
            const intensityPass = passByValue(r.intensityGoal, dispIntensityNet);
            const previewRow: EnergyAssessRow = {
              ...r,
              totalActual: dispTotalActual,
              intensityActual: dispIntensityActual,
              totalActualNetGreen: dispTotalNet,
              intensityActualNetGreen: dispIntensityNet,
            };
            const auto = dualResult(previewRow);
            const dispResultOverride = isEditing ? draft!.resultOverride : r.resultOverride;
            const result = dispResultOverride ?? (auto === "—" ? "" : auto);
            const dispRemark = isEditing ? draft!.remark : r.remark;
            const intensityNetCellVal = dispIntensityNet === 0 ? "#VALUE!" : dispIntensityNet;
            const seq = (page - 1) * pageSize + idx + 1;

            return (
              <tr key={r.id} className={cn("border-b border-border hover:bg-accent/30", isEditing && "bg-primary/5")}>
                <td className={cn(cellRO, "border-r border-border text-center")}>{seq}</td>
                <td className={cn(cellRO, "border-r border-border")}>青浦区</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalGoal || ""}</td>
                <td className={cn("border-r border-border text-right", isEditing ? "px-2 py-1 bg-background" : cellRO)}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={draft!.totalActual}
                      onChange={(e) => setDraft({ ...draft!, totalActual: Number(e.target.value) })}
                      className="h-7 text-xs text-right font-mono"
                    />
                  ) : (
                    dispTotalActual
                  )}
                </td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{dispTotalNet}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {totalPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={totalPass} />}
                </td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityGoal || ""}</td>
                <td className={cn("border-r border-border text-right", isEditing ? "px-2 py-1 bg-background" : cellRO)}>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={draft!.intensityActual}
                      onChange={(e) => setDraft({ ...draft!, intensityActual: Number(e.target.value) })}
                      className="h-7 text-xs text-right font-mono"
                    />
                  ) : (
                    dispIntensityActual
                  )}
                </td>
                <td className={cn(cellRO, "border-r border-border text-right")}>
                  {typeof intensityNetCellVal === "string" ? <span className="text-destructive font-mono">{intensityNetCellVal}</span> : intensityNetCellVal}
                </td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {intensityPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={intensityPass} />}
                </td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator}</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {auto === "—" ? <span className="text-destructive font-mono">#VALUE!</span> : <PassBadge value={auto} />}
                </td>
                <td className={cn("border-r border-border text-center", isEditing ? "px-2 py-1 bg-background" : cellRO)}>
                  {isEditing ? (
                    <Select
                      value={draft!.resultOverride || ""}
                      onValueChange={(v) => setDraft({ ...draft!, resultOverride: v as "完成" | "未完成" })}
                    >
                      <SelectTrigger className="h-7 text-xs w-24 mx-auto">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="完成">完成</SelectItem>
                        <SelectItem value="未完成">未完成</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : result ? (
                    <PassBadge value={result} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className={cn("border-r border-border", isEditing ? "px-2 py-1 bg-background" : cellRO)}>
                  {isEditing ? (
                    <Input
                      value={draft!.remark}
                      onChange={(e) => setDraft({ ...draft!, remark: e.target.value })}
                      placeholder={result === "完成" && auto === "未完成" ? "请说明原因 *" : ""}
                      className={cn("h-7 text-xs", result === "完成" && auto === "未完成" && !draft!.remark && "border-destructive")}
                    />
                  ) : dispRemark ? (
                    dispRemark
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                {editable && (
                  <td className={cn("px-2 py-1 text-center", !isEditing && "bg-muted/40")}>
                    {isEditing ? (
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" onClick={cancelEdit}>
                          <X className="h-3.5 w-3.5 mr-0.5" />取消
                        </Button>
                        <Button size="sm" className="h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => confirmEdit(r)}>
                          <Check className="h-3.5 w-3.5 mr-0.5" />确认
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-primary hover:text-primary hover:bg-primary/10"
                        disabled={editingId !== null}
                        onClick={() => startEdit(r)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-0.5" />编辑
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <ListPagination
        total={rows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
