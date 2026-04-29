import { Link } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsArticles } from "@/mocks/news";
import news3d from "@/assets/portal/news-3d.png";

export default function PortalNews() {
  const list = newsArticles
    .filter((n) => n.status === "published")
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.publishAt < b.publishAt ? 1 : -1;
    });

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

      {/* List */}
      <section className="max-w-[1100px] mx-auto px-6 -mt-12 relative z-10 pb-16">
        <div className="portal-card p-2 md:p-4">
          <ul className="divide-y divide-border">
            {list.map((n) => (
              <li key={n.id}>
                <Link
                  to={`/portal/news/${n.id}`}
                  className="block px-4 md:px-6 py-5 group hover:bg-accent/40 rounded-lg transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-2">
                    {n.summary}
                  </p>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    {n.publishAt}
                  </div>
                </Link>
              </li>
            ))}
            {list.length === 0 && (
              <li className="text-center text-muted-foreground py-12 text-sm">
                暂无资讯
              </li>
            )}
          </ul>
        </div>
      </section>
    </PortalLayout>
  );
}
