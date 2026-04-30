import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  MessageSquareWarning,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArchiveStatusBadge } from "@/components/archives/ArchiveStatusBadge";
import { ArchiveStepNav } from "@/components/archives/ArchiveStepNav";
import { ArchiveTimeline } from "@/components/archives/ArchiveTimeline";
import { ArchiveStepContent } from "@/components/archives/ArchiveStepContent";
import {
  enterprises,
  StepKey,
  FieldAnnotationItem,
} from "@/mocks/archives";
import { toast } from "sonner";

export default function GovArchiveDetail() {
  const { entId, year: yearParam } = useParams();
  const navigate = useNavigate();
  const year = Number(yearParam);
  const ent = enterprises.find((e) => e.id === entId);
  const yr = ent?.years.find((y) => y.year === year);

  const [active, setActive] = useState<StepKey>("basic");
  const [annotations, setAnnotations] = useState<FieldAnnotationItem[]>(
    yr?.annotations ?? [],
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const annotationsByStep = useMemo(() => {
    const map: Partial<Record<StepKey, number>> = {};
    annotations.forEach((a) => {
      map[a.step] = (map[a.step] ?? 0) + 1;
    });
    return map;
  }, [annotations]);

  if (!ent || !yr) {
    return (
      <AppLayout side="gov" title="档案不存在">
        <Button onClick={() => navigate("/gov/archives")} variant="outline">
          返回审核台账
        </Button>
      </AppLayout>
    );
  }

  const handleApprove = () => {
    toast.success(`${ent.name} ${year} 档案已通过审核`);
    setTimeout(() => navigate("/gov/archives"), 600);
  };
  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("请填写退回意见");
      return;
    }
    toast.warning(`${ent.name} ${year} 档案已退回，企业将收到整改通知`);
    setRejectOpen(false);
    setTimeout(() => navigate("/gov/archives"), 600);
  };

  const annsForCurrent = annotations.filter((a) => a.step === active);

  return (
    <AppLayout
      side="gov"
      title={`审核 · ${year} 节能档案`}
      subtitle={`${ent.name} · 统一社会信用代码 ${ent.creditCode}`}
    >
      <div className="panel p-5 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/gov/archives">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> 返回审核台账
            </Link>
          </Button>
          <ArchiveStatusBadge status={yr.status} />
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            上报时间：<span className="font-mono">{yr.updatedAt}</span>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setRejectOpen(true)}
            >
              <XCircle className="h-3.5 w-3.5 mr-1" /> 退回整改
            </Button>
            <Button
              size="sm"
              className="h-9 bg-gradient-primary text-primary-foreground border-0"
              onClick={handleApprove}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> 审核通过
            </Button>
          </div>
        </div>

        <ArchiveTimeline items={yr.timeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <aside className="panel p-3 h-fit lg:sticky lg:top-20">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-2">
            审核项
          </div>
          <ArchiveStepNav
            active={active}
            onChange={setActive}
            completed={yr.detail.completed}
            annotationsByStep={annotationsByStep}
          />
          <div className="mt-3 px-2 pb-2 text-[11px] text-muted-foreground leading-relaxed">
            提示：发现问题时点击下方「标注问题」对字段添加批注，提交退回时一并发送给企业。
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const next: FieldAnnotationItem = {
                step: active,
                field: prompt("请输入字段名（示例：年能源消费量）") || "未命名字段",
                comment: prompt("请输入批注内容") || "",
                by: "中心管理员",
                at: new Date().toLocaleString("zh-CN"),
              };
              if (next.comment) {
                setAnnotations((a) => [...a, next]);
                toast.success("批注已添加");
              }
            }}
          >
            <MessageSquareWarning className="h-3.5 w-3.5 mr-1" /> 标注问题
          </Button>
        </aside>
        <div className="panel p-6 min-w-0">
          <ArchiveStepContent
            step={active}
            detail={yr.detail}
            annotations={annsForCurrent}
            readOnly
          />
        </div>
      </div>

      {/* 退回弹窗 */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-destructive" />
              退回整改 · {ent.name} · {year}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {annotations.length > 0 && (
              <div className="rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning">
                已自动附加 {annotations.length} 条字段标注
              </div>
            )}
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">
                <span className="text-destructive">*</span> 退回意见（企业将收到完整内容）
              </div>
              <Textarea
                rows={5}
                placeholder="请描述需要整改的事项..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" /> 确认退回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
