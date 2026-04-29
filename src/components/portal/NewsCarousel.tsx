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
  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsList.map((n) => (
            <Link
              key={n.id}
              to={`/portal/news/${n.id}`}
              className="portal-card overflow-hidden block group flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={n.image}
                  alt={n.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary text-primary-foreground">
                  {n.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition">
                  {n.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-2">
                  {n.summary}
                </p>
                <div className="text-xs text-muted-foreground mt-auto pt-3">
                  {n.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
