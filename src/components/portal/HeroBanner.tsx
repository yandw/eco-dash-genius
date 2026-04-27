import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/portal/hero-shanghai.jpg";

export function HeroBanner() {
  return (
    <section className="relative h-[480px] overflow-hidden">
      <img
        src={heroBg}
        alt="上海城市天际线"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={900}
      />
      <div className="absolute inset-0 portal-hero-overlay" />

      <div className="relative z-10 max-w-[1400px] mx-auto h-full flex flex-col justify-center px-10 pt-14">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide leading-tight drop-shadow-lg">
          聚焦"双碳"战略
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide leading-tight mt-2 drop-shadow-lg">
          <span className="text-white/95">领航</span>
          <span className="bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
            工业绿色转型
          </span>
        </h2>
        <p className="text-sm md:text-base text-white/90 max-w-xl mt-5 leading-relaxed drop-shadow">
          推动制造业全面绿色低碳转型，构建工业能碳数智空间，赋能企业可持续发展。
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/gov" className="portal-cta-primary">
            政府管理侧 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/ent" className="portal-cta-ghost">
            企业服务侧 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
