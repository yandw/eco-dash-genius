import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsArticles, getSourceLabel, CATEGORY_LABELS } from "@/mocks/news";
import { NewsCategoryBadge } from "@/components/news/NewsCategoryBadge";

export default function PortalNewsDetail() {
  const { id } = useParams();
  const n = newsArticles.find((x) => x.id === id) ?? newsArticles[0];
  const sourceLabel = getSourceLabel(n);

  return (
    <PortalLayout headerVariant="solid">
      <article className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/portal/news"
          className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> 返回列表
        </Link>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <NewsCategoryBadge category={n.category} />
            <span className="text-xs text-muted-foreground">
              {CATEGORY_LABELS[n.category]}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">
            {n.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>来源：{sourceLabel}</span>
            <span>发布时间：{n.publishAt}</span>
            <span>浏览：{n.views}</span>
          </div>
        </div>

        {/* 嵌入公众号原文 */}
        {n.wechatUrl ? (
          <>
            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  内容来自微信公众号「{sourceLabel}」
                </span>
                <a
                  href={n.wechatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  在微信中打开 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <iframe
                src={n.wechatUrl}
                title={n.title}
                className="w-full h-[80vh] bg-white"
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              如内容无法显示，请点击右上角「在微信中打开」查看完整文章。
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <img src={n.cover} alt={n.title} className="w-full rounded-lg" />
            <p className="text-base text-foreground/85 leading-loose">{n.summary}</p>
          </div>
        )}
      </article>
    </PortalLayout>
  );
}
