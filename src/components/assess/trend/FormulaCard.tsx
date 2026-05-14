import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

type Item = { name: string; expr: string; desc?: string };

interface Props {
  title?: string;
  items: Item[];
  notes?: string[];
}

export function FormulaCard({ title = "测算公式", items, notes }: Props) {
  return (
    <Card className="p-4 bg-muted/30 border-dashed">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
        <Info className="h-4 w-4 text-primary" />
        {title}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {items.map((it) => (
          <div key={it.name} className="flex items-baseline gap-2">
            <span className="font-mono text-primary shrink-0">{it.name}</span>
            <span className="font-mono text-foreground">= {it.expr}</span>
            {it.desc && <span className="text-muted-foreground text-xs">（{it.desc}）</span>}
          </div>
        ))}
      </div>
      {notes && notes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/60 space-y-1 text-xs text-muted-foreground">
          {notes.map((n, i) => (
            <div key={i}>· {n}</div>
          ))}
        </div>
      )}
    </Card>
  );
}
