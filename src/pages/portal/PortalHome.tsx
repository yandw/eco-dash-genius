import { PortalLayout } from "@/components/portal/PortalLayout";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { StatsBar } from "@/components/portal/StatsBar";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import { ScenarioTabs } from "@/components/portal/ScenarioTabs";
import { BusinessFunctions } from "@/components/portal/BusinessFunctions";
import { NewsCarousel } from "@/components/portal/NewsCarousel";

export default function PortalHome() {
  return (
    <PortalLayout headerVariant="transparent">
      <HeroBanner />
      <StatsBar />
      <GreenMfgGrid />
      <ScenarioTabs />
      <BusinessFunctions />
      <NewsCarousel />
    </PortalLayout>
  );
}
