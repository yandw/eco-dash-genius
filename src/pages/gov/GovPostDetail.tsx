import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Briefcase, Leaf, FileCheck } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostStatusBadge } from "@/components/posts/PostStatusBadge";
import { PostBasicTab } from "@/components/posts/PostBasicTab";
import { PostFilingTab } from "@/components/posts/PostFilingTab";
import { getEnterpriseById, enterpriseList } from "@/mocks/posts";

export default function GovPostDetail() {
  const { entId = "ENT-001" } = useParams();
  const navigate = useNavigate();
  const ent = getEnterpriseById(entId);
  const meta = enterpriseList.find((e) => e.id === entId);


  return (
    <AppLayout
      side="gov"
      title="企业岗位备案详情"
      subtitle="只读查阅，企业填写后实时同步至此"
    >
      {/* 返回 + 顶部信息 */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/gov/posts")} className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> 返回列表
        </Button>
      </div>

      <div className="panel-glow p-5 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 min-w-[300px]">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">{ent.basic.name}</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {ent.basic.creditCode} · {ent.basic.industry} · {meta?.county}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">能源岗位</span>
              <PostStatusBadge status={meta?.energyStatus ?? "empty"} />
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">碳排岗位</span>
              <PostStatusBadge status={meta?.carbonStatus ?? "empty"} />
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={() => handleDownload()}>
              <FileText className="h-3.5 w-3.5 mr-1" /> 导出 PDF
            </Button>
            <Button size="sm" className="h-8 bg-gradient-primary text-primary-foreground border-0" onClick={() => handleDownload("-名册")}>
              <Download className="h-3.5 w-3.5 mr-1" /> 导出名册
            </Button>
          </div>
        </div>
      </div>

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
            <PostBasicTab data={ent.basic} readOnly />
          </TabsContent>
          <TabsContent value="energy" className="mt-5">
            <PostFilingTab data={ent.energy} type="energy" readOnly enterpriseName={ent.basic.name} />
          </TabsContent>
          <TabsContent value="carbon" className="mt-5">
            <PostFilingTab data={ent.carbon} type="carbon" readOnly enterpriseName={ent.basic.name} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
