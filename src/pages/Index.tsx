import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MonitoringTabs } from "@/components/MonitoringTabs";
import { TopKpiBar } from "@/components/dashboard/overview/TopKpiBar";
import { DecadeGlance } from "@/components/dashboard/overview/DecadeGlance";
import { DualControlTrack } from "@/components/dashboard/overview/DualControlTrack";
import { ShanghaiMap, type District } from "@/components/dashboard/overview/ShanghaiMap";
import { IdcMonitor } from "@/components/dashboard/overview/IdcMonitor";
import { CarbonAccountFunnel } from "@/components/dashboard/overview/CarbonAccountFunnel";
import { DistrictPortraitDialog } from "@/components/dashboard/overview/DistrictPortraitDialog";

const Index = () => {
  const [openDistrict, setOpenDistrict] = useState<District | null>(null);

  return (
    <AppLayout side="gov" title="全景监测" subtitle="上海市工业和通信业重点用能单位能耗和碳排放管理平台">
      <MonitoringTabs />

      {/* 三栏主体：左 / 中(上 KPI + 下地图) / 右 */}
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-220px)]">
        {/* 左列 */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 min-h-[520px]">
            <DecadeGlance />
          </div>
          <div className="h-[260px]">
            <DualControlTrack />
          </div>
        </div>

        {/* 中列 */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <TopKpiBar />
          <div className="flex-1">
            <ShanghaiMap onDistrictClick={(d) => setOpenDistrict(d)} />
          </div>
        </div>

        {/* 右列 */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="flex-[1.2] min-h-[460px]">
            <IdcMonitor />
          </div>
          <div className="flex-1 min-h-[320px]">
            <CarbonAccountFunnel />
          </div>
        </div>
      </div>

      <DistrictPortraitDialog
        open={!!openDistrict}
        onOpenChange={(v) => !v && setOpenDistrict(null)}
        districtName={openDistrict?.name ?? ""}
      />
    </AppLayout>
  );
};

export default Index;
