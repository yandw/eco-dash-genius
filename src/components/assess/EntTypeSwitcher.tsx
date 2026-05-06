import { Building2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEntType, setEntType, EntTypeLabel, type EntType } from "@/mocks/entTypeStore";

export function EntTypeSwitcher() {
  const t = useEntType();
  const types: EntType[] = ["district", "city"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Building2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{EntTypeLabel[t]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">演示用 · 切换企业类型</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {types.map((x) => (
          <DropdownMenuItem key={x} onClick={() => setEntType(x)} className="text-xs">
            {EntTypeLabel[x]}
            {t === x && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
