import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/portal/hero-shanghai-bright.jpg";

export function HeroBanner() {
  return (
    <section className="relative h-[520px] overflow-hidden">
      <img
        src={heroBg}
        alt="上海城市天际线"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* 更轻的渐变遮罩，保留天空亮度 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/25 via-transparent to-sky-950/35" />

      {/* 左上角口号 */}
      <div className="absolute top-20 left-10 z-10 text-white/95 tracking-[0.25em] text-sm md:text-base font-medium drop-shadow-md">
        节约能源 · 监察有力 · 高效廉洁 · 服务社会
      </div>

      {/* 居中主标题 + 入口 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
          上海市工业和通信业能碳数智空间
        </h1>

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
