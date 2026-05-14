import { AppLayout } from "@/components/AppLayout";
import { DualCalcForm } from "@/components/assess/trend/DualCalcForm";
import { isCityAdmin } from "@/mocks/currentUser";
import { Gauge } from "lucide-react";

export default function AssessDualCalc() {
  const cityAdmin = isCityAdmin();
  return (
    <AppLayout title="碳双控测算" subtitle="考核管理 / 碳双控测算">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">碳双控测算</h1>
            <p className="text-sm text-muted-foreground">
              依据企业所属行业，按化石燃料燃烧 / 净购入电力与热力进行碳排放测算
            </p>
          </div>
        </div>
        <DualCalcForm withIndustryTabs={cityAdmin} />
      </div>
    </AppLayout>
  );
}
