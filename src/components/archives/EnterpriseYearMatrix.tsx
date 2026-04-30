import { useState } from "react";
import { Link } from "react-router-dom";
import { ArchiveStatus, EnterpriseArchive, ArchiveStatusLabel } from "@/mocks/archives";
import { ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListPagination, paginate } from "@/components/ui/list-pagination";

interface Props {
  rows: EnterpriseArchive[];
  years: number[];
  currentYear: number;
}

const cellStyles: Record<ArchiveStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  pending: "bg-muted/40 text-muted-foreground border-dashed border-border",
};

export function EnterpriseYearMatrix({ rows, years, currentYear }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageRows = paginate(rows, page, pageSize);
  return (
    <div className="rounded-lg border border-border/70 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-xs">
          <tr>
            <th className="text-center font-medium px-4 py-3 w-[60px]">序号</th>
            <th className="text-left font-medium px-4 py-3 min-w-[260px]">企业</th>
            <th className="text-left font-medium px-4 py-3 min-w-[180px]">统一社会信用代码</th>
            <th className="text-left font-medium px-4 py-3">行业</th>
            <th className="text-left font-medium px-4 py-3">所属区</th>
            {years.map((y) => (
              <th key={y} className="text-center font-medium px-4 py-3 min-w-[120px]">
                {y}
                {y === currentYear && (
                  <span className="ml-1 text-[10px] text-primary">本期</span>
                )}
              </th>
            ))}
            <th className="text-right font-medium px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((ent, idx) => (
            <tr
              key={ent.id}
              className={cn(
                "border-t border-border/60 hover:bg-primary/[0.03] transition-colors",
                idx % 2 === 1 && "bg-muted/20",
              )}
            >
              <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                {(page - 1) * pageSize + idx + 1}
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{ent.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {ent.creditCode}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{ent.industry}</td>
              <td className="px-4 py-3 text-muted-foreground">{ent.district}</td>
              {years.map((y) => {
                const yr = ent.years.find((x) => x.year === y);
                const status: ArchiveStatus = yr?.status ?? "pending";
                return (
                  <td key={y} className="px-3 py-3 text-center">
                    {yr ? (
                      <Link
                        to={`/gov/archives/${ent.id}/${y}`}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-all hover:shadow-sm",
                          cellStyles[status],
                        )}
                      >
                        {ArchiveStatusLabel[status]}
                        {status === "submitted" && <ArrowRight className="h-3 w-3" />}
                      </Link>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60">—</span>
                    )}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/gov/archives/${ent.id}/${currentYear}`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  查看
                </Link>
              </td>
            </tr>
          ))}
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
