import { useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ARCHIVE_FILTER_GROUPS,
  AdvancedFilters,
  countAdvancedFilters,
  emptyAdvancedFilters,
} from "@/mocks/archiveFilters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AdvancedFilters;
  onApply: (next: AdvancedFilters) => void;
}

export function ArchiveFilterDrawer({ open, onOpenChange, value, onApply }: Props) {
  // 抽屉内的工作副本，关闭/取消都不影响外部
  const [draft, setDraft] = useState<AdvancedFilters>(value);
  const [activeKey, setActiveKey] = useState<string>(ARCHIVE_FILTER_GROUPS[0].key);
  const [keyword, setKeyword] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // 每次打开时同步外部值
  useEffect(() => {
    if (open) {
      setDraft(value);
      setKeyword("");
      setActiveKey(ARCHIVE_FILTER_GROUPS[0].key);
    }
  }, [open, value]);

  const total = countAdvancedFilters(draft);

  const toggleOption = (groupKey: string, opt: string) => {
    setDraft((prev) => {
      const cur = prev[groupKey] ?? [];
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
      return { ...prev, [groupKey]: next };
    });
  };

  const setSubGroup = (groupKey: string, options: string[], selectAll: boolean) => {
    setDraft((prev) => {
      const cur = new Set(prev[groupKey] ?? []);
      if (selectAll) options.forEach((o) => cur.add(o));
      else options.forEach((o) => cur.delete(o));
      return { ...prev, [groupKey]: Array.from(cur) };
    });
  };

  const scrollToGroup = (key: string) => {
    setActiveKey(key);
    const el = sectionRefs.current[key];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
    }
  };

  // 关键字过滤后的分组（用于隐藏不匹配的标签）
  const filteredGroups = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return ARCHIVE_FILTER_GROUPS;
    return ARCHIVE_FILTER_GROUPS.map((g) => ({
      ...g,
      subGroups: g.subGroups
        .map((sg) => ({ ...sg, options: sg.options.filter((o) => o.includes(kw)) }))
        .filter((sg) => sg.options.length > 0),
    })).filter((g) => g.subGroups.length > 0);
  }, [keyword]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[920px] w-[92vw] h-[80vh] max-h-[720px] flex flex-col overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-border/70 space-y-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              高级筛选
            </DialogTitle>
            <span className="text-xs text-muted-foreground mr-8">
              已选 <span className="font-mono text-foreground font-medium">{total}</span> 项
            </span>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="在所有标签中搜索（如 浦东、化工、吴梅）"
              className="pl-8 h-9"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 grid grid-cols-[140px_1fr]">
          {/* 左侧锚点 */}
          <nav className="border-r border-border/70 bg-muted/20 overflow-y-auto py-2">
            {ARCHIVE_FILTER_GROUPS.map((g) => {
              const count = (draft[g.key] ?? []).length;
              const active = activeKey === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => scrollToGroup(g.key)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors border-l-2",
                    active
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  <span>{g.label}</span>
                  {count > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-mono px-1">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 右侧分组卡片 */}
          <div ref={scrollRef} className="overflow-y-auto p-4 space-y-4">
            {filteredGroups.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-12">
                无匹配标签
              </div>
            )}
            {filteredGroups.map((g) => (
              <section
                key={g.key}
                ref={(el) => {
                  sectionRefs.current[g.key] = el;
                }}
                className="rounded-lg border border-border/70 bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{g.label}</h3>
                  <span className="text-[10px] text-muted-foreground">
                    {(draft[g.key] ?? []).length} / {g.subGroups.reduce((s, sg) => s + sg.options.length, 0)}
                  </span>
                </div>
                <div className="space-y-3">
                  {g.subGroups.map((sg, i) => {
                    const selected = draft[g.key] ?? [];
                    const allSelected = sg.options.every((o) => selected.includes(o));
                    return (
                      <div key={`${g.key}-${i}`} className="space-y-1.5">
                        {(sg.label || g.subGroups.length > 1) && (
                          <div className="flex items-center gap-3 text-[11px]">
                            {sg.label && (
                              <span className="font-medium text-foreground/80">
                                {sg.label}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSubGroup(g.key, sg.options, !allSelected)}
                              className="text-primary hover:underline"
                            >
                              {allSelected ? "取消全选" : "全选"}
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {sg.options.map((opt) => {
                            const on = selected.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleOption(g.key, opt)}
                                className={cn(
                                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs transition-colors",
                                  on
                                    ? "bg-accent text-accent-foreground border-primary shadow-sm"
                                    : "bg-background text-foreground/80 border-border hover:border-primary/40 hover:text-foreground",
                                )}
                              >
                                {on && <Check className="h-3 w-3" />}
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!g.subGroups.some((sg) => sg.label) && g.subGroups.length === 1 && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSubGroup(
                          g.key,
                          g.subGroups[0].options,
                          (draft[g.key] ?? []).length !== g.subGroups[0].options.length,
                        )
                      }
                      className="text-[11px] text-primary hover:underline"
                    >
                      {(draft[g.key] ?? []).length === g.subGroups[0].options.length
                        ? "取消全选"
                        : "全选"}
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="border-t border-border/70 px-5 py-3 flex items-center gap-2 bg-card">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setDraft(emptyAdvancedFilters())}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> 重置全部
          </Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-3.5 w-3.5 mr-1" /> 取消
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary text-primary-foreground border-0"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> 应用筛选（{total}）
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
