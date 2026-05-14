import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { FormulaCard } from "./FormulaCard";
import { PercentInput } from "./PercentInput";
import { TrendChart } from "./TrendChart";
import { calcEnergyIntensity, calcCarbonIntensity } from "@/lib/trendCalc";
import {
  energyIntensityDefaults,
  carbonIntensityDefaults,
  type IntensityScenario,
} from "@/mocks/trendDefaults";

interface Props {
  kind: "energy" | "carbon";
}

const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;

export function IntensityPanel({ kind }: Props) {
  const isEnergy = kind === "energy";
  const initial = isEnergy ? energyIntensityDefaults : carbonIntensityDefaults;
  const indicator = isEnergy ? "能耗" : "碳排放";
  const intensityName = isEnergy ? "单位工业增加值能耗下降率" : "单位工业增加值碳排放下降率";
  const refY = isEnergy ? -0.135 : -0.18;
  const refLabel = isEnergy ? "参考目标 -13.5%" : "参考目标 -18%";

  const [rows, setRows] = useState<IntensityScenario[]>(initial);

  const computed = useMemo(
    () =>
      rows.map((r) => {
        if (isEnergy) {
          const c = calcEnergyIntensity(r.c, r.e);
          return { ...r, d: c.d, fAnnual: c.fAnnual, g: c.g };
        }
        const c = calcCarbonIntensity(r.c, r.e);
        return { ...r, d: c.d, fAnnual: undefined as number | undefined, g: c.f };
      }),
    [rows, isEnergy],
  );

  const updateRow = (id: string, patch: Partial<IntensityScenario>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => {
    const last = rows[rows.length - 1] ?? { c: 0.0533, e: 0.05 };
    setRows((rs) => [...rs, { id: `row-${Date.now()}`, c: last.c, e: last.e }]);
  };

  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const reset = () => setRows(initial);

  const chartData = computed.map((r) => ({
    name: `${(r.e * 100).toFixed(1)}%`,
    [`${indicator}强度下降率`]: Number((r.g * 100).toFixed(2)) / 100,
  }));

  const formulaItems = isEnergy
    ? [
        { name: "D", expr: "(1 + C)^5 − 1", desc: "工业增加值5年累计" },
        { name: "F", expr: "(1 + E)^(1/5) − 1", desc: "折算的年均能耗增速" },
        { name: "G", expr: "(1 + E) / (1 + D) − 1", desc: "5年单位增加值能耗下降率" },
      ]
    : [
        { name: "D", expr: "(1 + C)^5 − 1", desc: "工业增加值5年累计" },
        { name: "F", expr: "(1 + E) / (1 + D) − 1", desc: "5年单位增加值碳排放下降率" },
      ];

  return (
    <div className="space-y-4">
      <FormulaCard
        items={formulaItems}
        notes={[
          "C = 工业增加值同比（预设）",
          `E = 5年${indicator}累计增长率（预设）`,
          `${intensityName}为负值表示下降，需达到 ${(refY * 100).toFixed(1)}% 以下`,
        ]}
      />

      <Card className="p-4">
        <div className="flex items-center justify-end mb-3 gap-2">
          <Button size="sm" variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" />
            新增情景
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            重置默认
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center">情景</TableHead>
                <TableHead>
                  <div>工业增加值同比</div>
                  <div className="text-[11px] font-normal text-primary">输入 C</div>
                </TableHead>
                <TableHead>
                  <div>工业增加值5年累计</div>
                  <div className="text-[11px] font-normal text-muted-foreground">D = (1+C)^5−1</div>
                </TableHead>
                <TableHead>
                  <div>5年{indicator}增长率</div>
                  <div className="text-[11px] font-normal text-primary">输入 E</div>
                </TableHead>
                {isEnergy && (
                  <TableHead>
                    <div>每年{indicator}增速</div>
                    <div className="text-[11px] font-normal text-muted-foreground">F = (1+E)^(1/5)−1</div>
                  </TableHead>
                )}
                <TableHead>
                  <div>{indicator}强度下降率</div>
                  <div className="text-[11px] font-normal text-muted-foreground">
                    {isEnergy ? "G" : "F"} = (1+E)/(1+D)−1
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computed.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <PercentInput value={r.c} onChange={(v) => updateRow(r.id, { c: v })} />
                  </TableCell>
                  <TableCell className="tabular-nums">{fmtPct(r.d)}</TableCell>
                  <TableCell>
                    <PercentInput value={r.e} onChange={(v) => updateRow(r.id, { e: v })} />
                  </TableCell>
                  {isEnergy && (
                    <TableCell className="tabular-nums">
                      {r.fAnnual !== undefined ? fmtPct(r.fAnnual) : "-"}
                    </TableCell>
                  )}
                  <TableCell
                    className={`tabular-nums font-medium ${r.g <= refY ? "text-primary" : "text-destructive"}`}
                  >
                    {fmtPct(r.g)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => removeRow(r.id)}
                      disabled={rows.length <= 1}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <TrendChart
        title={`${indicator}增长率 E 与${indicator}强度下降率的趋势关系`}
        data={chartData}
        xKey="name"
        series={[{ key: `${indicator}强度下降率`, name: `${indicator}强度下降率`, type: "line" }]}
        yFormatter={(v) => `${(v * 100).toFixed(1)}%`}
        referenceY={{ value: refY, label: refLabel }}
        kind="line"
      />
    </div>
  );
}
