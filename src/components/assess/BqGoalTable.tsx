import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeBadge } from "./ChangeBadge";
import type { BqGoalRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  rows: BqGoalRow[];
  mode: "ent-edit" | "district-view" | "city-view";
  onEdit?: (row: BqGoalRow) => void;
  onChange?: (id: string, patch: Partial<BqGoalRow>) => void;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";
const cellEdit = "px-2 py-1 align-middle text-xs";

export function BqGoalTable({ rows, mode, onEdit, onChange }: Props) {
  const editable = mode === "ent-edit";
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table className="min-w-[1100px] w-full border-collapse text-xs">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="border-b border-border">
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">企业统一信用代码</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border min-w-[240px]">企业名称</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">碳排放总量目标<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
            <th colSpan={3} className="px-3 py-2 font-medium border-r border-border text-center">碳排放强度目标</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">备注</th>
            {!editable && <th rowSpan={2} className="px-3 py-2 font-medium w-20">操作</th>}
          </tr>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium border-r border-border">目标值</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度指标名称</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度指标单位</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={cn("border-b border-border hover:bg-accent/30", r.status === "modified" && "bg-warning/5")}>
              <td className={cn(cellRO, "border-r border-border text-center")}>{idx + 1}</td>
              <td className={cn(cellRO, "border-r border-border font-mono")}>{r.creditCode}</td>
              <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
              <td className={cn(editable ? cellEdit : cellRO, "border-r border-border text-right")}>
                {editable ? (
                  <Input value={r.totalGoal ?? ""} onChange={(e) => onChange?.(r.id, { totalGoal: e.target.value === "" ? null : Number(e.target.value) })} className="h-7 text-right text-xs" type="number" />
                ) : (
                  <span className="inline-flex items-center justify-end">
                    {r.totalGoal ?? "—"}
                    <ChangeBadge changes={r.changes} field="totalGoal" />
                  </span>
                )}
              </td>
              <td className={cn(editable ? cellEdit : cellRO, "border-r border-border text-right")}>
                {editable ? (
                  <Input value={r.intensityGoal ?? ""} onChange={(e) => onChange?.(r.id, { intensityGoal: e.target.value === "" ? null : Number(e.target.value) })} className="h-7 text-right text-xs" type="number" step="0.001" />
                ) : (
                  r.intensityGoal ?? "—"
                )}
              </td>
              <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator || "—"}</td>
              <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit || "—"}</td>
              <td className={cn(cellRO, "border-r border-border")}>
                {editable ? (
                  <Input value={r.remark} onChange={(e) => onChange?.(r.id, { remark: e.target.value })} className="h-7 text-xs" />
                ) : r.remark ? r.remark : <span className="text-muted-foreground">—</span>}
              </td>
              {!editable && (
                <td className="px-2 py-1 text-center">
                  {mode === "district-view" && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => onEdit?.(r)}>
                      <Pencil className="h-3 w-3 mr-1" />编辑
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
