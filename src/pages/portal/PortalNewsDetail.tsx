import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsArticles, getSourceLabel, CATEGORY_LABELS } from "@/mocks/news";
import { NewsCategoryBadge } from "@/components/news/NewsCategoryBadge";

export default function PortalNewsDetail() {
  const { id } = useParams();
  const n = newsArticles.find((x) => x.id === id);

  if (!n) {
    return (
      <PortalLayout headerVariant="solid">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-3">新闻不存在</h1>
          <p className="text-sm text-muted-foreground mb-6">
            您访问的资讯可能已下架或链接有误。
          </p>
          <Link
            to="/portal/news"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> 返回列表
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const sourceLabel = getSourceLabel(n);

  return (
    <PortalLayout headerVariant="solid">
      <article className="max-w-3xl mx-auto px-6 py-10">
        <Link
          to="/portal/news"
          className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> 返回列表
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <NewsCategoryBadge category={n.category} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-snug">
            {n.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pb-4 border-b border-border">
            <span>来源：{sourceLabel}</span>
            <span>发布时间：{n.publishAt}</span>
          </div>
        </div>

        <img
          src={n.cover}
          alt={n.title}
          className="w-full rounded-lg mb-6 object-cover"
        />

        <div className="space-y-5 text-base text-foreground/85 leading-loose">
          {n.content && n.content.length > 0 ? (
            n.content.map((p, i) => (
              <p key={i} className="text-justify indent-8">
                {p}
              </p>
            ))
          ) : (
            <p className="text-justify indent-8">{n.summary}</p>
          )}
        </div>

      </article>
    </PortalLayout>
  );
}
