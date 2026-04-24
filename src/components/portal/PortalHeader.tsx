import { Link, NavLink, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navs = [
  { to: "/portal", label: "首页", end: true },
  { to: "/portal/green-mfg", label: "绿色制造" },
  { to: "/portal/scenarios", label: "场景招商" },
  { to: "/portal/news", label: "要闻动态" },
];

interface Props {
  variant?: "transparent" | "solid";
}

export function PortalHeader({ variant = "transparent" }: Props) {
  const isSolid = variant === "solid";
  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-30 transition-colors",
        isSolid && "relative bg-card border-b border-border"
      )}
    >
      <div className="max-w-[1400px] mx-auto h-16 px-6 flex items-center gap-8">
        <Link to="/portal" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
            <Activity className={cn("h-4 w-4", isSolid ? "text-primary" : "text-white")} />
          </div>
          <span className={cn("text-base font-bold tracking-wide", isSolid ? "text-foreground" : "text-white")}>
            AI+上海市工业和通信业能碳数智空间
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 ml-8">
          {navs.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isSolid
                    ? isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                    : isActive
                    ? "text-white"
                    : "text-white/80 hover:text-white",
                  isActive &&
                    "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-current after:rounded"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link
            to="/portal/register"
            className={cn(
              "transition-colors",
              isSolid ? "text-foreground/70 hover:text-primary" : "text-white/85 hover:text-white"
            )}
          >
            注册
          </Link>
          <span className={isSolid ? "text-border" : "text-white/40"}>|</span>
          <Link
            to="/portal/login"
            className={cn(
              "transition-colors",
              isSolid ? "text-foreground/70 hover:text-primary" : "text-white/85 hover:text-white"
            )}
          >
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}
