import { useEffect, useState } from "react";
import { Building2, History, AlertTriangle, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CarbonGoalRow, ChangeRecord } from "@/mocks/assess";

interface Props {
  open: boolean;
  row: CarbonGoalRow | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<CarbonGoalRow>, changes: ChangeRecord[]) => void;
}

export function EditWithRemarkSheet({ open, row, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Partial<CarbonGoalRow>>({});
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (open) {
      setDraft({});
      setRemark("");
    }
  }, [open, row?.id]);

  if (!row) return null;

  const cur = { ...row, ...draft };

  const calcDelta = (oldV: number | null | undefined, newV: number | null | undefined) => {
    if (oldV == null || newV == null || oldV === 0) return null;
    return ((newV - oldV) / oldV) * 100;
  };

  const totalDelta = calcDelta(row.total2026, cur.total2026);
  const intensityDelta = calcDelta(row.intensity2026, cur.intensity2026);

  const applyRecommend = () => {
    if (row.recommendTotal != null) {
      setDraft((d) => ({ ...d, total2026: row.recommendTotal }));
    }
  };

  const handleSave = () => {
    const changes: ChangeRecord[] = [];
    (["total2026", "intensity2026"] as const).forEach((f) => {
      if (draft[f] !== undefined && draft[f] !== row[f]) {
        changes.push({
          field: f,
          oldValue: row[f] as number | null,
          newValue: draft[f] as number | null,
          remark,
          by: "青浦区管理员",
          at: new Date().toLocaleString("zh-CN"),
        });
      }
    });
    if (!changes.length) {
      toast.warning("未做任何修改");
      return;
    }
    if (!remark.trim()) {
      toast.error("请填写修改备注");
      return;
    }
    onSave(row.id, { ...draft, status: "modified" }, changes);
    toast.success("已保存修改，已通知企业与市级");
    onClose();
  };

  const dirty = Object.keys(draft).length > 0;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            修改企业目标值
          </SheetTitle>
          <SheetDescription className="text-xs">
            <div className="font-medium text-foreground">{row.entName}</div>
            <div className="font-mono text-muted-foreground mt-0.5">{row.creditCode}</div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4 text-sm">
          {/* 基础信息 */}
          <div className="rounded-md border border-border bg-muted/40 p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <div className="text-muted-foreground mb-0.5">2025 年总量</div>
              <div className="font-mono font-medium">{row.total2025 ?? "—"} <span className="text-muted-foreground">万吨CO₂</span></div>
            </div>
            <div>
              <div className="text-muted-foreground mb-0.5">2025 年单位产值碳排放</div>
              <div className="font-mono font-medium">{row.intensity2025 ?? "—"}</div>
            </div>
            <div className="col-span-2 pt-2 border-t border-border/60 flex items-center justify-between">
              <div>
                <div className="text-muted-foreground mb-0.5 inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />系统推荐总量
                </div>
                <div className="font-mono font-medium text-primary">{row.recommendTotal ?? "—"} <span className="text-muted-foreground">万吨CO₂</span></div>
              </div>
              {row.recommendTotal != null && (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={applyRecommend}>
                  应用推荐值
                </Button>
              )}
            </div>
          </div>

          {/* 编辑区 */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-1 rounded-sm bg-primary" />
              2026 年目标值
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">总量（万吨CO₂）</Label>
                <Input
                  type="number"
                  value={cur.total2026 ?? ""}
                  onChange={(e) => setDraft({ ...draft, total2026: e.target.value === "" ? null : Number(e.target.value) })}
                  className="h-9 mt-1"
                />
                <div className="text-[10px] mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">原值 {row.total2026 ?? "—"}</span>
                  {totalDelta != null && (
                    <span className={cn("font-mono font-medium", totalDelta > 0 ? "text-destructive" : "text-success")}>
                      {totalDelta > 0 ? "+" : ""}{totalDelta.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs">强度</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={cur.intensity2026 ?? ""}
                  onChange={(e) => setDraft({ ...draft, intensity2026: e.target.value === "" ? null : Number(e.target.value) })}
                  className="h-9 mt-1"
                />
                <div className="text-[10px] mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">原值 {row.intensity2026 ?? "—"}</span>
                  {intensityDelta != null && (
                    <span className={cn("font-mono font-medium", intensityDelta > 0 ? "text-destructive" : "text-success")}>
                      {intensityDelta > 0 ? "+" : ""}{intensityDelta.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">强度指标</Label>
                <Input value={row.intensityIndicator ?? ""} disabled className="h-9 mt-1 bg-muted/40" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">强度单位</Label>
                <Input value={row.intensityUnit ?? ""} disabled className="h-9 mt-1 bg-muted/40" />
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <Label className="text-xs">
              <span className="text-destructive mr-0.5">*</span>修改备注
            </Label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请说明修改原因，例如：按区考核要求收紧 3%；保存后将同步通知企业与市级。"
              className="mt-1 text-xs"
              rows={4}
            />
            <div className="text-[10px] text-muted-foreground mt-1">
              备注为必填项，作为本次目标调整的依据，存档可追溯。
            </div>
          </div>

          {/* 历史修改 */}
          {row.changes && row.changes.length > 0 && (
            <div className="rounded-md border border-border bg-card p-3 space-y-2">
              <div className="text-xs font-semibold text-foreground inline-flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-muted-foreground" />
                历史修改记录（{row.changes.length}）
              </div>
              <div className="space-y-2 max-h-40 overflow-auto">
                {row.changes.map((c, i) => (
                  <div key={i} className="text-[11px] border-l-2 border-primary/40 pl-2 py-0.5">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{c.by}</span>
                      <span>{c.at}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{c.field === "total2026" ? "总量" : "强度"}：</span>
                      <span className="line-through text-muted-foreground">{String(c.oldValue ?? "—")}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium text-destructive">{String(c.newValue ?? "—")}</span>
                    </div>
                    <div className="text-muted-foreground mt-0.5">备注：{c.remark}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dirty && (
            <div className="rounded-md border border-warning/40 bg-warning/5 p-2.5 text-[11px] text-foreground/80 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
              <span>保存后将以"已修改"状态标记该企业，并通过站内消息通知企业用户与市级管理员。</span>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            className="bg-gradient-primary text-primary-foreground"
            onClick={handleSave}
            disabled={!dirty}
          >
            保存并通知
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
