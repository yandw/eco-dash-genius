import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsArticles, CATEGORY_LABELS, NewsCategory } from "@/mocks/news";
import { cn } from "@/lib/utils";
import news3d from "@/assets/portal/news-3d.png";

const categories: { key: NewsCategory; label: string }[] = [
  { key: "hot", label: CATEGORY_LABELS.hot },
  { key: "enterprise", label: CATEGORY_LABELS.enterprise },
  { key: "notice", label: CATEGORY_LABELS.notice },
];

export default function PortalNews() {
  const [active, setActive] = useState<NewsCategory>("hot");
  const [keyword, setKeyword] = useState("");

  const list = useMemo(() => {
    return newsArticles
      .filter((n) => n.status === "published" && n.category === active)
      .filter(
        (n) =>
          !keyword ||
          n.title.includes(keyword) ||
          n.summary.includes(keyword),
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return a.publishAt < b.publishAt ? 1 : -1;
      });
  }, [active, keyword]);

  return (
    <PortalLayout headerVariant="transparent">
      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden bg-gradient-to-br from-[hsl(217_80%_22%)] to-[hsl(210_85%_45%)]">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto h-full px-6 pt-16 flex items-center justify-between">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">要闻动态</h1>
            <p className="text-base md:text-lg text-white/90">
              汇聚行业要闻，掌握工业绿色转型前沿资讯
            </p>
          </div>
          <img
            src={news3d}
            alt=""
            width={768}
            height={768}
            className="hidden md:block w-72 h-72 object-contain portal-float drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Body */}
      <section className="max-w-[1400px] mx-auto px-6 -mt-12 relative z-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Categories */}
          <aside className="portal-card p-4 h-fit">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={cn(
                  "w-full text-left px-5 py-3 rounded-lg text-sm font-medium transition-all mb-1",
                  active === c.key
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/70 hover:bg-accent hover:text-primary",
                )}
              >
                {c.label}
              </button>
            ))}
          </aside>

          {/* List */}
          <div className="portal-card p-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="请输入关键词"
                className="w-full h-11 rounded-lg bg-secondary border border-border pl-11 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-6">
              {list.map((n) => (
                <Link
                  to={`/portal/news/${n.id}`}
                  key={n.id}
                  className="flex flex-col md:flex-row gap-5 pb-6 border-b border-border last:border-0 group"
                >
                  <div className="md:w-56 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img
                      src={n.cover}
                      alt={n.title}
                      loading="lazy"
                      width={800}
                      height={512}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                      {n.summary}
                    </p>
                    <div className="text-xs text-muted-foreground text-right mt-auto">
                      {n.publishAt}
                    </div>
                  </div>
                </Link>
              ))}
              {list.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">
                  未找到相关资讯
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
