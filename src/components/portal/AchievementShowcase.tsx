import { MapPin, Heart, ExternalLink } from "lucide-react";
import expo from "@/assets/portal/mfg-demo.jpg";
import base from "@/assets/portal/mfg-green-factory.jpg";
import t1 from "@/assets/portal/mfg-zero-park.jpg";
import t2 from "@/assets/portal/scene-finance.jpg";
import t3 from "@/assets/portal/scene-aluminum.jpg";
import t4 from "@/assets/portal/mfg-supply.jpg";
import t5 from "@/assets/portal/scene-auto.jpg";
import t6 from "@/assets/portal/scene-realestate.jpg";

const stageColor: Record<string, string> = {
  试点验证: "bg-accent text-primary",
  规模化推广: "bg-primary/10 text-primary",
  原型阶段: "bg-secondary text-secondary-foreground",
  成熟商业化: "bg-primary text-primary-foreground",
};

const achievements = [
  {
    stage: "试点验证",
    category: "负碳技术",
    title: "工业级碳捕集与封存系统",
    desc: "开发了一种高效、低能耗的工业 CO₂ 捕集系统，采用改性胺溶剂实现 90% 以上的捕集率。",
    city: "上海",
    invest: "¥2000万",
    image: t1,
  },
  {
    stage: "规模化推广",
    category: "极致能效",
    title: "智能光伏组件优化器",
    desc: "基于深度学习的光伏组件智能优化器，实现组件级最大功率点跟踪，解决阴影遮挡和热斑问题。",
    city: "杭州",
    invest: "¥3000万",
    image: t2,
  },
  {
    stage: "原型阶段",
    category: "氢能技术",
    title: "固态储氢关键技术研发",
    desc: "研发了一种镁基固态储氢材料，储氢密度达 6.5wt%，安全性大幅提升，适用于分布式储能。",
    city: "苏州",
    invest: "¥1500万",
    image: t3,
  },
  {
    stage: "试点验证",
    category: "储能技术",
    title: "压缩空气储能系统",
    desc: "开发了高效压缩空气储能系统，效率达 65% 以上，适合电网调峰和可再生能源消纳。",
    city: "北京",
    invest: "¥5000万",
    image: t4,
  },
  {
    stage: "成熟商业化",
    category: "智能控制",
    title: "工业互联网能效管理平台",
    desc: "基于工业互联网的能效管理 SaaS 平台，实时监测 + AI 优化，助力企业降低能耗 10-25%。",
    city: "深圳",
    invest: "¥800万",
    image: t5,
  },
  {
    stage: "规模化推广",
    category: "氢能技术",
    title: "绿氢制取电解槽技术",
    desc: "通过新型隔膜材料和电极结构优化，提升碱性电解槽效率至 80%，降低制氢成本。",
    city: "上海",
    invest: "¥4000万",
    image: t6,
  },
];

export function AchievementShowcase() {
  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">场景招商</h2>
        <span className="portal-section-divider" />

        {/* A. 顶部双卡 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: "绿色科技成果展",
              desc: "汇聚全球绿色科技创新的前沿成果，大赛技术方案及绿色项目线上展示窗口，直观呈现技术在实际场景中的应用效果。",
              image: expo,
              stats: [
                { v: "80+", l: "展示技术" },
                { v: "200+", l: "参与机构" },
              ],
            },
            {
              title: "基地展厅",
              desc: "通过节能中心展示大厅、工博会专区、徐汇西岸常态化等展示窗口，为技术创新提供全流程的展示服务。",
              image: base,
              stats: [
                { v: "15+", l: "工业场景" },
                { v: "200+", l: "技术验证" },
                { v: "3个", l: "展示基地" },
              ],
            },
          ].map((c) => (
            <div key={c.title} className="portal-card overflow-hidden flex flex-col">
              <div className="relative h-[260px] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="text-xl font-bold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                <div className={`border-t border-border/60 pt-4 mt-auto grid gap-2 text-center grid-cols-${c.stats.length}`}>
                  {c.stats.map((s) => (
                    <div key={s.l}>
                      <div className="text-2xl font-bold text-primary">{s.v}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* B. 创新成果网格 */}
        <div className="mt-14 mb-6 flex items-end justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">前沿创新成果</h3>
            <p className="text-sm text-muted-foreground mt-1">
              聚焦绿色低碳关键技术，推动成果转化与产业化落地
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((a) => (
            <div key={a.title} className="portal-card overflow-hidden flex flex-col">
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <span
                  className={
                    "absolute left-3 top-3 px-2.5 py-1 rounded-full text-[11px] font-medium " +
                    (stageColor[a.stage] || "bg-accent text-primary")
                  }
                >
                  {a.stage}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span className="text-xs text-primary font-medium">{a.category}</span>
                <h4 className="text-base font-semibold text-foreground leading-snug">
                  {a.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {a.desc}
                </p>
                <div className="flex items-center justify-between text-xs border-t border-border/60 pt-3 mt-auto">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {a.city}
                  </span>
                  <span className="font-semibold text-primary">{a.invest}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-1 h-9 rounded-md border border-border text-xs text-foreground/80 hover:bg-accent transition">
                    <Heart className="h-3.5 w-3.5" /> 认领产品
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 h-9 rounded-md text-xs text-primary-foreground bg-primary hover:opacity-90 transition">
                    <ExternalLink className="h-3.5 w-3.5" /> 查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
