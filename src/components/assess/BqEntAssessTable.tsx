import { useRef, useState } from "react";
import { Upload, FileCheck2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import { PassBadge } from "./PassBadge";
import type { BqEntAssessRow } from "@/mocks/assess";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  rows: BqEntAssessRow[];
  onOpenDetail: (row: BqEntAssessRow) => void;
  onUploadReport: (id: string, file: { name: string; url: string; uploadedAt: string }) => void;
}

const cell = "px-3 py-2 align-middle text-xs text-foreground/90";

export function BqEntAssessTable({ rows, onOpenDetail, onUploadReport }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageRows = paginate(rows, page, pageSize);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const triggerUpload = (id: string) => {
    setPendingId(id);
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && pendingId) {
      const url = URL.createObjectURL(f);
      onUploadReport(pendingId, { name: f.name, url, uploadedAt: new Date().toISOString().slice(0, 10) });
      toast.success(`已上传：${f.name}`);
    }
    e.target.value = "";
    setPendingId(null);
  };

  const downloadReport = (row: BqEntAssessRow) => {
    if (!row.reportFile) return;
    const a = document.createElement("a");
    a.href = row.reportFile.url;
    a.download = row.reportFile.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success(`正在下载 ${row.reportFile.name}`);
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <input ref={inputRef} type="file" className="hidden" accept=".pdf,.zip,.doc,.docx" onChange={handleFile} />
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse text-xs">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium w-16 text-left">序号</th>
              <th className="px-3 py-2 font-medium w-24 text-left">考核年份</th>
              <th className="px-3 py-2 font-medium text-left min-w-[280px]">企业名称</th>
              <th className="px-3 py-2 font-medium w-20 text-right">自评分</th>
              <th className="px-3 py-2 font-medium w-20 text-right">总分</th>
              <th className="px-3 py-2 font-medium w-24 text-center">状态</th>
              <th className="px-3 py-2 font-medium w-32 text-center">考核报告</th>
              <th className="px-3 py-2 font-medium w-48 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, idx) => {
              const seq = (page - 1) * pageSize + idx + 1;
              return (
                <tr key={r.id} className="border-b border-border hover:bg-accent/30">
                  <td className={cn(cell)}>{seq}</td>
                  <td className={cn(cell)}>{r.year}年</td>
                  <td className={cn(cell)}>{r.entName}</td>
                  <td className={cn(cell, "text-right font-mono")}>{r.selfScore}</td>
                  <td className={cn(cell, "text-right font-mono font-semibold")}>{r.totalScore}</td>
                  <td className={cn(cell, "text-center")}>
                    <PassBadge value={r.status} />
                  </td>
                  <td className={cn(cell, "text-center")}>
                    {r.reportFile ? (
                      <button
                        onClick={() => downloadReport(r)}
                        className="inline-flex items-center gap-1 text-success hover:underline"
                        title={r.reportFile.name}
                      >
                        <FileCheck2 className="h-3.5 w-3.5" />
                        <span>已上传</span>
                        <Download className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className={cn(cell)}>
                    <div className="inline-flex items-center gap-3">
                      <button className="text-primary hover:underline" onClick={() => onOpenDetail(r)}>详情</button>
                      <button className="inline-flex items-center gap-1 text-foreground/80 hover:text-primary" onClick={() => triggerUpload(r.id)}>
                        <Upload className="h-3 w-3" />上传考核报告
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ListPagination total={rows.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
