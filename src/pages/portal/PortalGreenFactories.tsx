import { PortalLayout } from "@/components/portal/PortalLayout";
import { GreenFactoriesShowcase } from "@/components/portal/GreenFactoriesShowcase";

export default function PortalGreenFactories() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="bg-gradient-to-br from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-white">
          <h1 className="text-4xl font-bold mb-3">绿色工厂示范单位</h1>
          <p className="text-white/90">展示获评绿色工厂的标杆企业及其核心绿色实践</p>
        </div>
      </section>
      <GreenFactoriesShowcase />
    </PortalLayout>
  );
}
