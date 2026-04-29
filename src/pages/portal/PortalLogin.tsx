import { PortalLayout } from "@/components/portal/PortalLayout";

export default function PortalLogin() {
  return (
    <PortalLayout headerVariant="solid">
      <div className="min-h-[600px] flex items-center justify-center px-6 py-12 bg-secondary/40">
        <div className="portal-card w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-2">用户登录</h1>
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
            <button
              type="button"
              className="w-full h-11 rounded-lg text-white font-medium mt-2"
              style={{ background: "var(--portal-gradient-card-blue)" }}
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
