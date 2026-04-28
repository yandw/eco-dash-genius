import { PortalLayout } from "@/components/portal/PortalLayout";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { StatsBar } from "@/components/portal/StatsBar";
import { NewsCarousel } from "@/components/portal/NewsCarousel";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import { ScenarioTabs } from "@/components/portal/ScenarioTabs";
import { BusinessFunctions } from "@/components/portal/BusinessFunctions";

export default function PortalHomeV2() {
  return (
    <PortalLayout headerVariant="transparent">
      <HeroBanner version="v2" />
      <StatsBar />
      <NewsCarousel />
      <GreenMfgGrid />
      <ScenarioTabs />
      <BusinessFunctions />
    </PortalLayout>
  );
}
