import { useState } from "react";
import { Link } from "react-router-dom";
import { ArchiveStatus, EnterpriseArchive, ArchiveStatusLabel } from "@/mocks/archives";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListPagination, paginate } from "@/components/ui/list-pagination";

interface Props {
  rows: EnterpriseArchive[];
  year: number;
}

const statusStyles: Record<ArchiveStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  pending: "bg-muted/40 text-muted-foreground border-dashed border-border",
};

export function EnterpriseYearMatrix({ rows, year }: Props) {
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
              <th className="text-left font-medium px-4 py-3 min-w-[240px]">企业名称</th>
              <th className="text-left font-medium px-4 py-3 min-w-[180px]">统一社会信用代码</th>
              <th className="text-left font-medium px-4 py-3">所属行业</th>
              <th className="text-left font-medium px-4 py-3">所属区</th>
              <th className="text-center font-medium px-4 py-3 min-w-[100px]">上报状态</th>
              <th className="text-left font-medium px-4 py-3 min-w-[120px]">提交时间</th>
              <th className="text-right font-medium px-4 py-3 min-w-[100px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((ent, idx) => {
              const yr = ent.years.find((x) => x.year === year);
              const status: ArchiveStatus = yr?.status ?? "pending";
              const submittedAt = yr && status !== "pending" ? (yr.updatedAt || yr.createdAt) : "—";
              return (
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
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium",
                        statusStyles[status],
                      )}
                    >
                      {ArchiveStatusLabel[status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {submittedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/gov/archives/${ent.id}/${year}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      查看档案
                    </Link>
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
