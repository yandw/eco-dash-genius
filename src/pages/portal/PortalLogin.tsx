import { PortalLayout } from "@/components/portal/PortalLayout";
import loginBg from "@/assets/portal/login-bg.jpg";

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
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217_70%_10%)]/70 via-[hsl(217_70%_12%)]/45 to-[hsl(217_70%_10%)]/30" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-16 flex items-center justify-center min-h-[680px]">
          {/* 登录卡片 */}
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
            </form>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
