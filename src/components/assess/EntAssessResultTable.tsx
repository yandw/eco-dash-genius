import { PassBadge } from "./PassBadge";
import type { EntAssessYearRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  rows: EntAssessYearRow[];
  entName: string;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90";

export function EntAssessResultTable({ rows, entName }: Props) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="px-4 py-3 border-b border-border text-center text-sm font-semibold">
        {entName} 目标考核结果
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] w-full border-collapse text-xs">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="border-b border-border">
              <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
              <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">年份</th>
              <th colSpan={4} className="px-3 py-2 font-medium border-r border-border text-center">能耗总量目标完成情况</th>
              <th colSpan={6} className="px-3 py-2 font-medium border-r border-border text-center">能耗强度目标完成情况</th>
              <th rowSpan={2} className="px-3 py-2 font-medium min-w-[140px]">备注</th>
            </tr>
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium border-r border-border">目标值</th>
              <th className="px-3 py-2 font-medium border-r border-border">实际值</th>
              <th className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证可再生能源的能耗总量</th>
              <th className="px-3 py-2 font-medium border-r border-border">是否达标</th>
              <th className="px-3 py-2 font-medium border-r border-border">能耗强度指标</th>
              <th className="px-3 py-2 font-medium border-r border-border">能耗强度单位</th>
              <th className="px-3 py-2 font-medium border-r border-border">目标值</th>
              <th className="px-3 py-2 font-medium border-r border-border">实际值</th>
              <th className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证可再生能源的能耗强度</th>
              <th className="px-3 py-2 font-medium border-r border-border">是否达标</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={13} className="text-center text-sm text-muted-foreground py-12">暂无数据</td>
              </tr>
            )}
            {rows.map((r, idx) => (
              <tr key={r.year} className="border-b border-border hover:bg-accent/30">
                <td className={cn(cellRO, "border-r border-border text-center")}>{idx + 1}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>{r.year}年</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalGoal || "—"}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalActual}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalActualNetGreen}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {r.totalPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={r.totalPass} />}
                </td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator}</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityGoal || "—"}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityActual}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityActualNetGreen}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {r.intensityPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={r.intensityPass} />}
                </td>
                <td className={cn(cellRO)}>{r.remark || <span className="text-muted-foreground">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
