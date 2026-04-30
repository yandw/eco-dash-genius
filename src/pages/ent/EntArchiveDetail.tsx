import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Undo2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArchiveStatusBadge } from "@/components/archives/ArchiveStatusBadge";
import { ArchiveStepNav } from "@/components/archives/ArchiveStepNav";
import { ArchiveTimeline } from "@/components/archives/ArchiveTimeline";
import { ArchiveStepContent } from "@/components/archives/ArchiveStepContent";
import {
  enterprises,
  CURRENT_ENT_ID,
  ARCHIVE_STEPS,
  StepKey,
  ArchiveStatus,
  AuditTimelineItem,
} from "@/mocks/archives";
import { toast } from "sonner";

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EntArchiveDetail() {
  const { year: yearParam } = useParams();
  const navigate = useNavigate();
  const year = Number(yearParam);
  const ent = enterprises.find((e) => e.id === CURRENT_ENT_ID)!;
  const yr = ent.years.find((y) => y.year === year);

  const [active, setActive] = useState<StepKey>("basic");
  const [localStatus, setLocalStatus] = useState<ArchiveStatus | undefined>(yr?.status);
  const [extraTimeline, setExtraTimeline] = useState<AuditTimelineItem[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);

  const annotationsByStep = useMemo(() => {
    const map: Partial<Record<StepKey, number>> = {};
    yr?.annotations.forEach((a) => {
      map[a.step] = (map[a.step] ?? 0) + 1;
    });
    return map;
  }, [yr]);

  if (!yr || !localStatus) {
    return (
      <AppLayout side="ent" title="档案不存在">
        <Button onClick={() => navigate("/ent/archives")} variant="outline">
          返回列表
        </Button>
      </AppLayout>
    );
  }

  const annotationsForStep = yr.annotations.filter((a) => a.step === active);
  const timelineItems: AuditTimelineItem[] = [...yr.timeline, ...extraTimeline];

  const completedCount = Object.values(yr.detail.completed).filter(Boolean).length;
  const totalSteps = ARCHIVE_STEPS.length;
  const incompleteSteps = ARCHIVE_STEPS.filter((s) => !yr.detail.completed[s.key]);

  const readOnly = localStatus === "approved" || localStatus === "submitted";

  const appendTimeline = (item: AuditTimelineItem) => {
    setExtraTimeline((prev) => [...prev, item]);
  };

  const handleSaveDraft = () => {
    toast.success("草稿已保存");
    if (localStatus === "pending") {
      setLocalStatus("draft");
    }
    appendTimeline({
      time: nowStamp(),
      actor: `${ent.name} · 当前用户`,
      action: "保存草稿",
      type: "info",
    });
  };

  const handleConfirmSubmit = () => {
    setSubmitOpen(false);
    const t = toast.loading("正在提交...");
    setTimeout(() => {
      toast.success("已提交至中心审核，等待经信委审核", { id: t });
      setLocalStatus("submitted");
      appendTimeline({
        time: nowStamp(),
        actor: `${ent.name} · 当前用户`,
        action: "提交审核",
        type: "info",
      });
    }, 600);
  };

  const handleWithdraw = () => {
    toast.warning("已撤回，可继续编辑");
    setLocalStatus("draft");
    appendTimeline({
      time: nowStamp(),
      actor: `${ent.name} · 当前用户`,
      action: "撤回提交",
      type: "warn",
    });
  };

  return (
    <AppLayout
      side="ent"
      title={`${year} 节能档案`}
      subtitle={`${ent.name} · 按下方步骤逐项填报后提交至经信委审核`}
    >
      {/* 顶部状态条 */}
      <div className="panel p-5 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/ent/archives">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> 返回档案列表
            </Link>
          </Button>
          <ArchiveStatusBadge status={localStatus} />
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            最近保存：
            <span className="font-mono">
              {extraTimeline.length > 0
                ? extraTimeline[extraTimeline.length - 1].time
                : yr.updatedAt || "—"}
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            {localStatus !== "approved" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={handleSaveDraft}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> 保存草稿
                </Button>
                {localStatus === "submitted" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-warning border-warning/40 hover:bg-warning/10 hover:text-warning"
                    onClick={handleWithdraw}
                  >
                    <Undo2 className="h-3.5 w-3.5 mr-1" /> 撤回提交
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-9 bg-gradient-primary text-primary-foreground border-0"
                    onClick={() => setSubmitOpen(true)}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" /> 提交审核
                  </Button>
                )}
              </>
            )}
            {localStatus === "approved" && (
              <span className="inline-flex items-center gap-1 text-success text-sm">
                <CheckCircle2 className="h-4 w-4" /> 审核已通过
              </span>
            )}
          </div>
        </div>

        {/* 时间轴 */}
        <ArchiveTimeline items={timelineItems} />
      </div>

      {/* 步骤导航 + 内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <aside className="panel p-3 h-fit lg:sticky lg:top-20">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-2">
            填报步骤
          </div>
          <ArchiveStepNav
            active={active}
            onChange={setActive}
            completed={yr.detail.completed}
            annotationsByStep={annotationsByStep}
          />
        </aside>
        <div className="panel p-6 min-w-0">
          <ArchiveStepContent
            step={active}
            detail={yr.detail}
            annotations={annotationsForStep}
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* 提交审核确认弹窗 */}
      <AlertDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认提交本年度档案？</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <div className="text-muted-foreground">
                  当前填报完成度：
                  <span className="font-mono text-foreground font-medium">
                    {completedCount}/{totalSteps}
                  </span>
                </div>
                {incompleteSteps.length > 0 && (
                  <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-warning">
                    <div className="flex items-center gap-1.5 font-medium mb-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      以下步骤尚未完成：
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-[12px]">
                      {incompleteSteps.map((s) => (
                        <li key={s.key}>{s.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-muted-foreground leading-relaxed">
                  提交后档案将进入经信委审核流程，期间不可直接编辑，可在审核完成前点击「撤回提交」修改。
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              className="bg-gradient-primary text-primary-foreground border-0"
            >
              <Send className="h-3.5 w-3.5 mr-1" /> 确认提交
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
