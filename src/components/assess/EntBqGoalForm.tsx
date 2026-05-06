import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeBadge } from "./ChangeBadge";
import type { BqGoalRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  row: BqGoalRow;
  onChange: (id: string, patch: Partial<BqGoalRow>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-4 bg-primary rounded-sm" />
      <h3 className="text-sm font-medium text-foreground">{children}</h3>
    </div>
  );
}

function Field({ label, children, className }: { label: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

const ro = "px-3 py-2 rounded-md bg-muted/50 border border-border text-sm min-h-[36px] flex items-center";

export function EntBqGoalForm({ row, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle>企业基础信息</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Field label="所属区"><div className={ro}>{row.districtName}</div></Field>
          <Field label="统一信用代码"><div className={cn(ro, "font-mono")}>{row.creditCode}</div></Field>
          <Field label="企业名称"><div className={ro}>{row.entName}</div></Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>2025 年碳排放数据</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="总量（吨CO₂）"><div className={ro}>{row.total2025?.toLocaleString() ?? "—"}</div></Field>
          <Field label="单位产值碳排放（吨CO₂/万元）"><div className={ro}>{row.intensity2025 ?? "—"}</div></Field>
        </div>
      </Card>

      <Card className="p-5 border-primary/30">
        <SectionTitle>推荐值（系统预留）</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="总量推荐值（万吨CO₂）">
            <div className={cn(ro, "text-primary font-medium")}>{row.recommendTotal ?? "—"}</div>
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>2026 年碳排放目标（待填报）</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label={<span className="inline-flex items-center gap-1">总量目标值（万吨CO₂）<ChangeBadge changes={row.changes} field="totalGoal" /></span>}>
            <Input
              type="number"
              step="0.01"
              value={row.totalGoal ?? ""}
              onChange={(e) => onChange(row.id, { totalGoal: e.target.value === "" ? null : Number(e.target.value) })}
              className="h-9"
            />
          </Field>
          <Field label={<span className="inline-flex items-center gap-1">强度目标值（吨CO₂/万元）<ChangeBadge changes={row.changes} field="intensityGoal" /></span>}>
            <Input
              type="number"
              step="0.001"
              value={row.intensityGoal ?? ""}
              onChange={(e) => onChange(row.id, { intensityGoal: e.target.value === "" ? null : Number(e.target.value) })}
              className="h-9"
            />
          </Field>
          <Field label="强度指标"><div className={ro}>{row.intensityIndicator || "—"}</div></Field>
          <Field label="强度单位"><div className={ro}>{row.intensityUnit || "—"}</div></Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>备注</SectionTitle>
        <Textarea
          value={row.remark}
          onChange={(e) => onChange(row.id, { remark: e.target.value })}
          placeholder="请输入备注信息"
          className="min-h-[80px] text-sm"
        />
      </Card>
    </div>
  );
}
