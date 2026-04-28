import { Link, NavLink } from "react-router-dom";
import { Leaf } from "lucide-react";
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
      <div className="max-w-[1400px] mx-auto h-14 px-6 flex items-center gap-8">
        <Link to="/portal" className="flex items-center gap-2 shrink-0">
          <div
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center",
              isSolid ? "bg-primary/10" : "bg-white/15 backdrop-blur-md border border-white/30"
            )}
          >
            <Leaf className={cn("h-3.5 w-3.5", isSolid ? "text-primary" : "text-white")} />
          </div>
          <span
            className={cn(
              "text-sm font-semibold tracking-wide",
              isSolid ? "text-foreground" : "text-white"
            )}
          >
            上海市工业和通信业能碳数智空间
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 ml-6">
          {navs.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "text-[13px] font-medium transition-colors relative py-1",
                  isSolid
                    ? isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                    : isActive
                    ? "text-white"
                    : "text-white/80 hover:text-white",
                  isActive &&
                    "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[3px] after:w-5 after:rounded-full after:bg-current"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-[13px]">
          <Link
            to="/portal/login"
            className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}
