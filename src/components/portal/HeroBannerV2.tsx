import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/portal/hero-shanghai-bright.jpg";
import logo from "@/assets/portal/logo.png";

export function HeroBannerV2() {
  return (
    <section className="relative h-[520px] overflow-hidden">
      <img
        src={heroBg}
        alt="上海城市天际线"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/25 via-transparent to-sky-950/35" />

      {/* 左上角口号 */}
      <div className="absolute top-6 left-10 z-30 text-white/95 tracking-[0.25em] text-sm md:text-base font-medium drop-shadow-md">
        节约能源 · 监察有力 · 高效廉洁 · 服务社会
      </div>

      {/* 右上角操作 */}
      <div className="absolute top-5 right-10 z-30 flex items-center gap-4 text-[13px]">
        <a
          href="/portal"
          className="text-white/85 hover:text-white transition"
        >
          返回旧版
        </a>
        <Link
          to="/portal/login"
          className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
        >
          登录
        </Link>
      </div>

      {/* 居中主标题 + 入口（不渲染搜索框） */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <img
          src={logo}
          alt="平台 Logo"
          className="h-16 w-16 md:h-20 md:w-20 object-contain mb-6 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
        />
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
          上海市工业和通信业能碳数智空间
        </h1>
        <p className="mt-4 text-white/85 text-sm md:text-base tracking-widest drop-shadow">
          Shanghai Industrial &amp; Telecom Energy-Carbon Intelligent Space
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
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
