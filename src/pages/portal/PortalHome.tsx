import { PortalLayout } from "@/components/portal/PortalLayout";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { StatsBar } from "@/components/portal/StatsBar";
import { AgentGrid } from "@/components/portal/AgentGrid";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import { ScenarioTabs } from "@/components/portal/ScenarioTabs";
import { BusinessFunctions } from "@/components/portal/BusinessFunctions";
import { NewsCarousel } from "@/components/portal/NewsCarousel";

export default function PortalHome() {
  return (
    <PortalLayout headerVariant="transparent">
      <HeroBanner />
      <StatsBar />
      <AgentGrid />
      <GreenMfgGrid />
      <ScenarioTabs />
      <BusinessFunctions />
      <NewsCarousel />
    </PortalLayout>
  );
}
