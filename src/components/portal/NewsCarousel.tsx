import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import news1 from "@/assets/portal/news-1.jpg";
import news2 from "@/assets/portal/news-2.jpg";
import news3 from "@/assets/portal/news-3.jpg";

export const newsList = [
  {
    id: "1",
    img: news1,
    title: "\"数据基础设施建设典型案例\"正式发布",
    summary:
      "国家数据局以2025中国国际大数据产业博览会\"数据基础设施建设暨数据流通利用\"主论坛为契机，正式发布……",
    date: "2025-09-12",
  },
  {
    id: "2",
    img: news2,
    title: "网站等机升级维护公告",
    summary:
      "因网站机房升级维护影响产品访问，为确保各业务工作平稳，现将网站维护安排进行公告……",
    date: "2025-08-26",
  },
  {
    id: "3",
    img: news3,
    title: "标准筑基体系引领数智赋能低碳转型",
    summary:
      "为夯实上海市\"十五五\"期间产业绿色化、数字化协同转型的数据基础，推动人工智能与节能降碳深度融合……",
    date: "2025-07-31",
  },
];

export function NewsCarousel() {
  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">要闻动态</h2>

        <div className="relative">
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent z-10">
            <ChevronLeft className="h-5 w-5 text-foreground/70" />
          </button>
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent z-10">
            <ChevronRight className="h-5 w-5 text-foreground/70" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.map((n) => (
              <Link
                to={`/portal/news/${n.id}`}
                key={n.id}
                className="portal-card overflow-hidden block group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {n.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{n.date}</span>
                    <span className="text-primary font-medium">查看详情 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/portal/news"
            className="inline-block px-8 py-2.5 rounded-full bg-card border border-border text-sm text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            查看更多
          </Link>
        </div>
      </div>
    </section>
  );
}
