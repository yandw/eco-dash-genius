import { useEffect, useState } from "react";
import { ChevronDown, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCurrentRole, setCurrentRole, RoleLabel, type UserRole } from "@/mocks/currentUser";

const roles: UserRole[] = ["enterprise", "district_admin", "city_admin"];

export function RoleSwitcher() {
  const [role, setRole] = useState<UserRole>(getCurrentRole());

  useEffect(() => {
    const onChange = () => setRole(getCurrentRole());
    window.addEventListener("role-changed", onChange);
    return () => window.removeEventListener("role-changed", onChange);
  }, []);

  const select = (r: UserRole) => {
    setCurrentRole(r);
    setRole(r);
    // 触发当前页重渲染
    setTimeout(() => window.location.reload(), 50);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <UserCog className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{RoleLabel[role]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs">演示用 · 切换角色</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((r) => (
          <DropdownMenuItem key={r} onClick={() => select(r)} className="text-xs">
            {RoleLabel[r]}
            {role === r && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
