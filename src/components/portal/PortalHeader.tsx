import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/portal/logo.png";
import { useAuth, logout } from "@/mocks/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  const user = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("已退出登录");
    navigate("/portal");
  };
  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-30 transition-colors",
        isSolid && "relative bg-card border-b border-border"
      )}
    >
      <div className="max-w-[1400px] mx-auto h-16 px-6 flex items-center relative">
        {isSolid && (
          <Link to="/portal" className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <img src={logo} alt="平台 Logo" className="h-8 w-8 object-contain" />
            <span className="hidden lg:inline text-sm font-semibold tracking-wide text-foreground">
              上海市工业和通信业能碳数智空间
            </span>
          </Link>
        )}
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-full transition",
                    isSolid
                      ? "hover:bg-secondary text-foreground"
                      : "hover:bg-white/10 text-white"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {user.displayName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.displayName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  当前账号：{user.username}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/portal/login"
              className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
