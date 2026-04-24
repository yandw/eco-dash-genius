import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsList } from "@/components/portal/NewsCarousel";
import { cn } from "@/lib/utils";
import news3d from "@/assets/portal/news-3d.png";

const categories = [
  { key: "hot", label: "热点动态" },
  { key: "enterprise", label: "企业发布" },
  { key: "notice", label: "通知公告" },
];

const extended = [
  ...newsList,
  {
    id: "4",
    img: newsList[0].img,
    title: "聚焦零碳实践，夯实绿色发展根基——虹口区领导一行赴上海科学节能展示馆参观",
    summary:
      "近日，虹口区委常委、副区长吴伟平带队赴上海科学节能展示馆参观\"开卷新能·零碳智典\"专题展。市节能中心、虹口区发改委、区科经委、区生态局，及聚联绿电等相关单位负责人陪同参观。",
    date: "2024-12-04",
  },
  {
    id: "5",
    img: newsList[1].img,
    title: "上海市能碳数智空间建设方案研讨会成功召开",
    summary:
      "近日，由上海市节能中心组织的能碳数智空间建设方案研讨会顺利召开，多位行业专家与企业代表共同研讨建设路径。",
    date: "2024-11-15",
  },
];

export default function PortalNews() {
  const [active, setActive] = useState("hot");
  const [keyword, setKeyword] = useState("");

  const list = extended.filter((n) => n.title.includes(keyword) || n.summary.includes(keyword));

  return (
    <PortalLayout headerVariant="transparent">
      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden bg-gradient-to-br from-[hsl(217_91%_56%)] to-[hsl(210_100%_60%)]">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
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
                    : "text-foreground/70 hover:bg-accent hover:text-primary"
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
                placeholder="请输入"
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
                  <div className="md:w-56 aspect-[16/10] rounded-lg overflow-hidden shrink-0">
                    <img
                      src={n.img}
                      alt={n.title}
                      loading="lazy"
                      width={800}
                      height={512}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                      {n.summary}
                    </p>
                    <div className="text-xs text-muted-foreground text-right">{n.date}</div>
                  </div>
                </Link>
              ))}
              {list.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">未找到相关资讯</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
