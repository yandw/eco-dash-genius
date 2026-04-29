import { PortalLayout } from "@/components/portal/PortalLayout";
import { AchievementShowcase } from "@/components/portal/AchievementShowcase";
import { ExhibitionBases } from "@/components/portal/ExhibitionBases";

export default function PortalScenarios() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="bg-gradient-to-br from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-white">
          <h1 className="text-4xl font-bold mb-3">绿色科技创新成果展示</h1>
          <p className="text-white/90">
            汇聚绿色科技创新前沿成果，推动技术成果产业化落地
          </p>
        </div>
      </section>
      <AchievementShowcase />
      <ExhibitionBases />
    </PortalLayout>
  );
}
