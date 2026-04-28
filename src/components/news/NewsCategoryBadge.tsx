import { CATEGORY_COLORS, CATEGORY_LABELS, NewsCategory } from "@/mocks/news";
import { cn } from "@/lib/utils";

interface Props {
  category: NewsCategory;
  className?: string;
}

export function NewsCategoryBadge({ category, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
        CATEGORY_COLORS[category],
        className,
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
