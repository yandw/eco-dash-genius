import { useEffect, useMemo, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeBadge } from "./ChangeBadge";
import { PassBadge } from "./PassBadge";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import type { BqGoalRow, ChangeRecord } from "@/mocks/assess";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  rows: BqGoalRow[];
  mode: "ent-edit" | "district-view" | "city-view";
  onEdit?: (row: BqGoalRow) => void;
  onChange?: (id: string, patch: Partial<BqGoalRow>) => void;
  onInlineSave?: (id: string, patch: Partial<BqGoalRow>, changes: ChangeRecord[]) => void;
  paginated?: boolean;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";
const cellEdit = "px-2 py-1 align-middle text-xs";

type NumF = "total2025" | "intensity2025" | "recommendTotal" | "totalGoal" | "intensityGoal";
type TextF = "intensityIndicator" | "intensityUnit" | "remark";
const NUMS: NumF[] = ["total2025", "intensity2025", "recommendTotal", "totalGoal", "intensityGoal"];
const TEXTS: TextF[] = ["intensityIndicator", "intensityUnit", "remark"];

export function BqGoalTable({ rows, mode, onEdit, onChange, onInlineSave, paginated }: Props) {
  const editable = mode === "ent-edit";
  const inlineEditable = mode === "district-view" || mode === "city-view";
  const showPager = paginated ?? (mode !== "ent-edit");
  const editorName = mode === "city-view" ? "市级管理员" : "区级管理员";
  const showActions = !editable;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageRows = useMemo(() => (showPager ? paginate(rows, page, pageSize) : rows), [rows, page, pageSize, showPager]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<BqGoalRow>>({});

  useEffect(() => {
    setEditingId(null);
    setDraft({});
  }, [mode]);

  const startEdit = (r: BqGoalRow) => {
    onEdit?.(r);
    setEditingId(r.id);
    setDraft({
      total2025: r.total2025,
      intensity2025: r.intensity2025,
      recommendTotal: r.recommendTotal,
      totalGoal: r.totalGoal,
      intensityGoal: r.intensityGoal,
      intensityIndicator: r.intensityIndicator,
      intensityUnit: r.intensityUnit,
      remark: r.remark,
    });
  };
  const cancelEdit = () => { setEditingId(null); setDraft({}); };

  const saveInline = (r: BqGoalRow) => {
    const changes: ChangeRecord[] = [];
    NUMS.forEach((f) => {
      if (draft[f] !== undefined && draft[f] !== r[f]) {
        changes.push({ field: f, oldValue: r[f] as number | null, newValue: draft[f] as number | null, remark: (draft.remark as string) || r.remark || "—", by: editorName, at: new Date().toLocaleString("zh-CN") });
      }
    });
    TEXTS.forEach((f) => {
      if (f === "remark") return;
      if (draft[f] !== undefined && draft[f] !== r[f]) {
        changes.push({ field: f, oldValue: (r[f] as string) ?? "", newValue: (draft[f] as string) ?? "", remark: (draft.remark as string) || r.remark || "—", by: editorName, at: new Date().toLocaleString("zh-CN") });
      }
    });
    const remarkChanged = draft.remark !== undefined && draft.remark !== r.remark;
    if (remarkChanged) {
      changes.push({ field: "remark", oldValue: r.remark ?? "", newValue: (draft.remark as string) ?? "", remark: (draft.remark as string) || r.remark || "—", by: editorName, at: new Date().toLocaleString("zh-CN") });
    }
    if (!changes.length && !remarkChanged) {
      toast.warning("未做任何修改");
      cancelEdit();
      return;
    }
    onInlineSave?.(r.id, { ...draft, status: changes.length ? "modified" : r.status }, changes);
    toast.success("已保存修改");
    cancelEdit();
  };

  const numTd = (r: BqGoalRow, isE: boolean, f: NumF, opts?: { step?: string; primary?: boolean; badge?: boolean }) => {
    const cur = isE ? { ...r, ...draft } : r;
    return (
      <td className={cn(isE ? cellEdit : cellRO, "border-r border-border text-right", opts?.primary && !isE && "text-primary")}>
        {isE ? (
          <Input value={(cur[f] as number | null) ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f]: e.target.value === "" ? null : Number(e.target.value) }))} className="h-7 text-right text-xs" type="number" step={opts?.step} />
        ) : (
          <span className="inline-flex items-center justify-end">
            {(r[f] as number | null) ?? "—"}
            {opts?.badge && <ChangeBadge changes={r.changes} field={f} />}
          </span>
        )}
      </td>
    );
  };
  const textTd = (r: BqGoalRow, isE: boolean, f: TextF) => {
    const cur = isE ? { ...r, ...draft } : r;
    return (
      <td className={cn(isE ? cellEdit : cellRO, "border-r border-border")}>
        {isE ? (
          <Input value={(cur[f] as string) ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f]: e.target.value }))} className="h-7 text-xs" />
        ) : (
          <span className="inline-flex items-center">
            {(r[f] as string) ? <span>{r[f] as string}</span> : <span className="text-muted-foreground">—</span>}
            <ChangeBadge changes={r.changes} field={f} />
          </span>
        )}
      </td>
    );
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-[1500px] w-full border-collapse text-xs">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="border-b border-border">
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">区名称</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">统一信用代码</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border min-w-[220px]">企业名称</th>
            <th colSpan={2} className="px-3 py-2 font-medium border-r border-border text-center">2025年碳排放数据</th>
            <th colSpan={5} className="px-3 py-2 font-medium border-r border-border text-center">2026年碳排放目标</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border min-w-[140px]">备注</th>
            {showActions && <th rowSpan={2} className="px-3 py-2 font-medium w-28">操作</th>}
          </tr>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium border-r border-border">总量<br /><span className="text-[10px] opacity-70">（吨CO₂）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">单位产值碳排放<br /><span className="text-[10px] opacity-70">（吨CO₂/万元）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">总量推荐值<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">总量目标值<br /><span className="text-[10px] opacity-70">（万吨CO₂）</span></th>
            <th className="px-3 py-2 font-medium border-r border-border">强度目标值</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度指标</th>
            <th className="px-3 py-2 font-medium border-r border-border">强度单位</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r, idx) => {
            const isE = editingId === r.id;
            return (
              <tr key={r.id} className={cn("border-b border-border hover:bg-accent/30", r.status === "modified" && "bg-warning/5", isE && "bg-primary/5")}>
                <td className={cn(cellRO, "border-r border-border text-center")}>{showPager ? (page - 1) * pageSize + idx + 1 : idx + 1}</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.districtName}</td>
                <td className={cn(cellRO, "border-r border-border font-mono")}>{r.creditCode}</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
                {editable ? (
                  <td className={cn(cellRO, "border-r border-border text-right")}>{r.total2025?.toLocaleString() ?? "—"}</td>
                ) : numTd(r, isE, "total2025", { badge: true })}
                {editable ? (
                  <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensity2025 ?? "—"}</td>
                ) : numTd(r, isE, "intensity2025", { step: "0.001", badge: true })}
                {editable ? (
                  <td className={cn(cellRO, "border-r border-border text-right text-primary")}>{r.recommendTotal ?? "—"}</td>
                ) : numTd(r, isE, "recommendTotal", { primary: true, badge: true })}

                {/* 总量目标值 */}
                <td className={cn(editable || isE ? cellEdit : cellRO, "border-r border-border text-right")}>
                  {editable ? (
                    <Input value={r.totalGoal ?? ""} onChange={(e) => onChange?.(r.id, { totalGoal: e.target.value === "" ? null : Number(e.target.value) })} className="h-7 text-right text-xs" type="number" step="0.01" />
                  ) : isE ? (
                    <Input value={(draft.totalGoal ?? r.totalGoal) ?? ""} onChange={(e) => setDraft((d) => ({ ...d, totalGoal: e.target.value === "" ? null : Number(e.target.value) }))} className="h-7 text-right text-xs" type="number" step="0.01" autoFocus />
                  ) : (
                    <span className="inline-flex items-center justify-end">
                      {r.totalGoal ?? "—"}
                      <ChangeBadge changes={r.changes} field="totalGoal" />
                    </span>
                  )}
                </td>
                {/* 强度目标值 */}
                <td className={cn(editable || isE ? cellEdit : cellRO, "border-r border-border text-right")}>
                  {editable ? (
                    <Input value={r.intensityGoal ?? ""} onChange={(e) => onChange?.(r.id, { intensityGoal: e.target.value === "" ? null : Number(e.target.value) })} className="h-7 text-right text-xs" type="number" step="0.001" />
                  ) : isE ? (
                    <Input value={(draft.intensityGoal ?? r.intensityGoal) ?? ""} onChange={(e) => setDraft((d) => ({ ...d, intensityGoal: e.target.value === "" ? null : Number(e.target.value) }))} className="h-7 text-right text-xs" type="number" step="0.001" />
                  ) : (
                    <span className="inline-flex items-center justify-end">
                      {r.intensityGoal ?? "—"}
                      <ChangeBadge changes={r.changes} field="intensityGoal" />
                    </span>
                  )}
                </td>

                {editable ? (
                  <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator || "—"}</td>
                ) : textTd(r, isE, "intensityIndicator")}
                {editable ? (
                  <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit || "—"}</td>
                ) : textTd(r, isE, "intensityUnit")}

                <td className={cn(editable || isE ? cellEdit : cellRO, "border-r border-border")}>
                  {editable ? (
                    <Input value={r.remark} onChange={(e) => onChange?.(r.id, { remark: e.target.value })} className="h-7 text-xs" />
                  ) : isE ? (
                    <Input value={(draft.remark as string) ?? ""} onChange={(e) => setDraft((d) => ({ ...d, remark: e.target.value }))} className="h-7 text-xs" placeholder="修改原因" />
                  ) : r.remark ? r.remark : <span className="text-muted-foreground">—</span>}
                </td>

                {showActions && (
                  <td className="px-2 py-1 text-center">
                    {inlineEditable ? (
                      isE ? (
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
                    ) : null}
                  </td>
                )}
              </tr>
            );
          })}
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
