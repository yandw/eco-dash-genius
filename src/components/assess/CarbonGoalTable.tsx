import { useEffect, useMemo, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeBadge } from "./ChangeBadge";
import { PassBadge } from "./PassBadge";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import type { CarbonGoalRow, ChangeRecord } from "@/mocks/assess";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  rows: CarbonGoalRow[];
  mode: "ent-edit" | "district-view" | "city-view";
  onEdit?: (row: CarbonGoalRow) => void;
  onChange?: (id: string, patch: Partial<CarbonGoalRow>) => void;
  /** Inline save (used by district-view inline editing). */
  onInlineSave?: (id: string, patch: Partial<CarbonGoalRow>, changes: ChangeRecord[]) => void;
  /** Show pagination footer. Defaults to true for district/city views. */
  paginated?: boolean;
  pageSize?: number;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";
const cellEdit = "px-2 py-1 align-middle text-xs";

export function CarbonGoalTable({ rows, mode, onEdit, onChange, onInlineSave, paginated, pageSize: initialSize }: Props) {
  const editable = mode === "ent-edit";
  const showPager = paginated ?? (mode !== "ent-edit");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize ?? 10);
  const pageRows = useMemo(() => (showPager ? paginate(rows, page, pageSize) : rows), [rows, page, pageSize, showPager]);

  // Inline editing state for district-view
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<CarbonGoalRow>>({});

  useEffect(() => {
    setEditingId(null);
    setDraft({});
  }, [mode]);

  const startEdit = (r: CarbonGoalRow) => {
    if (onEdit) onEdit(r);
    setEditingId(r.id);
    setDraft({ total2026: r.total2026, intensity2026: r.intensity2026, remark: r.remark });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveInline = (r: CarbonGoalRow) => {
    const changes: ChangeRecord[] = [];
    (["total2026", "intensity2026"] as const).forEach((f) => {
      if (draft[f] !== undefined && draft[f] !== r[f]) {
        changes.push({
          field: f,
          oldValue: r[f] as number | null,
          newValue: draft[f] as number | null,
          remark: (draft.remark as string) || r.remark || "—",
          by: "区级管理员",
          at: new Date().toLocaleString("zh-CN"),
        });
      }
    });
    const remarkChanged = draft.remark !== undefined && draft.remark !== r.remark;
    if (!changes.length && !remarkChanged) {
      toast.warning("未做任何修改");
      cancelEdit();
      return;
    }
    onInlineSave?.(r.id, { ...draft, status: changes.length ? "modified" : r.status }, changes);
    toast.success("已保存修改");
    cancelEdit();
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
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
              {!editable && <th rowSpan={2} className="px-3 py-2 font-medium w-28">操作</th>}
            </tr>
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
              <th className="px-3 py-2 font-medium border-r border-border">单位产值碳排放</th>
              <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
              <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
              <th className="px-3 py-2 font-medium border-r border-border">强度</th>
              <th className="px-3 py-2 font-medium border-r border-border">强度指标</th>
              <th className="px-3 py-2 font-medium border-r border-border">强度单位</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, idx) => {
              const isInlineEditing = editingId === r.id;
              const cur = isInlineEditing ? { ...r, ...draft } : r;
              return (
                <tr
                  key={r.id}
                  className={cn(
                    "border-b border-border hover:bg-accent/30",
                    r.status === "modified" && "bg-warning/5",
                    isInlineEditing && "bg-primary/5",
                  )}
                >
                  <td className={cn(cellRO, "border-r border-border text-center")}>
                    {showPager ? (page - 1) * pageSize + idx + 1 : idx + 1}
                  </td>
                  <td className={cn(cellRO, "border-r border-border")}>{r.districtId === "qingpu" ? "青浦区" : r.districtId}</td>
                  <td className={cn(cellRO, "border-r border-border font-mono")}>{r.creditCode}</td>
                  <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
                  <td className={cn(cellRO, "border-r border-border text-right")}>{r.total2025 || "—"}</td>
                  <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensity2025 || "—"}</td>
                  <td className={cn(cellRO, "border-r border-border text-right text-primary")}>{r.recommendTotal ?? "—"}</td>

                  <td className={cn(editable || isInlineEditing ? cellEdit : cellRO, "border-r border-border text-right")}>
                    {editable ? (
                      <Input
                        value={r.total2026 ?? ""}
                        onChange={(e) => onChange?.(r.id, { total2026: e.target.value === "" ? null : Number(e.target.value) })}
                        className="h-7 text-right text-xs"
                        type="number"
                      />
                    ) : isInlineEditing ? (
                      <Input
                        value={cur.total2026 ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, total2026: e.target.value === "" ? null : Number(e.target.value) }))}
                        className="h-7 text-right text-xs"
                        type="number"
                        autoFocus
                      />
                    ) : (
                      <span className="inline-flex items-center justify-end">
                        {r.total2026 ?? "—"}
                        <ChangeBadge changes={r.changes} field="total2026" />
                      </span>
                    )}
                  </td>
                  <td className={cn(editable || isInlineEditing ? cellEdit : cellRO, "border-r border-border text-right")}>
                    {editable ? (
                      <Input
                        value={r.intensity2026 ?? ""}
                        onChange={(e) => onChange?.(r.id, { intensity2026: e.target.value === "" ? null : Number(e.target.value) })}
                        className="h-7 text-right text-xs"
                        type="number"
                        step="0.001"
                      />
                    ) : isInlineEditing ? (
                      <Input
                        value={cur.intensity2026 ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, intensity2026: e.target.value === "" ? null : Number(e.target.value) }))}
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
                  <td className={cn(editable || isInlineEditing ? cellEdit : cellRO, "border-r border-border")}>
                    {editable ? (
                      <Input
                        value={r.remark}
                        onChange={(e) => onChange?.(r.id, { remark: e.target.value })}
                        className="h-7 text-xs"
                      />
                    ) : isInlineEditing ? (
                      <Input
                        value={(cur.remark as string) ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, remark: e.target.value }))}
                        className="h-7 text-xs"
                        placeholder="修改原因"
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
                        isInlineEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:text-success" onClick={() => saveInline(r)} title="保存">
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={cancelEdit} title="取消">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => startEdit(r)} disabled={!!editingId}>
                            <Pencil className="h-3 w-3 mr-1" />编辑
                          </Button>
                        )
                      ) : (
                        r.status === "modified" && <PassBadge value="已修改" />
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={editable ? 12 : 13} className="text-center text-xs text-muted-foreground py-10">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPager && (
        <ListPagination
          total={rows.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
