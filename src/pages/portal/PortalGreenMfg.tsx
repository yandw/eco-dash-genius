import { PortalLayout } from "@/components/portal/PortalLayout";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";

export default function PortalGreenMfg() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="bg-gradient-to-br from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-white">
          <h1 className="text-4xl font-bold mb-2">绿色制造</h1>
          <p className="text-white/90">推动制造业全链条绿色低碳转型升级</p>
        </div>
      </section>
      <GreenMfgGrid />
    </PortalLayout>
  );
}
