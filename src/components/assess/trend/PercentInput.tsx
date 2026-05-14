import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  value: number; // 小数 0.0533
  onChange: (v: number) => void;
  decimals?: number;
  className?: string;
}

// 输入"5.33" => 0.0533；输入"-12" => -0.12
export function PercentInput({ value, onChange, decimals = 2, className }: Props) {
  const [text, setText] = useState(() => (value * 100).toFixed(decimals));

  useEffect(() => {
    setText((value * 100).toFixed(decimals));
  }, [value, decimals]);

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const n = Number(text);
          if (!isNaN(n)) onChange(n / 100);
          else setText((value * 100).toFixed(decimals));
        }}
        className="h-8 w-24 pr-6 text-right text-primary font-medium tabular-nums"
      />
      <span className="absolute right-2 text-xs text-muted-foreground pointer-events-none">%</span>
    </div>
  );
}
