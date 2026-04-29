import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

export function BusinessFunctions() {
  const [side, setSide] = useState<"gov" | "ent">("gov");
  const items = side === "gov" ? govItems : entItems;

  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">业务功能</h2>

        <div className="flex justify-center mb-2">
          <div className="inline-flex rounded-full bg-card border border-border p-1">
            <button
              onClick={() => setSide("gov")}
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
              onClick={() => setSide("ent")}
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
          {items.map((it) => (
            <Link
              key={it.label}
              to={it.to}
              className="portal-card group overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={it.image}
                  alt={it.label}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{it.label}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {it.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
