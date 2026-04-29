import pv from "@/assets/portal/mfg-zero-park.jpg";
import factory from "@/assets/portal/mfg-green-factory.jpg";
import demo from "@/assets/portal/mfg-demo.jpg";
import supply from "@/assets/portal/mfg-supply.jpg";
import alu from "@/assets/portal/scene-aluminum.jpg";
import auto from "@/assets/portal/scene-auto.jpg";

const techs = [
  {
    tag: "负碳技术",
    title: "工业级碳捕集与封存系统",
    desc: "开发了一种高效、低能耗的工业 CO₂ 捕集系统，采用改性胺溶剂实现 90% 以上的捕集效率，已在多家电厂示范应用。",
    image: pv,
    status: "试点验证",
  },
  {
    tag: "极致能效",
    title: "智能光伏组件优化器",
    desc: "基于深度学习的光伏组件智能优化器，实现组件级最大功率点跟踪，解决阴影遮挡和组件失配问题。",
    image: factory,
    status: "规模化推广",
  },
  {
    tag: "氢能技术",
    title: "固态储氢关键技术研发",
    desc: "研发了一种镁基固态储氢材料，储氢密度达 6.5wt%，安全性大幅提升，适用于分布式储能场景。",
    image: demo,
    status: "原型阶段",
  },
  {
    tag: "储能技术",
    title: "压缩空气储能系统",
    desc: "开发了高效压缩空气储能系统，效率达 65% 以上，适合电网调峰和可再生能源消纳。",
    image: supply,
    status: "试点验证",
  },
  {
    tag: "智能控制",
    title: "工业互联网能效管理平台",
    desc: "基于工业互联网的能效管理 SaaS 平台，实时监测 + AI 优化，助力企业降低能耗 10-25%。",
    image: alu,
    status: "成熟商业化",
  },
  {
    tag: "氢能技术",
    title: "绿氢制取电解槽技术",
    desc: "通过新型隔膜材料和电极结构优化，提升碱性电解槽效率至 80%，降低制氢成本。",
    image: auto,
    status: "规模化推广",
  },
];

const statusColor: Record<string, string> = {
  试点验证: "bg-blue-100 text-blue-700",
  规模化推广: "bg-emerald-100 text-emerald-700",
  原型阶段: "bg-amber-100 text-amber-700",
  成熟商业化: "bg-primary/10 text-primary",
};

export function TechAchievementsGrid() {
  return (
    <section className="py-16 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">绿色科技创新成果</h2>
        <span className="portal-section-divider" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {techs.map((t) => (
            <div
              key={t.title}
              className="portal-card overflow-hidden flex flex-col group"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={
                    "absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-md " +
                    (statusColor[t.status] || "bg-primary/10 text-primary")
                  }
                >
                  {t.status}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span className="text-xs font-semibold text-primary">{t.tag}</span>
                <h3 className="text-lg font-bold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
