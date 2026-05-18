import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RotateCcw, Trash2, Database } from "lucide-react";
import { PercentInput } from "./PercentInput";
import { calcIncrement } from "@/lib/trendCalc";
import {
  ENERGY_BASE_2025,
  CARBON_BASE_2025,
  energyIncrementDefaults,
  carbonIncrementDefaults,
  type IncrementScenario,
} from "@/mocks/trendDefaults";

interface Props {
  kind: "energy" | "carbon";
}

const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;
const fmtNum = (v: number, d = 2) => v.toLocaleString("zh-CN", { maximumFractionDigits: d, minimumFractionDigits: d });

export function IncrementPanel({ kind }: Props) {
  const isEnergy = kind === "energy";
  const initialDefaults = isEnergy ? energyIncrementDefaults : carbonIncrementDefaults;
  const initialBase = isEnergy ? ENERGY_BASE_2025 : CARBON_BASE_2025;

  const [rows, setRows] = useState<IncrementScenario[]>(initialDefaults.slice(0, 1));
  const [base, setBase] = useState<number>(initialBase);

  const unit = isEnergy ? "万吨标煤" : "万吨CO₂";
  const indicator = isEnergy ? "能耗" : "碳排放";
  const dropLabel = isEnergy ? "单位工业增加值能耗下降率" : "单位工业增加值碳排放下降率";
  const baseSourceLabel = isEnergy
    ? "来源：市统计局 · 全市规上工业能耗（2025）"
    : "来源：所有已填年报企业汇总 · 自动获取（2025）";

  const computed = useMemo(
    () => rows.map((r) => ({ ...r, ...calcIncrement(r.b, r.c, base) })),
    [rows, base],
  );

  const updateRow = (id: string, patch: Partial<IncrementScenario>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => {
    const last = rows[rows.length - 1] ?? { b: -0.1, c: 0.0533 };
    setRows((rs) => [...rs, { id: `row-${Date.now()}`, b: last.b, c: last.c }]);
  };

  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const reset = () => {
    setRows(initialDefaults.slice(0, 1));
    setBase(initialBase);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">2025年{indicator}基数 F：</span>
            <Input
              type="number"
              value={base}
              onChange={(e) => setBase(Number(e.target.value) || 0)}
              className="h-8 w-32 text-right tabular-nums"
            />
            <span className="text-muted-foreground">{unit}</span>
            <span className="text-xs text-muted-foreground/80 ml-2">{baseSourceLabel}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" />
              新增情景
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              重置默认
            </Button>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center">情景</TableHead>
                <TableHead>
                  <div>{dropLabel}</div>
                  <div className="text-[11px] font-normal text-primary">输入 B</div>
                </TableHead>
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
                  <div className="text-[11px] font-normal text-muted-foreground">E = (1+B)(1+D)−1</div>
                </TableHead>
                <TableHead>
                  <div>2030年{indicator}</div>
                  <div className="text-[11px] font-normal text-muted-foreground">G = F×(1+E)</div>
                </TableHead>
                <TableHead>
                  <div>{indicator}增加量</div>
                  <div className="text-[11px] font-normal text-muted-foreground">H = G−F</div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computed.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <PercentInput value={r.b} onChange={(v) => updateRow(r.id, { b: v })} />
                  </TableCell>
                  <TableCell>
                    <PercentInput value={r.c} onChange={(v) => updateRow(r.id, { c: v })} />
                  </TableCell>
                  <TableCell className="tabular-nums">{fmtPct(r.d)}</TableCell>
                  <TableCell className="tabular-nums">{fmtPct(r.e)}</TableCell>
                  <TableCell className="tabular-nums font-medium">{fmtNum(r.g)}</TableCell>
                  <TableCell className="tabular-nums font-medium text-primary">{fmtNum(r.h)}</TableCell>
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
    </div>
  );
}
