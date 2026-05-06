import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeBadge } from "./ChangeBadge";
import { PassBadge } from "./PassBadge";
import type { CarbonGoalRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  rows: CarbonGoalRow[];
  mode: "ent-edit" | "district-view" | "city-view";
  onEdit?: (row: CarbonGoalRow) => void;
  onChange?: (id: string, patch: Partial<CarbonGoalRow>) => void;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";
const cellEdit = "px-2 py-1 align-middle text-xs";

export function CarbonGoalTable({ rows, mode, onEdit, onChange }: Props) {
  const editable = mode === "ent-edit";

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table className="min-w-[1300px] w-full border-collapse text-xs">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="border-b border-border">
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">区名称</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">统一信用代码</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border min-w-[200px]">企业名称</th>
            <th colSpan={2} className="px-3 py-2 font-medium border-r border-border text-center">2025年碳排放数据</th>
            <th className="px-3 py-2 font-medium border-r border-border text-center">推荐值<br /><span className="text-[10px] opacity-70">（预留）</span></th>
            <th colSpan={4} className="px-3 py-2 font-medium border-r border-border text-center">2026年碳排放目标</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border min-w-[140px]">备注</th>
            {!editable && <th rowSpan={2} className="px-3 py-2 font-medium w-20">操作</th>}
          </tr>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">单位产值碳排放</th>
            <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">强度</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度指标</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度单位</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={cn("border-b border-border hover:bg-accent/30", r.status === "modified" && "bg-warning/5")}>
              <td className={cn(cellRO, "border-r border-border text-center")}>{idx + 1}</td>
              <td className={cn(cellRO, "border-r border-border")}>{r.districtId === "qingpu" ? "青浦区" : r.districtId}</td>
              <td className={cn(cellRO, "border-r border-border font-mono")}>{r.creditCode}</td>
              <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
              <td className={cn(cellRO, "border-r border-border text-right")}>{r.total2025 || "—"}</td>
              <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensity2025 || "—"}</td>
              <td className={cn(cellRO, "border-r border-border text-right text-primary")}>{r.recommendTotal ?? "—"}</td>

              <td className={cn(editable ? cellEdit : cellRO, "border-r border-border text-right")}>
                {editable ? (
                  <Input
                    value={r.total2026 ?? ""}
                    onChange={(e) => onChange?.(r.id, { total2026: e.target.value === "" ? null : Number(e.target.value) })}
                    className="h-7 text-right text-xs"
                    type="number"
                  />
                ) : (
                  <span className="inline-flex items-center justify-end">
                    {r.total2026 ?? "—"}
                    <ChangeBadge changes={r.changes} field="total2026" />
                  </span>
                )}
              </td>
              <td className={cn(editable ? cellEdit : cellRO, "border-r border-border text-right")}>
                {editable ? (
                  <Input
                    value={r.intensity2026 ?? ""}
                    onChange={(e) => onChange?.(r.id, { intensity2026: e.target.value === "" ? null : Number(e.target.value) })}
                    className="h-7 text-right text-xs"
                    type="number"
                    step="0.001"
                  />
                ) : (
                  <span className="inline-flex items-center justify-end">
                    {r.intensity2026 ?? "—"}
                    <ChangeBadge changes={r.changes} field="intensity2026" />
                  </span>
                )}
              </td>
              <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator}</td>
              <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit}</td>
              <td className={cn(cellRO, "border-r border-border")}>
                {editable ? (
                  <Input
                    value={r.remark}
                    onChange={(e) => onChange?.(r.id, { remark: e.target.value })}
                    className="h-7 text-xs"
                  />
                ) : r.remark ? (
                  <span>{r.remark}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              {!editable && (
                <td className="px-2 py-1 text-center">
                  {mode === "district-view" ? (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => onEdit?.(r)}>
                      <Pencil className="h-3 w-3 mr-1" />编辑
                    </Button>
                  ) : (
                    r.status === "modified" && <PassBadge value="已修改" />
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
