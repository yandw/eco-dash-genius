import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import news1 from "@/assets/portal/news-1.jpg";
import news2 from "@/assets/portal/news-2.jpg";
import news3 from "@/assets/portal/news-3.jpg";

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

export const newsList: NewsItem[] = [
  {
    id: "n1",
    title: "上海市工业和通信业能碳数智平台正式上线运行，助力高质量绿色低碳转型",
    category: "专题",
    date: "2026-04-23",
    image: news1,
    img: news1,
    summary: "平台聚合全市能碳数据，构建一体化数智底座，助力工业绿色转型。",
    feature: true,
  },
  {
    id: "n2",
    title: "市经信委召开 2026 年工业节能与综合利用工作座谈会",
    category: "新闻",
    date: "2026-04-18",
    image: news2,
    img: news2,
    summary: "聚焦节能减排、综合利用与绿色制造体系建设，研究部署 2026 年重点任务。",
  },
  {
    id: "n3",
    title: "首批 \"能效领跑\" 示范企业名单正式发布",
    category: "新闻",
    date: "2026-04-15",
    image: news3,
    img: news3,
    summary: "覆盖钢铁、化工、电子等多个行业的能效领跑标杆企业名单出炉。",
  },
  {
    id: "n4",
    title: "智能体集群助力企业 CBAM 合规申报",
    category: "新闻",
    date: "2026-04-10",
    image: news1,
    img: news1,
    summary: "AI Agent 协同帮助出口企业一键完成碳边境调节机制合规申报。",
  },
];

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
