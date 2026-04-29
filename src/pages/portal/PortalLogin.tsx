import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { login } from "@/mocks/auth";
import loginBg from "@/assets/portal/login-bg.jpg";

export default function PortalLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/portal";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("请输入账号和密码");
      return;
    }
    setSubmitting(true);
    const user = login(username, password);
    setSubmitting(false);
    if (!user) {
      toast.error("账号或密码错误");
      return;
    }
    toast.success(`欢迎回来，${user.displayName}`);
    navigate(from, { replace: true });
  };

  return (
    <PortalLayout headerVariant="solid">
      <section className="relative min-h-[680px] overflow-hidden">
        <img
          src={loginBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217_70%_10%)]/70 via-[hsl(217_70%_12%)]/45 to-[hsl(217_70%_10%)]/30" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-16 flex items-center justify-center min-h-[680px]">
          <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/40 p-8">
            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              用户登录
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              登录后访问能碳数智空间全部功能
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-foreground/80 block mb-1.5">账号</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full h-11 rounded-lg bg-secondary border border-border px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-foreground/80 block mb-1.5">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full h-11 rounded-lg bg-secondary border border-border px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-primary" />
                  记住账号
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg text-white font-medium mt-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--portal-gradient-card-blue)" }}
              >
                {submitting ? "登录中..." : "登录"}
              </button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                演示账号：admin / 123456
              </p>
            </form>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
