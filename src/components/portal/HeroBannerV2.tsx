import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import heroBg from "@/assets/portal/hero-shanghai-bright.jpg";

export function HeroBannerV2() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmBack = () => {
    setConfirmOpen(false);
    toast.success("已切换至旧版门户", {
      description: "如需再次体验新版，可在旧版首页点击「体验门户 V2」",
      duration: 2400,
    });
    // 留出一帧让 toast 出现，再跳转
    setTimeout(() => navigate("/portal"), 120);
  };

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
      <div className="absolute top-6 left-10 z-10 text-white/95 tracking-[0.25em] text-sm md:text-base font-medium drop-shadow-md">
        节约能源 · 监察有力 · 高效廉洁 · 服务社会
      </div>

      {/* 右上角操作 */}
      <div className="absolute top-5 right-10 z-10 flex items-center gap-3 text-[13px]">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/25 backdrop-blur-sm transition shadow-sm"
          title="切换回旧版门户"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          返回旧版
        </button>
        <Link
          to="/portal/login"
          className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
        >
          登录
        </Link>
      </div>

      {/* 居中主标题 + 入口（不渲染搜索框） */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>切换回旧版门户？</AlertDialogTitle>
            <AlertDialogDescription>
              旧版门户将作为默认入口展示。您随时可以在旧版首页点击「体验门户 V2」回到当前新版界面。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>留在新版</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBack}>
              确认返回旧版
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
