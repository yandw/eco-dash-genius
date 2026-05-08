import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeBadge } from "./ChangeBadge";
import type { CarbonGoalRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  row: CarbonGoalRow;
  onChange: (id: string, patch: Partial<CarbonGoalRow>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-4 bg-primary rounded-sm" />
      <h3 className="text-sm font-medium text-foreground">{children}</h3>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

const roStatic = "text-base font-semibold text-foreground min-h-[28px] flex items-center";

export function EntCarbonGoalForm({ row, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle>企业基础信息</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Field label="所属区"><div className={roStatic}>{row.districtId === "qingpu" ? "青浦区" : row.districtId}</div></Field>
          <Field label="统一信用代码"><div className={cn(roStatic, "font-mono")}>{row.creditCode}</div></Field>
          <Field label="企业名称"><div className={roStatic}>{row.entName}</div></Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>2025 年碳排放数据</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="总量（万吨CO₂）"><div className={roStatic}>{row.total2025 || "—"}</div></Field>
          <Field label="单位产值碳排放"><div className={roStatic}>{row.intensity2025 || "—"}</div></Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>推荐值（系统预留）</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="总量推荐值（万吨CO₂）">
            <div className={cn(roStatic, "text-primary")}>{row.recommendTotal ?? "—"}</div>
          </Field>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          ※ 推荐值由系统根据上一年实际碳排放与减排任务自动测算，仅供参考。
        </p>
      </Card>

      <Card className="p-5">
        <SectionTitle>2026 年碳排放目标</SectionTitle>
        {row.changes.length > 0 && (
          <div className="mb-4 rounded-md border border-amber-400/50 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
            <span className="mt-0.5">⚠</span>
            <span>中心负责人已调整下列高亮字段，最终目标以中心调整后的值为准。</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {(() => {
            const tc = row.changes.find((c) => c.field === "total2026");
            const ic = row.changes.find((c) => c.field === "intensity2026");
            const hl = "border-amber-400 ring-2 ring-amber-300/40 bg-amber-50 dark:bg-amber-500/10";
            const editableBg = "bg-white dark:bg-background border-primary/40";
            return (
              <>
                <Field label={<span className="inline-flex items-center gap-1">总量（万吨CO₂）<ChangeBadge changes={row.changes} field="total2026" /></span>}>
                  <Input
                    type="number"
                    value={row.total2026 ?? ""}
                    onChange={(e) => onChange(row.id, { total2026: e.target.value === "" ? null : Number(e.target.value) })}
                    className={cn("h-9", editableBg, tc && hl)}
                  />
                </Field>
                <Field label={<span className="inline-flex items-center gap-1">强度<ChangeBadge changes={row.changes} field="intensity2026" /></span>}>
                  <Input
                    type="number"
                    step="0.001"
                    value={row.intensity2026 ?? ""}
                    onChange={(e) => onChange(row.id, { intensity2026: e.target.value === "" ? null : Number(e.target.value) })}
                    className={cn("h-9", editableBg, ic && hl)}
                  />
                </Field>
              </>
            );
          })()}
          <Field label="强度指标">
            <Input
              list="ent-intensity-indicator-options"
              value={row.intensityIndicator ?? ""}
              onChange={(e) => onChange(row.id, { intensityIndicator: e.target.value })}
              placeholder="请选择或输入强度指标"
              className="h-9 bg-white dark:bg-background border-primary/40"
            />
            <datalist id="ent-intensity-indicator-options">
              <option value="单位产值碳排放" />
              <option value="单位产品碳排放" />
              <option value="单位增加值碳排放" />
            </datalist>
          </Field>
          <Field label="强度单位">
            <Input
              list="ent-intensity-unit-options"
              value={row.intensityUnit ?? ""}
              onChange={(e) => onChange(row.id, { intensityUnit: e.target.value })}
              placeholder="请选择或输入强度单位"
              className="h-9 bg-white dark:bg-background border-primary/40"
            />
            <datalist id="ent-intensity-unit-options">
              <option value="吨CO2/万元" />
              <option value="吨CO2/吨产品" />
              <option value="千克CO2/件" />
            </datalist>
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>备注</SectionTitle>
        <Textarea
          value={row.remark}
          onChange={(e) => onChange(row.id, { remark: e.target.value })}
          placeholder="请输入备注信息"
          className="min-h-[80px] text-sm bg-white dark:bg-background border-primary/40"
        />
      </Card>
    </div>
  );
}
