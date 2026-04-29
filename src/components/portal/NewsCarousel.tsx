import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { newsArticles, CATEGORY_LABELS } from "@/mocks/news";

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  /** 兼容旧引用 */
  img: string;
  summary: string;
  feature?: boolean;
}

export const newsList: NewsItem[] = newsArticles
  .filter((n) => n.status === "published")
  .slice(0, 4)
  .map((n, idx) => ({
    id: n.id,
    title: n.title,
    category: CATEGORY_LABELS[n.category],
    date: n.publishAt,
    image: n.cover,
    img: n.cover,
    summary: n.summary,
    feature: idx === 0,
  }));

export function NewsCarousel() {
  const [feature, ...rest] = newsList;

  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">要闻动态</h2>
            <p className="text-sm text-muted-foreground mt-1">
              聚焦行业最新动态、政策与活动
            </p>
          </div>
          <Link
            to="/portal/news"
            className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            查看更多 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左侧大图 */}
          <Link
            to={`/portal/news/${feature.id}`}
            className="lg:col-span-5 portal-card overflow-hidden block group"
          >
            <div className="relative h-[280px] overflow-hidden">
              <img
                src={feature.image}
                alt={feature.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary text-primary-foreground">
                {feature.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition">
                {feature.title}
              </h3>
              <div className="text-xs text-muted-foreground mt-2">{feature.date}</div>
            </div>
          </Link>

          {/* 右侧列表 */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {rest.map((n) => (
              <Link
                key={n.id}
                to={`/portal/news/${n.id}`}
                className="portal-card p-4 flex gap-4 items-center group"
              >
                <div className="h-20 w-28 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-accent text-primary font-medium">
                      {n.category}
                    </span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition">
                    {n.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
