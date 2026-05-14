import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncrementPanel } from "@/components/assess/trend/IncrementPanel";
import { IntensityPanel } from "@/components/assess/trend/IntensityPanel";
import { DualCalcForm } from "@/components/assess/trend/DualCalcForm";
import { isCityAdmin } from "@/mocks/currentUser";
import { Navigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export default function AssessTrend() {
  if (!isCityAdmin()) return <Navigate to="/gov/assess/goal" replace />;

  return (
    <AppLayout title="碳排测算" subtitle={"考核管理 / 碳排测算"}>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">碳排测算</h1>
            <p className="text-sm text-muted-foreground">
              "十五五"能耗与碳排放增量、强度多情景测算，输入预设值即时计算并可视化
            </p>
          </div>
        </div>

        <Tabs defaultValue="energy-inc">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="energy-inc">能耗增量测算</TabsTrigger>
            <TabsTrigger value="energy-int">能耗强度测算</TabsTrigger>
            <TabsTrigger value="carbon-inc">碳排放增量测算</TabsTrigger>
            <TabsTrigger value="carbon-int">碳排放强度测算</TabsTrigger>
            <TabsTrigger value="dual-calc">碳双控测算</TabsTrigger>
          </TabsList>

          <TabsContent value="energy-inc" className="mt-4">
            <IncrementPanel kind="energy" />
          </TabsContent>
          <TabsContent value="energy-int" className="mt-4">
            <IntensityPanel kind="energy" />
          </TabsContent>
          <TabsContent value="carbon-inc" className="mt-4">
            <IncrementPanel kind="carbon" />
          </TabsContent>
          <TabsContent value="carbon-int" className="mt-4">
            <IntensityPanel kind="carbon" />
          </TabsContent>
          <TabsContent value="dual-calc" className="mt-4">
            <DualCalcForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
