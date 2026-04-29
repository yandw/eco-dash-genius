import { NewsCategoryBadge } from "./NewsCategoryBadge";
import { NewsCategory, getSourceLabel } from "@/mocks/news";
import { Pin } from "lucide-react";

interface Props {
  title: string;
  category: NewsCategory;
  source: "上海市节能中心" | "上海市经信委" | "其他";
  sourceCustom?: string;
  cover?: string;
  summary: string;
  publishAt: string;
  pinned?: boolean;
}

export function NewsPreviewCard(props: Props) {
  const sourceLabel = getSourceLabel({ source: props.source, sourceCustom: props.sourceCustom });
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        {props.cover ? (
          <img src={props.cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            封面图预览
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <NewsCategoryBadge category={props.category} />
          {props.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500 text-white">
              <Pin className="h-3 w-3" /> 置顶
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
          {props.title || "新闻标题预览"}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
          {props.summary || "在此填写新闻摘要，将展示在门户列表中。"}
        </p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>来源：{sourceLabel}</span>
          <span>{props.publishAt}</span>
        </div>
      </div>
    </div>
  );
}
