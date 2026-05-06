import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Upload, Undo2, X, FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bqAssessDetail, type BqEntAssessRow, type BqAssessDetailRow } from "@/mocks/assess";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  row: BqEntAssessRow | null;
  onClose: () => void;
  onRollback: (id: string) => void;
  onUploadReport: (id: string, file: { name: string; url: string; uploadedAt: string }) => void;
}

const cell = "px-2 py-1.5 align-top text-xs border-r border-b border-border";

export function BqEntAssessDetailDialog({ open, row, onClose, onRollback, onUploadReport }: Props) {
  const [detail, setDetail] = useState<BqAssessDetailRow[]>(bqAssessDetail);
  const reportInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setDetail(bqAssessDetail.map((d) => ({ ...d })));
  }, [open, row?.id]);

  const totals = useMemo(() => {
    const total = detail.reduce((s, d) => s + d.itemScore, 0);
    const self = detail.reduce((s, d) => s + d.selfScore, 0);
    const review = detail.reduce((s, d) => s + d.reviewScore, 0);
    return { total, self, review };
  }, [detail]);

  // 把含 groupName 的行做 rowSpan 计算
  const groupSpans = useMemo(() => {
    const spans: Record<number, number> = {};
    let curIdx = -1;
    detail.forEach((d, i) => {
      if (d.groupName) {
        curIdx = i;
        spans[i] = 1;
      } else if (curIdx >= 0) {
        spans[curIdx]++;
      }
    });
    return spans;
  }, [detail]);

  if (!row) return null;

  const updateReview = (i: number, patch: Partial<BqAssessDetailRow>) => {
    setDetail((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      onUploadReport(row.id, { name: f.name, url, uploadedAt: new Date().toISOString().slice(0, 10) });
      toast.success(`已上传考评报告：${f.name}`);
    }
    e.target.value = "";
  };

  const downloadAttachment = () => {
    toast.success("正在下载企业自评相关附件.zip");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[95vw] w-[1400px] h-[90vh] p-0 flex flex-col gap-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <input ref={reportInput} type="file" className="hidden" accept=".pdf,.zip,.doc,.docx" onChange={handleReportUpload} />

        {/* 顶部工具栏 */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30 flex-wrap">
          <h2 className="text-base font-semibold text-foreground mr-2">企业节能"双控"责任评价考核</h2>
          <div className="flex-1 min-w-[200px] flex items-center gap-2">
            <div className="flex-1 max-w-md flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-background text-xs">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate text-foreground/80">企业自评相关附件（更新版）.zip</span>
            </div>
            <Button size="sm" className="h-9 bg-primary text-primary-foreground" onClick={downloadAttachment}>
              下载附件
            </Button>
          </div>
          <Button size="sm" variant="outline" className="h-9" onClick={() => toast.success("已导出")}>
            导出
          </Button>
          <Button size="sm" className="h-9 bg-success text-success-foreground hover:bg-success/90" onClick={() => reportInput.current?.click()}>
            <Upload className="h-3.5 w-3.5 mr-1" />上传考评报告
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 text-destructive border-destructive/40 hover:text-destructive"
            onClick={() => {
              onRollback(row.id);
              toast.success("已退回重填");
              onClose();
            }}
          >
            <Undo2 className="h-3.5 w-3.5 mr-1" />退回重填
          </Button>
          <Button size="sm" variant="ghost" className="h-9" onClick={onClose}>
            <X className="h-3.5 w-3.5 mr-1" />关闭
          </Button>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto px-5 py-3">
          <table className="min-w-[1300px] w-full border-collapse text-xs border-l border-t border-border">
            <thead className="bg-primary/10">
              <tr>
                <th colSpan={11} className="px-3 py-2.5 text-center text-sm font-semibold border-r border-b border-border text-foreground">
                  上海市工业"百家""千家"和通信业企业{row.year}年节能目标考核评分标准
                </th>
              </tr>
              <tr className="bg-muted/60 text-muted-foreground">
                <th className={cn(cell, "w-12 text-center font-medium")}>序号</th>
                <th className={cn(cell, "w-32 text-center font-medium")}>考核指标</th>
                <th className={cn(cell, "w-14 text-center font-medium")}>分值</th>
                <th className={cn(cell, "w-14 text-center font-medium")}>分值</th>
                <th className={cn(cell, "min-w-[300px] text-center font-medium")}>评分标准</th>
                <th className={cn(cell, "w-14 text-center font-medium")}>自评分</th>
                <th className={cn(cell, "w-32 text-center font-medium")}>评分依据</th>
                <th className={cn(cell, "w-48 text-center font-medium")}>证明材料</th>
                <th className={cn(cell, "w-14 text-center font-medium bg-warning/10")}>考评分</th>
                <th className={cn(cell, "min-w-[160px] text-center font-medium bg-warning/10")}>评分依据</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((d, i) => (
                <tr key={i} className="hover:bg-accent/20">
                  <td className={cn(cell, "text-center")}>{i + 1}</td>
                  {d.groupName ? (
                    <td rowSpan={groupSpans[i]} className={cn(cell, "text-center font-medium bg-muted/30 align-middle")}>
                      {d.groupName}
                    </td>
                  ) : null}
                  {d.groupName ? (
                    <td rowSpan={groupSpans[i]} className={cn(cell, "text-center bg-muted/30 align-middle")}>
                      {d.groupScore}
                    </td>
                  ) : null}
                  <td className={cn(cell, "text-center")}>{d.itemScore}</td>
                  <td className={cn(cell, "text-foreground/80 leading-relaxed")}>
                    <span className="font-medium">{d.no}</span>　{d.criterion}
                  </td>
                  <td className={cn(cell, "text-center font-mono")}>{d.selfScore}</td>
                  <td className={cn(cell, "text-foreground/70")}>{d.selfBasis || "—"}</td>
                  <td className={cn(cell)}>
                    {d.proofs.length ? (
                      <div className="flex flex-col gap-1">
                        {d.proofs.map((p, k) => (
                          <button
                            key={k}
                            onClick={() => toast.success(`正在下载 ${p.name}`)}
                            className="text-left text-primary hover:underline inline-flex items-start gap-1"
                            title={p.name}
                          >
                            <Download className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className={cn(cell, "bg-warning/5")}>
                    <Input
                      type="number"
                      value={d.reviewScore}
                      max={d.itemScore}
                      min={0}
                      onChange={(e) => updateReview(i, { reviewScore: Number(e.target.value) })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="h-7 text-xs text-center"
                    />
                  </td>
                  <td className={cn(cell, "bg-warning/5")}>
                    <Textarea
                      value={d.reviewBasis}
                      onChange={(e) => updateReview(i, { reviewBasis: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          (e.target as HTMLTextAreaElement).blur();
                        }
                      }}
                      placeholder="回车确认"
                      className="min-h-[28px] h-7 text-xs resize-none py-1"
                      rows={1}
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/5 font-semibold text-foreground">
                <td colSpan={2} className={cn(cell, "text-center")}>小计</td>
                <td className={cn(cell, "text-center")}>{totals.total}</td>
                <td className={cn(cell, "text-center")}>{totals.total}</td>
                <td className={cell}></td>
                <td className={cn(cell, "text-center font-mono")}>{totals.self}</td>
                <td className={cell}></td>
                <td className={cell}></td>
                <td className={cn(cell, "text-center font-mono bg-warning/10")}>{totals.review}</td>
                <td className={cn(cell, "bg-warning/10")}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 底部保存 */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20">
          <Button variant="outline" size="sm" className="h-9" onClick={onClose}>取消</Button>
          <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground" onClick={() => { toast.success("已保存考评分"); onClose(); }}>
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
