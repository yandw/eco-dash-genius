import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import { PassBadge } from "./PassBadge";
import { dualResult, passByValue, type EnergyAssessRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";

interface Props {
  rows: EnergyAssessRow[];
  mode: "district-edit" | "city-view" | "city-edit";
  onChange?: (id: string, patch: Partial<EnergyAssessRow>) => void;
}

const cellRO = "px-3 py-2 align-middle text-xs text-foreground/90 bg-muted/40";

export function DistrictAssessTable({ rows, mode, onChange }: Props) {
  const editable = mode === "district-edit" || mode === "city-edit";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageRows = paginate(rows, page, pageSize);

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-[1700px] w-full border-collapse text-xs">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="border-b border-border">
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border w-12">序号</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">区名称</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border min-w-[200px]">企业名称</th>
            <th colSpan={4} className="px-3 py-2 font-medium border-r border-border text-center">能耗总量目标完成情况<br /><span className="text-[10px] opacity-70">（吨标准煤）</span></th>
            <th colSpan={6} className="px-3 py-2 font-medium border-r border-border text-center">能耗强度目标完成情况</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">双控指标<br />完成情况</th>
            <th rowSpan={3} className="px-3 py-2 font-medium border-r border-border">考核结果</th>
            <th rowSpan={3} className="px-3 py-2 font-medium min-w-[160px]">备注</th>
          </tr>
          <tr className="border-b border-border">
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">目标值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">实际值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证<br />可再生能源的<br />能耗总量</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">是否达标</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">目标值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">实际值</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">扣除绿电绿证<br />可再生能源的<br />能耗强度</th>
            <th rowSpan={2} className="px-3 py-2 font-medium border-r border-border">是否达标</th>
            <th colSpan={2} className="px-3 py-2 font-medium border-r border-border text-center">强度指标</th>
          </tr>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium border-r border-border">名称</th>
            <th className="px-3 py-2 font-medium border-r border-border">单位</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r, idx) => {
            const totalPass = passByValue(r.totalGoal, r.totalActualNetGreen);
            const intensityPass = passByValue(r.intensityGoal, r.intensityActualNetGreen);
            const auto = dualResult(r);
            const result = r.resultOverride ?? (auto === "—" ? "" : auto);
            const intensityNetCellVal = r.intensityActualNetGreen === 0 ? "#VALUE!" : r.intensityActualNetGreen;
            const seq = (page - 1) * pageSize + idx + 1;

            return (
              <tr key={r.id} className="border-b border-border hover:bg-accent/30">
                <td className={cn(cellRO, "border-r border-border text-center")}>{seq}</td>
                <td className={cn(cellRO, "border-r border-border")}>青浦区</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.entName}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalGoal || ""}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalActual}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.totalActualNetGreen}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {totalPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={totalPass} />}
                </td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityGoal || ""}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>{r.intensityActual}</td>
                <td className={cn(cellRO, "border-r border-border text-right")}>
                  {typeof intensityNetCellVal === "string" ? <span className="text-destructive font-mono">{intensityNetCellVal}</span> : intensityNetCellVal}
                </td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {intensityPass === "—" ? <span className="text-muted-foreground">—</span> : <PassBadge value={intensityPass} />}
                </td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityIndicator}</td>
                <td className={cn(cellRO, "border-r border-border")}>{r.intensityUnit}</td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {auto === "—" ? <span className="text-destructive font-mono">#VALUE!</span> : <PassBadge value={auto} />}
                </td>
                <td className={cn(cellRO, "border-r border-border text-center")}>
                  {editable ? (
                    <Select
                      value={result || ""}
                      onValueChange={(v) => {
                        const override = v as "完成" | "未完成";
                        onChange?.(r.id, { resultOverride: override });
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs w-24 mx-auto">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="完成">完成</SelectItem>
                        <SelectItem value="未完成">未完成</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : result ? (
                    <PassBadge value={result} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-2 py-1">
                  {editable ? (
                    <Input
                      value={r.remark}
                      onChange={(e) => onChange?.(r.id, { remark: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      placeholder={result === "完成" && auto === "未完成" ? "请说明原因 *" : "回车确认"}
                      className={cn("h-7 text-xs", result === "完成" && auto === "未完成" && !r.remark && "border-destructive")}
                    />
                  ) : r.remark ? (
                    r.remark
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <ListPagination
        total={rows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
