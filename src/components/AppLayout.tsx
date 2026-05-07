import { Bell, User, LogOut, Maximize2, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, UserSide, govItems, entItems } from "@/components/AppSidebar";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleSwitcher } from "@/components/assess/RoleSwitcher";
import { EntTypeSwitcher } from "@/components/assess/EntTypeSwitcher";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: UserSide;
  /** When true, show a fullscreen button in the header that opens current URL in a new browser window. */
  fullscreen?: boolean;
  /** Optional content rendered in the header right area, before the notification bell. */
  headerExtra?: React.ReactNode;
}

function findBreadcrumb(side: UserSide, pathname: string): string[] {
  const items = side === "gov" ? govItems : entItems;

  // Try child exact match first.
  for (const item of items) {
    if (item.children) {
      const child = item.children.find((c) => c.url === pathname);
      if (child) return [item.title, child.title];
    }
  }
  // Then match nested detail pages by the longest child URL. This prevents the
  // root dashboard child (/gov) from swallowing routes such as /gov/news/:id/edit.
  const childMatches = items
    .flatMap((item) => (item.children ?? []).map((child) => ({ item, child })))
    .sort((a, b) => b.child.url.length - a.child.url.length);
  for (const { item, child } of childMatches) {
    if (child.url !== item.url && pathname.startsWith(child.url + "/")) {
      return [item.title, child.title];
    }
  }
  // Top-level exact match
  for (const item of items) {
    if (item.url === pathname && !item.children) return [item.title];
  }
  // Top-level prefix (for nested detail pages)
  const sorted = [...items].sort((a, b) => b.url.length - a.url.length);
  for (const item of sorted) {
    if (pathname === item.url || pathname.startsWith(item.url + "/")) {
      // check if a child matches by prefix
      if (item.children) {
        const child = [...item.children]
          .sort((a, b) => b.url.length - a.url.length)
          .find((c) => pathname === c.url || pathname.startsWith(c.url + "/"));
        if (child) return [item.title, child.title];
      }
      return [item.title];
    }
  }
  return [];
}

export function AppLayout({ title, subtitle, children, side = "gov", fullscreen, headerExtra }: AppLayoutProps) {
  const location = useLocation();
  const isAssessRoute = location.pathname.includes("/assess/");
  const showRoleSwitcher = isAssessRoute && side === "gov";

  const userLabel = side === "gov" ? "监管员" : "企业用户";
  let crumbs = findBreadcrumb(side, location.pathname);
  if (crumbs.length === 0) {
    if (subtitle) {
      crumbs = subtitle.split(/\s*[/／>›»]\s*/).filter(Boolean);
    } else {
      crumbs = [title];
    }
  }

  const openFullscreen = () => {
    const url = window.location.pathname + window.location.search;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar side={side} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-5 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-primary h-9 w-9 rounded-full bg-muted/60 hover:bg-accent flex items-center justify-center" />

            {/* 面包屑：一级 / 二级 菜单名 */}
            <nav className="flex items-center gap-1.5 text-sm min-w-0">
              {crumbs.length > 0 ? (
                crumbs.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5 min-w-0">
                    {i > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    )}
                    <span
                      className={
                        i === crumbs.length - 1
                          ? "font-semibold text-foreground truncate"
                          : "text-muted-foreground truncate"
                      }
                    >
                      {c}
                    </span>
                  </span>
                ))
              ) : (
                <span className="font-semibold text-foreground truncate">{title}</span>
              )}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              {showRoleSwitcher && <RoleSwitcher side={side} />}
              

              {headerExtra}

              {fullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openFullscreen}
                  title="全屏查看（新窗口）"
                  className="h-9 w-9 rounded-full bg-muted/60 hover:bg-accent"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}

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

          <main className="flex-1 overflow-auto p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
