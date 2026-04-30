import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimplePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Minimal pagination: shows "< current / total >" only.
 * No page-size selector.
 */
export function SimplePagination({
  total,
  page,
  pageSize,
  onPageChange,
  className = "",
}: SimplePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return (
    <div
      className={`flex items-center justify-end gap-1 px-4 py-2 border-t border-border bg-card/40 ${className}`}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>
      <span className="text-xs text-muted-foreground px-2 tabular-nums">
        {safePage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        disabled={safePage >= totalPages}
        onClick={() => onPageChange(safePage + 1)}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return items.slice((safePage - 1) * pageSize, safePage * pageSize);
}
