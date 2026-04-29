import { PortalLayout } from "@/components/portal/PortalLayout";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { StatsBar } from "@/components/portal/StatsBar";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import { AchievementShowcase } from "@/components/portal/AchievementShowcase";
import { BusinessFunctions } from "@/components/portal/BusinessFunctions";
import { NewsCarousel } from "@/components/portal/NewsCarousel";

export default function PortalHome() {
  return (
    <PortalLayout headerVariant="transparent">
      <HeroBanner />
      <StatsBar />
      <GreenMfgGrid />
      <AchievementShowcase />
      <BusinessFunctions />
      <NewsCarousel />
    </PortalLayout>
  );
}
