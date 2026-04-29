import { PortalLayout } from "@/components/portal/PortalLayout";
import { GreenMfgGrid } from "@/components/portal/GreenMfgGrid";
import logo from "@/assets/portal/logo.png";

export default function PortalGreenMfg() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="bg-gradient-to-br from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-white flex items-center gap-5">
          <img
            src={logo}
            alt="平台 Logo"
            className="h-14 w-14 object-contain drop-shadow"
          />
          <div>
            <div className="text-xs md:text-sm tracking-[0.2em] text-white/80 mb-2">
              上海市工业和通信业能碳数智空间
            </div>
            <h1 className="text-4xl font-bold mb-2">绿色制造</h1>
            <p className="text-white/90">推动制造业全链条绿色低碳转型升级</p>
          </div>
        </div>
      </section>
      <GreenMfgGrid />
    </PortalLayout>
  );
}
