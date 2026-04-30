import { Building2, Briefcase, Leaf, FileCheck, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PostStatusBadge } from "@/components/posts/PostStatusBadge";
import { PostBasicTab } from "@/components/posts/PostBasicTab";
import { PostFilingTab } from "@/components/posts/PostFilingTab";
import { currentEnterprise, type FilingStatus, type PostFiling } from "@/mocks/posts";

function calcStatus(f: PostFiling): FilingStatus {
  const hasLeader = !!f.leader.name;
  const hasOwner = !!f.owner.name;
  const hasFiles = f.files.length > 0;
  const hasStaff = f.staff.length > 0;
  const score = [hasLeader, hasOwner, hasFiles, hasStaff].filter(Boolean).length;
  if (score === 4) return "complete";
  if (score === 0) return "empty";
  return "partial";
}

export default function EntPosts() {
  const ent = currentEnterprise;
  const energyStatus = calcStatus(ent.energy);
  const carbonStatus = calcStatus(ent.carbon);

  // 总体完成度
  const totalScore = (() => {
    const score = (s: FilingStatus) => (s === "complete" ? 100 : s === "partial" ? 50 : 0);
    return Math.round((100 + score(energyStatus) + score(carbonStatus)) / 3);
  })();

  return (
    <AppLayout
      side="ent"
      title="岗位备案"
      subtitle="维护能源与碳排放管理岗位的领导、负责人、人员名册与备案材料"
    >
      {/* 顶部摘要 */}
      <div className="panel-glow p-5 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 min-w-[280px]">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">{ent.basic.name}</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {ent.basic.creditCode} · {ent.basic.industry}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">基本信息</span>
              <PostStatusBadge status="complete" />
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">能源岗位</span>
              <PostStatusBadge status={energyStatus} />
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">碳排岗位</span>
              <PostStatusBadge status={carbonStatus} />
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">总体备案完成度</span>
          <Progress value={totalScore} className="h-2 flex-1 max-w-md" />
          <span className="text-sm font-mono font-semibold text-primary">{totalScore}%</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-success">
            <Sparkles className="h-3 w-3" /> 已自动保存草稿
          </span>
        </div>
      </div>

      {/* 三个 Tab */}
      <div className="panel p-5">
        <Tabs defaultValue="basic" className="space-y-5">
          <TabsList className="bg-muted/40">
            <TabsTrigger value="basic" className="data-[state=active]:bg-card data-[state=active]:text-primary">
              <FileCheck className="h-3.5 w-3.5 mr-1.5" /> 基本信息
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-card data-[state=active]:text-primary">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" /> 能源管理岗位备案
            </TabsTrigger>
            <TabsTrigger value="carbon" className="data-[state=active]:bg-card data-[state=active]:text-primary">
              <Leaf className="h-3.5 w-3.5 mr-1.5" /> 碳排放管理岗位备案
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-5">
            <PostBasicTab data={ent.basic} />
          </TabsContent>
          <TabsContent value="energy" className="mt-5">
            <PostFilingTab data={ent.energy} type="energy" enterpriseName={ent.basic.name} />
          </TabsContent>
          <TabsContent value="carbon" className="mt-5">
            <PostFilingTab data={ent.carbon} type="carbon" enterpriseName={ent.basic.name} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
