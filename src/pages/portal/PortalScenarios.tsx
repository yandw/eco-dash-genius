import { PortalLayout } from "@/components/portal/PortalLayout";
import { ScenarioTabs } from "@/components/portal/ScenarioTabs";

export default function PortalScenarios() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="bg-gradient-to-br from-[hsl(160_55%_28%)] to-[hsl(150_60%_40%)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-white">
          <h1 className="text-4xl font-bold mb-3">场景招商</h1>
          <p className="text-white/90">面向重点行业的能碳数智化应用场景招商</p>
        </div>
      </section>
      <ScenarioTabs />
    </PortalLayout>
  );
}
