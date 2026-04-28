import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  if (!row) return null;

  const cur = { ...row, ...draft };

  const handleSave = () => {
    if (!remark.trim()) {
      toast.error("请填写修改备注");
      return;
    }
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
    onSave(row.id, { ...draft, status: "modified" }, changes);
    toast.success("已保存修改，已通知企业与市级");
    setDraft({});
    setRemark("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>修改企业目标值</SheetTitle>
          <SheetDescription>
            {row.entName} · {row.creditCode}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4 text-sm">
          <div className="rounded-md bg-muted/50 p-3 text-xs space-y-1">
            <div>2025年总量：<span className="font-mono">{row.total2025}</span> 万吨CO₂</div>
            <div>2025年单位产值碳排放：<span className="font-mono">{row.intensity2025}</span></div>
            <div>系统推荐值：<span className="font-mono text-primary">{row.recommendTotal ?? "—"}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">2026 总量（万吨CO₂）</Label>
              <Input
                type="number"
                value={cur.total2026 ?? ""}
                onChange={(e) => setDraft({ ...draft, total2026: e.target.value === "" ? null : Number(e.target.value) })}
                className="h-9 mt-1"
              />
              <div className="text-[10px] text-muted-foreground mt-1">原值 {row.total2026 ?? "—"}</div>
            </div>
            <div>
              <Label className="text-xs">2026 强度</Label>
              <Input
                type="number"
                step="0.001"
                value={cur.intensity2026 ?? ""}
                onChange={(e) => setDraft({ ...draft, intensity2026: e.target.value === "" ? null : Number(e.target.value) })}
                className="h-9 mt-1"
              />
              <div className="text-[10px] text-muted-foreground mt-1">原值 {row.intensity2026 ?? "—"}</div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-destructive">修改备注 *</Label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请说明修改原因，将同步通知企业与市级"
              className="mt-1 text-xs"
              rows={4}
            />
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={handleSave}>保存并通知</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
