import { MessageSquareWarning } from "lucide-react";
import { FieldAnnotationItem } from "@/mocks/archives";

interface Props {
  items: FieldAnnotationItem[];
}

/** 在字段下方展示中心管理员的退回批注（企业侧只读 + 政府侧可参考） */
export function FieldAnnotationList({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="mt-2 space-y-1.5">
      {items.map((a, i) => (
        <div
          key={i}
          className="flex gap-2 items-start text-[11px] rounded-md border border-destructive/30 bg-destructive/5 text-destructive px-2.5 py-1.5"
        >
          <MessageSquareWarning className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <div className="leading-relaxed flex-1">
            <div>{a.comment}</div>
            <div className="text-destructive/70 mt-0.5">
              — {a.by} · {a.at}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
