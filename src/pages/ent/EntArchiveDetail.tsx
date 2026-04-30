import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Undo2,
  AlertOctagon,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ArchiveStatusBadge } from "@/components/archives/ArchiveStatusBadge";
import { ArchiveStepNav } from "@/components/archives/ArchiveStepNav";
import { ArchiveTimeline } from "@/components/archives/ArchiveTimeline";
import { ArchiveStepContent } from "@/components/archives/ArchiveStepContent";
import {
  enterprises,
  CURRENT_ENT_ID,
  ARCHIVE_STEPS,
  StepKey,
} from "@/mocks/archives";
import { toast } from "sonner";

export default function EntArchiveDetail() {
  const { year: yearParam } = useParams();
  const navigate = useNavigate();
  const year = Number(yearParam);
  const ent = enterprises.find((e) => e.id === CURRENT_ENT_ID)!;
  const yr = ent.years.find((y) => y.year === year);

  const [active, setActive] = useState<StepKey>("basic");

  const annotationsByStep = useMemo(() => {
    const map: Partial<Record<StepKey, number>> = {};
    yr?.annotations.forEach((a) => {
      map[a.step] = (map[a.step] ?? 0) + 1;
    });
    return map;
  }, [yr]);

  if (!yr) {
    return (
      <AppLayout side="ent" title="档案不存在">
        <Button onClick={() => navigate("/ent/archives")} variant="outline">
          返回列表
        </Button>
      </AppLayout>
    );
  }

  const annotationsForStep = yr.annotations.filter((a) => a.step === active);

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
          <ArchiveStatusBadge status={yr.status} />
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            最近保存：<span className="font-mono">{yr.updatedAt || "—"}</span>
          </div>
          <div className="ml-auto flex gap-2">
            {yr.status !== "approved" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => toast.success("草稿已保存")}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> 保存草稿
                </Button>
                {yr.status === "submitted" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-warning border-warning/40 hover:bg-warning/10 hover:text-warning"
                    onClick={() => toast.warning("已撤回，可继续编辑")}
                  >
                    <Undo2 className="h-3.5 w-3.5 mr-1" /> 撤回提交
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-9 bg-gradient-primary text-primary-foreground border-0"
                    onClick={() => toast.success("已提交至中心审核")}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" /> 提交审核
                  </Button>
                )}
              </>
            )}
            {yr.status === "approved" && (
              <span className="inline-flex items-center gap-1 text-success text-sm">
                <CheckCircle2 className="h-4 w-4" /> 审核已通过
              </span>
            )}
          </div>
        </div>

        {/* 退回提示已按需求移除 */}

        {/* 时间轴 */}
        <ArchiveTimeline items={yr.timeline} />
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
            readOnly={yr.status === "approved" || yr.status === "submitted"}
          />
        </div>
      </div>
    </AppLayout>
  );
}
