import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/portal/logo.png";

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
      <div className="max-w-[1400px] mx-auto h-16 px-6 flex items-center relative">
        <nav className="hidden md:flex items-center gap-12 mx-auto">
          {navs.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "text-base font-medium transition-colors relative py-1.5",
                  isSolid
                    ? isActive
                      ? "text-primary"
                      : "text-foreground/75 hover:text-primary"
                    : isActive
                    ? "text-white"
                    : "text-white/85 hover:text-white",
                  isActive &&
                    "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[3px] after:w-6 after:rounded-full after:bg-current"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-[13px]">
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
