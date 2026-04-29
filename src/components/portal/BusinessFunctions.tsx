import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import govOverview from "@/assets/portal/biz/gov-overview.jpg";
import govMonthly from "@/assets/portal/biz/gov-monthly.jpg";
import govYearly from "@/assets/portal/biz/gov-yearly.jpg";
import govQuota from "@/assets/portal/biz/gov-quota.jpg";
import govArchives from "@/assets/portal/biz/gov-archives.jpg";
import govCarbonGoal from "@/assets/portal/biz/gov-carbon-goal.jpg";
import govDualAssess from "@/assets/portal/biz/gov-dual-assess.jpg";
import entMonthly from "@/assets/portal/biz/ent-monthly.jpg";
import entYearly from "@/assets/portal/biz/ent-yearly.jpg";
import entQuota from "@/assets/portal/biz/ent-quota.jpg";
import entCarbon from "@/assets/portal/biz/ent-carbon.jpg";
import entAssessResult from "@/assets/portal/biz/ent-assess-result.jpg";
import entPosts from "@/assets/portal/biz/ent-posts.jpg";

type BizItem = { label: string; desc: string; image: string; to: string };

const govItems: BizItem[] = [
  { label: "全景监测", desc: "城市级能耗与碳排实时监测", image: govOverview, to: "/gov" },
  { label: "月报审核", desc: "企业月度能源数据审核", image: govMonthly, to: "/gov/report-monthly" },
  { label: "年报审核", desc: "年度节能报告汇总审核", image: govYearly, to: "/gov/report-yearly" },
  { label: "能耗限额审核", desc: "重点用能单位限额审核", image: govQuota, to: "/gov/energy-quota" },
  { label: "节能档案审核", desc: "企业节能档案在线审核", image: govArchives, to: "/gov/archives" },
  { label: "碳排放目标分解", desc: "区域碳排目标层级分解", image: govCarbonGoal, to: "/gov/assess/goal" },
  { label: "能耗双控考核", desc: "强度+总量双控年度考核", image: govDualAssess, to: "/gov/assess/dual" },
];

const entItems: BizItem[] = [
  { label: "月报填报", desc: "在线填写月度能耗数据", image: entMonthly, to: "/ent/report-monthly" },
  { label: "年报填报", desc: "年度节能报告一键报送", image: entYearly, to: "/ent/report-yearly" },
  { label: "能耗限额填报", desc: "限额指标在线申报", image: entQuota, to: "/ent/energy-quota" },
  { label: "碳排放目标填报", desc: "企业碳排目标分解填报", image: entCarbon, to: "/ent/assess/goal" },
  { label: "能耗考核结果", desc: "查看考核分数与详情", image: entAssessResult, to: "/ent/assess/dual" },
  { label: "岗位备案", desc: "节能岗位人员备案登记", image: entPosts, to: "/ent/posts" },
];

const PAGE_SIZE = 4;

export function BusinessFunctions() {
  const [side, setSide] = useState<"gov" | "ent">("gov");
  const [page, setPage] = useState(0);

  const items = side === "gov" ? govItems : entItems;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);

  const handleSwitch = (s: "gov" | "ent") => {
    setSide(s);
    setPage(0);
  };

  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">业务功能</h2>

        <div className="flex justify-center mb-2">
          <div className="inline-flex rounded-full bg-card border border-border p-1">
            <button
              onClick={() => handleSwitch("gov")}
              className={cn(
                "px-5 py-1.5 text-xs rounded-full transition-all",
                side === "gov"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              政府侧
            </button>
            <button
              onClick={() => handleSwitch("ent")}
              className={cn(
                "px-5 py-1.5 text-xs rounded-full transition-all",
                side === "ent"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              企业侧
            </button>
          </div>
        </div>
        <span className="portal-section-divider" />

        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label="上一页"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            aria-label="下一页"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                className="portal-card p-5 flex flex-col items-center text-center cursor-pointer group hover:-translate-y-0.5 transition-transform"
              >
                <div className="mb-4 h-20 w-20 rounded-full overflow-hidden bg-muted ring-1 ring-border/60 group-hover:ring-primary/40 transition">
                  <img
                    src={it.image}
                    alt={it.label}
                    loading="lazy"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {it.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {it.desc}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`第 ${i + 1} 页`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === safePage ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
