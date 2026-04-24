import { Link } from "react-router-dom";
import heroBg from "@/assets/portal/hero-bg.jpg";

export function HeroBanner() {
  return (
    <section className="relative h-[520px] overflow-hidden">
      <img
        src={heroBg}
        alt="工业绿色转型"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={768}
      />
      <div className="absolute inset-0 portal-hero-overlay" />
      <div className="relative z-10 max-w-[1400px] mx-auto h-full flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wide mb-4 drop-shadow-lg">
          聚焦"双碳"战略，领航工业绿色转型新格局
        </h1>
        <p className="text-xl md:text-3xl text-white/95 font-medium tracking-wider mb-12 drop-shadow">
          推动制造业全面绿色低碳转型
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <Link to="/gov" className="portal-glass-btn">政府管理侧</Link>
          <Link to="/ent" className="portal-glass-btn">企业服务侧</Link>
        </div>
      </div>
    </section>
  );
}
