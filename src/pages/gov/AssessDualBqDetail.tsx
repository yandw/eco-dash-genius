import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Upload, Undo2, Save, FileText, FileCheck2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PassBadge } from "@/components/assess/PassBadge";
import { bqAssessDetail, type BqAssessDetailRow } from "@/mocks/assess";
import { useBqAssessStore, getBqEnt, setBqReport, rollbackBqEnt } from "@/mocks/bqAssessStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Group {
  name: string;
  groupScore: number;
  items: Array<BqAssessDetailRow & { __idx: number }>;
}

export default function AssessDualBqDetail() {
  const { entId } = useParams<{ entId: string }>();
  const navigate = useNavigate();
  useBqAssessStore();
  const row = entId ? getBqEnt(entId) : undefined;
  const reportInput = useRef<HTMLInputElement>(null);

  const [detail, setDetail] = useState<BqAssessDetailRow[]>(() => bqAssessDetail.map((d) => ({ ...d })));
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    setDetail(bqAssessDetail.map((d) => ({ ...d })));
  }, [entId]);

  // 按 groupName 分组
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

  if (!row) {
    return (
      <AppLayout side="gov" title="双控考核" subtitle="">
        <div className="p-8 text-center text-muted-foreground">未找到企业数据</div>
      </AppLayout>
    );
  }

  const updateReview = (i: number, patch: Partial<BqAssessDetailRow>) => {
    setDetail((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && entId) {
      const url = URL.createObjectURL(f);
      setBqReport(entId, { name: f.name, url, uploadedAt: new Date().toISOString().slice(0, 10) });
      toast.success(`已上传考评报告：${f.name}`);
    }
    e.target.value = "";
  };

  const groupReviewSum = (g: Group) => g.items.reduce((s, x) => s + x.reviewScore, 0);
  const groupSelfSum = (g: Group) => g.items.reduce((s, x) => s + x.selfScore, 0);

  return (
    <AppLayout side="gov" title="双控考核" subtitle={`${row.entName} · ${row.year}年节能目标考核评分`}>
      <input ref={reportInput} type="file" className="hidden" accept=".pdf,.zip,.doc,.docx" onChange={handleReportUpload} />

      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <button className="hover:text-primary" onClick={() => navigate("/gov/assess/dual")}>双控考核</button>
        <span>/</span>
        <button className="hover:text-primary" onClick={() => navigate("/gov/assess/dual")}>"百家""千家"通信业企业能耗考核</button>
        <span>/</span>
        <span className="text-foreground/80">{row.entName}</span>
      </div>

      {/* 顶部工具栏 */}
      <div className="panel p-3 mb-4 flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" className="h-9" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />返回
        </Button>
        <h2 className="text-base font-semibold text-foreground mr-2">企业节能"双控"责任评价考核</h2>
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-background text-xs">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate text-foreground/80">企业自评相关附件（更新版）.zip</span>
          </div>
          <Button size="sm" className="h-9 bg-primary text-primary-foreground" onClick={() => toast.success("正在下载企业自评相关附件.zip")}>
            下载附件
          </Button>
        </div>
        <Button size="sm" variant="outline" className="h-9" onClick={() => toast.success("已导出")}>导出</Button>
        {row.reportFile ? (
          <Button
            size="sm"
            variant="outline"
            className="h-9 text-success border-success/40 hover:text-success"
            onClick={() => {
              const a = document.createElement("a");
              a.href = row.reportFile!.url;
              a.download = row.reportFile!.name;
              document.body.appendChild(a); a.click(); a.remove();
              toast.success(`正在下载 ${row.reportFile!.name}`);
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" />下载考评报告
          </Button>
        ) : null}
        <Button size="sm" className="h-9 bg-success text-success-foreground hover:bg-success/90" onClick={() => reportInput.current?.click()}>
          <Upload className="h-3.5 w-3.5 mr-1" />{row.reportFile ? "重新上传" : "上传考评报告"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 text-destructive border-destructive/40 hover:text-destructive"
          onClick={() => {
            if (entId) {
              rollbackBqEnt(entId);
              toast.success("已退回重填");
              navigate("/gov/assess/dual");
            }
          }}
        >
          <Undo2 className="h-3.5 w-3.5 mr-1" />退回重填
        </Button>
        <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("已保存考评分")}>
          <Save className="h-3.5 w-3.5 mr-1" />保存
        </Button>
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

        {/* 分类切换 */}
        {groups.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
              <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
              {groups.map((g, gi) => (
                <TabsTrigger key={gi} value={String(gi)} className="text-xs">
                  {gi + 1}. {g.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* 三大分组卡片 */}
        {groups.map((g, gi) => {
          if (activeTab !== "all" && activeTab !== String(gi)) return null;
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
                    {/* 评分项标题 */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{it.no}</Badge>
                        <span className="text-xs text-muted-foreground">单项分值</span>
                        <span className="text-sm font-semibold text-foreground">{it.itemScore} 分</span>
                      </div>
                    </div>

                    {/* 评分标准 */}
                    <div className="rounded-md bg-muted/40 border border-border px-3 py-2 text-xs leading-relaxed text-foreground/80">
                      <span className="font-medium text-muted-foreground mr-1">评分标准：</span>{it.criterion}
                    </div>

                    {/* 自评 + 考评 双栏 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* 企业自评 */}
                      <div className="rounded-md border border-border bg-background p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-foreground inline-flex items-center gap-1.5">
                            <span className="inline-block h-3 w-1 rounded-sm bg-muted-foreground/60" />
                            企业自评
                          </div>
                          <div className="inline-flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">自评分</span>
                            <span className="font-mono font-semibold text-foreground tabular-nums">{it.selfScore}</span>
                            <span className="text-muted-foreground">/ {it.itemScore}</span>
                          </div>
                        </div>
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
                      </div>

                      {/* 政府考评 */}
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
                          <label className="text-[11px] text-muted-foreground mb-1 block">考评分</label>
                          <Input
                            type="number"
                            value={it.reviewScore}
                            max={it.itemScore}
                            min={0}
                            step="0.5"
                            onChange={(e) => updateReview(it.__idx, { reviewScore: Number(e.target.value) })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).blur(); }
                            }}
                            className="h-8 text-sm font-mono bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground mb-1 block">评分依据</label>
                          <Textarea
                            value={it.reviewBasis}
                            onChange={(e) => updateReview(it.__idx, { reviewBasis: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                (e.target as HTMLTextAreaElement).blur();
                              }
                            }}
                            placeholder="请输入考评依据，回车确认（Shift+Enter 换行）"
                            className="text-xs resize-none"
                            rows={3}
                          />
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
    </AppLayout>
  );
}
