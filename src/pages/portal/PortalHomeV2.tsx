import { PortalLayout } from "@/components/portal/PortalLayout";
import { HeroBannerV2 } from "@/components/portal/HeroBannerV2";
import { PortalTabsV2 } from "@/components/portal/PortalTabsV2";
import { NewsCarousel } from "@/components/portal/NewsCarousel";
import { BusinessFunctions } from "@/components/portal/BusinessFunctions";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import { ScenarioTabs } from "@/components/portal/ScenarioTabs";

export default function PortalHomeV2() {
  return (
    <PortalLayout headerVariant="transparent">
      {/* V2 自带顶部口号与登录入口，隐藏 PortalHeader 的视觉冲突 */}
      <style>{`.portal-theme > header { display: none; }`}</style>

      <HeroBannerV2 />
      <PortalTabsV2 />

      <NewsCarousel />

      <BusinessFunctions />

      <div id="green-mfg" className="scroll-mt-20">
        <GreenMfgGrid />
      </div>

      <div id="scenario" className="scroll-mt-20">
        <ScenarioTabs />
      </div>
    </PortalLayout>
  );
}
