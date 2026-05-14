import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Flame, Zap } from "lucide-react";
import {
  FUEL_OPTIONS_BY_INDUSTRY,
  HEAT_ELEC_OPTIONS,
  INDUSTRY_LABEL,
  type IndustryKey,
  type DataSource,
} from "@/mocks/dualCalcDefaults";

interface Props {
  industry: IndustryKey;
}

interface FuelRow {
  id: string;
  fuel: string;
  qty: number;
  unit: string;
  source: DataSource;
  ncv: number | null;
  cc: number | null;
  ox: number | null;
  output: number;
}

interface ElecRow {
  id: string;
  type: string;
  qty: number;
  unit: string;
  source: DataSource;
  factor: number | null;
  output: number;
}

const fmt = (n: number, d = 2) =>
  n.toLocaleString("zh-CN", { maximumFractionDigits: d, minimumFractionDigits: d });

const newFuelRow = (): FuelRow => ({
  id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  fuel: "",
  qty: 0,
  unit: "t",
  source: "default",
  ncv: null,
  cc: null,
  ox: null,
  output: 0,
});

const newElecRow = (): ElecRow => ({
  id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type: "",
  qty: 0,
  unit: "MWh",
  source: "default",
  factor: null,
  output: 0,
});

export function DualCalcPanel({ industry }: Props) {
  const fuelOptions = FUEL_OPTIONS_BY_INDUSTRY[industry];

  const [fuelRows, setFuelRows] = useState<FuelRow[]>([newFuelRow()]);
  const [elecRows, setElecRows] = useState<ElecRow[]>([newElecRow()]);

  const fuelComputed = useMemo(
    () =>
      fuelRows.map((r) => {
        const ready = r.qty > 0 && r.ncv != null && r.cc != null && r.ox != null;
        const emission = ready
          ? r.qty * (r.ncv as number) * (r.cc as number) * ((r.ox as number) / 100) * (44 / 12)
          : null;
        const intensity = emission != null && r.output > 0 ? emission / r.output : null;
        return { ...r, emission, intensity };
      }),
    [fuelRows],
  );

  const elecComputed = useMemo(
    () =>
      elecRows.map((r) => {
        const ready = r.qty > 0 && r.factor != null;
        const emission = ready ? r.qty * (r.factor as number) : null;
        const intensity = emission != null && r.output > 0 ? emission / r.output : null;
        return { ...r, emission, intensity };
      }),
    [elecRows],
  );

  const fuelSubtotal = fuelComputed.reduce((s, r) => s + (r.emission ?? 0), 0);
  const elecSubtotal = elecComputed.reduce((s, r) => s + (r.emission ?? 0), 0);
  const fuelOutputSubtotal = fuelComputed.reduce((s, r) => s + (r.output ?? 0), 0);
  const elecOutputSubtotal = elecComputed.reduce((s, r) => s + (r.output ?? 0), 0);
  const total = fuelSubtotal + elecSubtotal;

  const updateFuel = (id: string, patch: Partial<FuelRow>) =>
    setFuelRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const updateElec = (id: string, patch: Partial<ElecRow>) =>
    setElecRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      {/* 行业总览 */}
      <Card className="p-4 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flame className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">当前行业</div>
            <div className="text-base font-semibold">{INDUSTRY_LABEL[industry]} 行业 · 双控测算</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">总排放量（范围一 + 范围二）</div>
          <div className="text-xl font-semibold text-primary tabular-nums">
            {fmt(total)} <span className="text-xs font-normal text-muted-foreground">tCO₂</span>
          </div>
        </div>
      </Card>

      {/* 范围一 */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b bg-warning/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-warning/15 flex items-center justify-center">
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <div>
              <div className="font-medium text-sm">范围一 · 化石燃料燃烧</div>
              <div className="text-xs text-muted-foreground">
                化石燃料燃烧产生的 CO₂ 排放（按燃料品种逐条录入）
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">小计排放量</div>
            <div className="text-base font-semibold text-warning tabular-nums">
              {fmt(fuelSubtotal)} <span className="text-xs font-normal">tCO₂</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-xs text-muted-foreground">
            选择燃料品种后，特性参数将按《表 2.1 常见化石燃料特性参数缺省值》自动回填；
            <span className="text-warning font-medium">「自测值」</span> 模式下可手动覆盖。
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[160px]">燃料品种 *</TableHead>
                  <TableHead className="text-right min-w-[120px]">净消耗量 *</TableHead>
                  <TableHead className="min-w-[100px]">数据来源</TableHead>
                  <TableHead className="text-right min-w-[110px]">低位发热量</TableHead>
                  <TableHead className="text-right min-w-[150px]">单位热值含碳量 (tC/GJ)</TableHead>
                  <TableHead className="text-right min-w-[110px]">碳氧化率 (%)</TableHead>
                  <TableHead className="text-right min-w-[110px]">排放量 (tCO₂)</TableHead>
                  <TableHead className="text-right min-w-[120px]">生产总值 (万元)</TableHead>
                  <TableHead className="text-right min-w-[140px]">碳排放强度 (tCO₂/万元)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelComputed.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <Select
                        value={r.fuel}
                        onValueChange={(v) => updateFuel(r.id, { fuel: v })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="请选择燃料品种" />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelOptions.length === 0 ? (
                            <div className="px-2 py-1.5 text-xs text-muted-foreground">
                              暂无候选项（待同步）
                            </div>
                          ) : (
                            fuelOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          className="h-8 text-right text-primary"
                          value={r.qty || ""}
                          onChange={(e) => updateFuel(r.id, { qty: +e.target.value || 0 })}
                          placeholder="0.00"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">
                          {r.unit} / 万Nm³
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.source}
                        onValueChange={(v) =>
                          updateFuel(r.id, { source: v as DataSource })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">缺省值</SelectItem>
                          <SelectItem value="measured">自测值</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          disabled={r.source === "default"}
                          className="h-8 text-right text-primary disabled:opacity-50"
                          value={r.ncv ?? ""}
                          onChange={(e) =>
                            updateFuel(r.id, { ncv: e.target.value === "" ? null : +e.target.value })
                          }
                          placeholder="—"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">GJ/t</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        disabled={r.source === "default"}
                        className="h-8 text-right text-primary disabled:opacity-50"
                        value={r.cc ?? ""}
                        onChange={(e) =>
                          updateFuel(r.id, { cc: e.target.value === "" ? null : +e.target.value })
                        }
                        placeholder="—"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        disabled={r.source === "default"}
                        className="h-8 text-right text-primary disabled:opacity-50"
                        value={r.ox ?? ""}
                        onChange={(e) =>
                          updateFuel(r.id, { ox: e.target.value === "" ? null : +e.target.value })
                        }
                        placeholder="—"
                      />
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-warning">
                      {r.emission == null ? "—" : fmt(r.emission)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="h-8 text-right text-primary"
                        value={r.output || ""}
                        onChange={(e) => updateFuel(r.id, { output: +e.target.value || 0 })}
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-warning">
                      {r.intensity == null ? "—" : fmt(r.intensity, 4)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={fuelRows.length <= 1}
                        onClick={() => setFuelRows((rs) => rs.filter((x) => x.id !== r.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/40 font-medium">
                  <TableCell colSpan={7} className="text-right text-muted-foreground">
                    合计
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-warning">
                    {fmt(fuelSubtotal)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-warning">
                    {fmt(fuelOutputSubtotal)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">—</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-muted-foreground">共 {fuelRows.length} 条记录</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFuelRows((rs) => [...rs, newFuelRow()])}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增燃料品种
            </Button>
          </div>

          <div className="rounded-md bg-muted/30 px-3 py-2 text-xs font-mono text-foreground">
            <span className="text-muted-foreground mr-2">公式：</span>
            排放量(tCO₂) = 净消耗量 × 低位发热量 × 单位热值含碳量(tC/GJ) × 碳氧化率(%) × 44/12
          </div>
        </div>
      </Card>

      {/* 范围二 */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">范围二 · 净购入电力和热力消费</div>
              <div className="text-xs text-muted-foreground">
                净购入电力和热力消费引起的 CO₂ 排放（按能源类型逐条录入）
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">小计排放量</div>
            <div className="text-base font-semibold text-primary tabular-nums">
              {fmt(elecSubtotal)} <span className="text-xs font-normal">tCO₂</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-xs text-muted-foreground">
            排放因子支持「缺省值」与「自测值」两种来源；缺省值参考附件表 2.3。
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[140px]">类型 *</TableHead>
                  <TableHead className="text-right min-w-[140px]">净购入量 *</TableHead>
                  <TableHead className="min-w-[100px]">数据来源</TableHead>
                  <TableHead className="text-right min-w-[160px]">CO₂ 排放因子</TableHead>
                  <TableHead className="text-right min-w-[120px]">排放量 (tCO₂)</TableHead>
                  <TableHead className="text-right min-w-[120px]">生产总值 (万元)</TableHead>
                  <TableHead className="text-right min-w-[140px]">碳排放强度 (tCO₂/万元)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elecComputed.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <Select
                        value={r.type}
                        onValueChange={(v) => {
                          const opt = HEAT_ELEC_OPTIONS.find((o) => o.value === v);
                          updateElec(r.id, { type: v, unit: opt?.unit ?? r.unit });
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="请选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEAT_ELEC_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          className="h-8 text-right text-primary"
                          value={r.qty || ""}
                          onChange={(e) => updateElec(r.id, { qty: +e.target.value || 0 })}
                          placeholder="0.00"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">{r.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.source}
                        onValueChange={(v) =>
                          updateElec(r.id, { source: v as DataSource })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">缺省值</SelectItem>
                          <SelectItem value="measured">自测值</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          disabled={r.source === "default"}
                          className="h-8 text-right text-primary disabled:opacity-50"
                          value={r.factor ?? ""}
                          onChange={(e) =>
                            updateElec(r.id, {
                              factor: e.target.value === "" ? null : +e.target.value,
                            })
                          }
                          placeholder="—"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">
                          tCO₂/{r.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-primary">
                      {r.emission == null ? "—" : fmt(r.emission)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={elecRows.length <= 1}
                        onClick={() => setElecRows((rs) => rs.filter((x) => x.id !== r.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/40 font-medium">
                  <TableCell colSpan={5} className="text-right text-muted-foreground">
                    合计
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {fmt(elecSubtotal)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-muted-foreground">共 {elecRows.length} 条记录</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setElecRows((rs) => [...rs, newElecRow()])}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增能源类型
            </Button>
          </div>

          <div className="rounded-md bg-muted/30 px-3 py-2 text-xs font-mono text-foreground">
            <span className="text-muted-foreground mr-2">公式：</span>
            排放量(tCO₂) = 净购入量 × CO₂ 排放因子
          </div>
        </div>
      </Card>
    </div>
  );
}
