import { PortalLayout } from "@/components/portal/PortalLayout";
import { ShieldCheck, Zap, Building2 } from "lucide-react";
import loginBg from "@/assets/portal/login-bg.jpg";
import logo from "@/assets/portal/logo.png";

const highlights = [
  { icon: Zap, title: "全景能碳监测", desc: "实时掌握工业能源与碳排数据" },
  { icon: Building2, title: "一站式企业服务", desc: "月报、年报、限额、考核高效协同" },
  { icon: ShieldCheck, title: "安全合规可信", desc: "数据加密传输与权限隔离" },
];

export default function PortalLogin() {
  return (
    <PortalLayout headerVariant="solid">
      <section className="relative min-h-[680px] overflow-hidden">
        {/* 背景图 */}
        <img
          src={loginBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217_70%_10%)]/85 via-[hsl(217_70%_12%)]/55 to-[hsl(217_70%_10%)]/30" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[680px]">
          {/* 左：品牌 + 介绍 */}
          <div className="text-white">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="平台 Logo" className="h-12 w-12 object-contain drop-shadow" />
              <div className="text-xs tracking-[0.25em] text-white/80">
                SHANGHAI INDUSTRIAL · ENERGY-CARBON
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 drop-shadow">
              上海市工业和通信业<br />能碳数智空间
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-10 max-w-md leading-relaxed">
              一体化节能降碳数智管理平台，赋能制造业绿色低碳转型，
              为可持续发展提供智能化支撑。
            </p>

            <div className="space-y-4 max-w-md">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="flex items-start gap-3 rounded-xl p-3 bg-white/8 backdrop-blur-sm border border-white/10"
                >
                  <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <h.icon className="h-5 w-5 text-[hsl(170_80%_70%)]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{h.title}</div>
                    <div className="text-xs text-white/70 mt-0.5">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右：登录卡片 */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/40 p-8">
              <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                用户登录
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                登录后访问能碳数智空间全部功能
              </p>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/80 block mb-1.5">账号</label>
                  <input
                    type="text"
                    placeholder="请输入账号"
                    className="w-full h-11 rounded-lg bg-secondary border border-border px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/80 block mb-1.5">密码</label>
                  <input
                    type="password"
                    placeholder="请输入密码"
                    className="w-full h-11 rounded-lg bg-secondary border border-border px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    记住账号
                  </label>
                  <a href="#" className="hover:text-primary">忘记密码？</a>
                </div>
                <button
                  type="button"
                  className="w-full h-11 rounded-lg text-white font-medium mt-2 transition-opacity hover:opacity-90"
                  style={{ background: "var(--portal-gradient-card-blue)" }}
                >
                  登录
                </button>
                <div className="text-center text-xs text-muted-foreground pt-2">
                  还没有账号？
                  <a href="/portal/register" className="text-primary hover:underline ml-1">
                    立即注册
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
