import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PassBadge } from "./PassBadge";
import type { DistrictAssessSummary, DistrictGoalSummary } from "@/mocks/assess";

type Variant = "goal" | "assess";

interface Props {
  variant: Variant;
  rows: (DistrictAssessSummary | DistrictGoalSummary)[];
  year: number;
  onAction: (districtId: string) => void;
}

export function DistrictListTable({ variant, rows, year, onAction }: Props) {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-16 text-center">序号</TableHead>
            <TableHead>年份</TableHead>
            <TableHead>单位名称</TableHead>
            <TableHead className="text-right">下属单位数量</TableHead>
            {variant === "assess" && <TableHead>考评时间</TableHead>}
            <TableHead>状态</TableHead>
            {variant === "assess" && <TableHead>盖章版证明</TableHead>}
            {variant === "goal" && <TableHead>证明材料</TableHead>}
            <TableHead className="text-right pr-6">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, idx) => {
            const isAssess = variant === "assess";
            const ar = r as DistrictAssessSummary;
            return (
              <TableRow key={r.districtId}>
                <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="text-xs">{year}年</TableCell>
                <TableCell className="text-xs font-medium">{r.name}</TableCell>
                <TableCell className="text-right text-xs font-mono">{r.count}</TableCell>
                {isAssess && <TableCell className="text-xs">{ar.assessTime || "—"}</TableCell>}
                <TableCell>
                  <PassBadge value={r.status} />
                </TableCell>
                {isAssess && (
                  <TableCell>
                    {ar.hasStampedDoc ? (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2">
                        <Download className="h-3 w-3 mr-1" />下载证明
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {!isAssess && (
                  <TableCell>
                    {(r as DistrictGoalSummary).status === "已完成" ? (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2">
                        <Download className="h-3 w-3 mr-1" />下载证明材料
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary"
                    onClick={() => onAction(r.districtId)}
                  >
                    {isAssess ? "考核下属企业" : "目标详情"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
