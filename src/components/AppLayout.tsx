import { Bell, Search, Sun, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, UserSide } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: UserSide;
}

export function AppLayout({ title, subtitle, children, side = "gov" }: AppLayoutProps) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
  const timeStr = now.toLocaleTimeString("zh-CN", { hour12: false });

  const sideLabel = side === "gov" ? "政府监管端" : "企业服务端";
  const userLabel = side === "gov" ? "监管员" : "企业用户";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar side={side} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-5 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-primary h-9 w-9 rounded-full bg-muted/60 hover:bg-accent flex items-center justify-center" />

            <div className="hidden md:flex items-center gap-2 ml-2">
              <span className="glow-dot" />
              <span className="text-xs text-muted-foreground">
                {sideLabel} · 系统运行正常
              </span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                <span>{dateStr}</span>
                <span className="font-mono text-primary">{timeStr}</span>
              </div>

              <div className="relative hidden md:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={side === "gov" ? "搜索企业 / 报表..." : "搜索表单 / 文件..."}
                  className="h-9 w-64 pl-9 rounded-full bg-muted/60 border-transparent text-xs focus-visible:bg-card"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/60 hover:bg-accent">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-destructive text-destructive-foreground text-[10px]">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted/60 hover:bg-accent">
                <Sun className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l border-border/60">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="hidden md:inline text-xs text-foreground">{userLabel}</span>
                <Link
                  to="/portal"
                  className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary ml-1"
                  title="返回门户"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  退出
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
