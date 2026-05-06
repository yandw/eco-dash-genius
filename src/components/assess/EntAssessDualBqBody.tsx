import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, FileCheck2, Upload, Save, X, Plus, Send, Undo2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PassBadge } from "@/components/assess/PassBadge";
import { bqAssessDetail, bqEntAssessList, type BqAssessDetailRow } from "@/mocks/assess";
import { useBqAssessStore, updateBqEnt } from "@/mocks/bqAssessStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Group {
  name: string;
  groupScore: number;
  items: Array<BqAssessDetailRow & { __idx: number }>;
}

interface Props {
  /** 企业用户编辑模式：企业自评可编辑，政府考评只读 */
  editable?: boolean;
}

/** 市管企业 — 百千家通信业能耗考核结果 */
export function EntAssessDualBqBody({ editable = false }: Props) {
  const list = useBqAssessStore();
  const row = list[0];
  const proofInput = useRef<HTMLInputElement>(null);
  const [proofTargetIdx, setProofTargetIdx] = useState<number | null>(null);
  // "已完成"=政府已考评，企业不可退回；"已提交"=待政府审核，企业可退回；"待提交"=可编辑
  const govDone = row.status === "已完成" || row.status === "考核中";
  const canEdit = editable && row.status === "待提交";

  const [detail, setDetail] = useState<BqAssessDetailRow[]>(() => bqAssessDetail.map((d) => ({ ...d, proofs: [...d.proofs] })));

  useEffect(() => {
    setDetail(bqAssessDetail.map((d) => ({ ...d, proofs: [...d.proofs] })));
  }, []);

  const groups: Group[] = useMemo(() => {
    const out: Group[] = [];
    let cur: Group | null = null;
    detail.forEach((d, i) => {
      if (d.groupName) {
        cur = { name: d.groupName, groupScore: d.groupScore ?? 0, items: [] };
        out.push(cur);
      }
      cur?.items.push({ ...d, __idx: i });
    });
    return out;
  }, [detail]);

  const totals = useMemo(() => ({
    total: detail.reduce((s, d) => s + d.itemScore, 0),
    self: detail.reduce((s, d) => s + d.selfScore, 0),
    review: detail.reduce((s, d) => s + d.reviewScore, 0),
  }), [detail]);

  const groupSelfSum = (g: Group) => g.items.reduce((s, x) => s + x.selfScore, 0);
  const groupReviewSum = (g: Group) => g.items.reduce((s, x) => s + x.reviewScore, 0);

  const updateSelf = (i: number, patch: Partial<BqAssessDetailRow>) => {
    setDetail((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };
  const removeProof = (i: number, k: number) => {
    setDetail((prev) => prev.map((d, idx) => (idx === i ? { ...d, proofs: d.proofs.filter((_, j) => j !== k) } : d)));
  };
  const triggerProofUpload = (i: number) => {
    setProofTargetIdx(i);
    proofInput.current?.click();
  };
  const handleProofFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && proofTargetIdx !== null) {
      const url = URL.createObjectURL(f);
      setDetail((prev) => prev.map((d, idx) => (idx === proofTargetIdx ? { ...d, proofs: [...d.proofs, { name: f.name, url }] } : d)));
      toast.success(`已上传：${f.name}`);
    }
    e.target.value = "";
    setProofTargetIdx(null);
  };

  return (
    <>
      <input ref={proofInput} type="file" className="hidden" accept=".pdf,.zip,.doc,.docx,.png,.jpg,.jpeg" onChange={handleProofFile} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">
        重点单位能耗双控考核结果
      </h1>

      {/* 顶部工具栏 */}
      <div className="panel p-3 mb-4 flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-foreground mr-2">企业节能"双控"责任评价考核</h2>
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-background text-xs">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate text-foreground/80">企业自评相关附件（更新版）.zip</span>
          </div>
          <Button size="sm" className="h-9" onClick={() => toast.success("正在下载企业自评相关附件.zip")}>
            <Download className="h-3.5 w-3.5 mr-1" />下载附件
          </Button>
        </div>
        {row.reportFile && (
          <Button
            size="sm"
            variant="outline"
            className="h-9 text-success border-success/40 hover:text-success"
            onClick={() => toast.success(`正在下载 ${row.reportFile!.name}`)}
          >
            <Download className="h-3.5 w-3.5 mr-1" />下载考评报告
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-9" onClick={() => toast.success("已导出")}>导出</Button>
        {editable && canEdit && (
          <>
            <Button size="sm" variant="outline" className="h-9" onClick={() => toast.success("已保存企业自评")}>
              <Save className="h-3.5 w-3.5 mr-1" />保存
            </Button>
            <Button
              size="sm"
              className="h-9 bg-gradient-primary text-primary-foreground"
              onClick={() => {
                updateBqEnt(row.id, { status: "已提交" });
                toast.success("已提交考核，等待政府审核");
              }}
            >
              <Send className="h-3.5 w-3.5 mr-1" />提交
            </Button>
          </>
        )}
        {editable && row.status === "已提交" && (
          <Button
            size="sm"
            variant="outline"
            className="h-9 text-warning border-warning/40 hover:text-warning"
            onClick={() => {
              updateBqEnt(row.id, { status: "待提交" });
              toast.success("已退回，可重新编辑");
            }}
          >
            <Undo2 className="h-3.5 w-3.5 mr-1" />退回
          </Button>
        )}
        {editable && govDone && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />政府已完成考评，如需修改请联系主管部门
          </span>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* 企业基础信息 */}
        <Card className="p-4">
          <div className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
            <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
            上海市工业"百家""千家"和通信业企业{row.year}年节能目标考核
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground">企业名称</div>
              <div className="text-sm font-medium text-foreground">{row.entName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground">考核年份</div>
              <div className="text-sm font-medium">{row.year}年</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground">企业自评分</div>
              <div className="text-lg font-semibold font-mono">{totals.self} <span className="text-xs text-muted-foreground font-normal">/ {totals.total}</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground">政府考评分</div>
              <div className="text-lg font-semibold font-mono text-warning">{totals.review} <span className="text-xs text-muted-foreground font-normal">/ {totals.total}</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground">考核状态</div>
              <div><PassBadge value={row.status} /></div>
            </div>
          </div>
        </Card>

        {/* 三大分组卡片 */}
        {groups.map((g, gi) => {
          const reviewSum = groupReviewSum(g);
          const selfSum = groupSelfSum(g);
          return (
            <Card key={gi} className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-primary/5 border-b border-border">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{gi + 1}</span>
                  <span className="text-sm font-semibold text-foreground">{g.name}</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">满分 {g.groupScore}</Badge>
                </div>
                <div className="flex items-center gap-5 text-xs">
                  <div className="inline-flex items-baseline gap-1"><span className="text-muted-foreground">自评</span><span className="font-mono font-bold text-foreground text-xl tabular-nums leading-none">{selfSum}</span><span className="text-muted-foreground">/ {g.groupScore}</span></div>
                  <div className="inline-flex items-baseline gap-1"><span className="text-muted-foreground">考评</span><span className="font-mono font-bold text-warning text-xl tabular-nums leading-none">{reviewSum}</span><span className="text-muted-foreground">/ {g.groupScore}</span></div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {g.items.map((it) => (
                  <div key={it.__idx} className="p-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">{it.no}</Badge>
                      <span className="text-xs text-muted-foreground">单项分值</span>
                      <span className="text-sm font-semibold text-foreground">{it.itemScore} 分</span>
                    </div>

                    <div className="rounded-md bg-muted/40 border border-border px-3 py-2 text-xs leading-relaxed text-foreground/80">
                      <span className="font-medium text-muted-foreground mr-1">评分标准：</span>{it.criterion}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* 企业自评 */}
                      <div className={`rounded-md border p-3 space-y-2.5 ${canEdit ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-foreground inline-flex items-center gap-1.5">
                            <span className={`inline-block h-3 w-1 rounded-sm ${canEdit ? "bg-primary" : "bg-muted-foreground/60"}`} />
                            企业自评
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">{canEdit ? "满分" : "自评分"}</span>
                            {!canEdit && (
                              <>
                                <span className="font-mono font-semibold text-foreground tabular-nums">{it.selfScore}</span>
                                <span className="text-muted-foreground">/</span>
                              </>
                            )}
                            <span className={`font-mono ${canEdit ? "text-foreground/70" : "text-muted-foreground"} tabular-nums`}>{it.itemScore}</span>
                          </div>
                        </div>

                        {canEdit ? (
                          <>
                            <div>
                              <label className="text-[11px] text-muted-foreground mb-1 block">自评分</label>
                              <Input
                                type="number"
                                value={it.selfScore}
                                min={0}
                                max={it.itemScore}
                                step="0.5"
                                onChange={(e) => updateSelf(it.__idx, { selfScore: Number(e.target.value) })}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).blur(); } }}
                                className="h-8 text-sm font-mono bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-muted-foreground mb-1 block">评分依据</label>
                              <Textarea
                                value={it.selfBasis}
                                onChange={(e) => updateSelf(it.__idx, { selfBasis: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    (e.target as HTMLTextAreaElement).blur();
                                  }
                                }}
                                placeholder="请输入自评依据，回车确认（Shift+Enter 换行）"
                                className="text-xs resize-none bg-white"
                                rows={3}
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] text-muted-foreground">证明材料</label>
                                <button
                                  onClick={() => triggerProofUpload(it.__idx)}
                                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                                >
                                  <Plus className="h-3 w-3" />添加附件
                                </button>
                              </div>
                              {it.proofs.length ? (
                                <div className="flex flex-col gap-1.5">
                                  {it.proofs.map((p, k) => (
                                    <div
                                      key={k}
                                      className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-border bg-background text-xs"
                                      title={p.name}
                                    >
                                      <FileCheck2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                                      <span className="flex-1 truncate text-foreground/80">{p.name}</span>
                                      <button
                                        onClick={() => removeProof(it.__idx, k)}
                                        className="text-muted-foreground hover:text-destructive"
                                        title="删除"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <button
                                  onClick={() => triggerProofUpload(it.__idx)}
                                  className="w-full flex items-center justify-center gap-1.5 px-2 py-3 rounded border border-dashed border-border bg-background hover:border-primary/40 hover:bg-primary/5 text-xs text-muted-foreground"
                                >
                                  <Upload className="h-3.5 w-3.5" />点击上传证明材料
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="text-[11px] text-muted-foreground mb-1">评分依据</div>
                              <div className="text-xs text-foreground/80 leading-relaxed min-h-[44px] rounded bg-muted/30 px-2 py-1.5">
                                {it.selfBasis || <span className="text-muted-foreground">—</span>}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-muted-foreground mb-1">证明材料</div>
                              {it.proofs.length ? (
                                <div className="flex flex-col gap-1.5">
                                  {it.proofs.map((p, k) => (
                                    <button
                                      key={k}
                                      onClick={() => toast.success(`正在下载 ${p.name}`)}
                                      className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-left text-xs"
                                      title={p.name}
                                    >
                                      <FileCheck2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                                      <span className="flex-1 truncate text-foreground/80">{p.name}</span>
                                      <Download className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground px-2 py-1.5">未提供证明材料</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* 政府考评（始终只读） */}
                      <div className="rounded-md border border-warning/30 bg-warning/5 p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-foreground inline-flex items-center gap-1.5">
                            <span className="inline-block h-3 w-1 rounded-sm bg-warning" />
                            政府考评
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">满分</span>
                            <span className="font-mono text-foreground/70 tabular-nums">{it.itemScore}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-1">考评分</div>
                          <div className="text-sm font-mono font-semibold text-foreground">
                            {it.reviewScore}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-1">评分依据</div>
                          <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {it.reviewBasis || <span className="text-muted-foreground">—</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
