import { Bell, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, UserSide } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleSwitcher } from "@/components/assess/RoleSwitcher";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: UserSide;
}

export function AppLayout({ title, subtitle, children, side = "gov" }: AppLayoutProps) {
  const location = useLocation();
  const isAssessRoute = location.pathname.includes("/assess/");
  const showRoleSwitcher = isAssessRoute && side === "gov";

  const userLabel = side === "gov" ? "监管员" : "企业用户";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar side={side} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-5 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-primary h-9 w-9 rounded-full bg-muted/60 hover:bg-accent flex items-center justify-center" />

            <div className="ml-auto flex items-center gap-3">
              {showRoleSwitcher && <RoleSwitcher side={side} />}

              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/60 hover:bg-accent">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-destructive text-destructive-foreground text-[10px]">
                  3
                </Badge>
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
