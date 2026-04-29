import { Link } from "react-router-dom";
import expo from "@/assets/portal/mfg-demo.jpg";
import base from "@/assets/portal/mfg-green-factory.jpg";

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
            <Link
              key={c.title}
              to="/portal/scenarios"
              className="portal-card overflow-hidden flex flex-col group hover:shadow-lg transition-shadow"
            >
              <div className="relative h-[260px] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                <div className="border-t border-border/60 pt-4 mt-auto flex justify-around gap-2 text-center">
                  {c.stats.map((s) => (
                    <div key={s.l}>
                      <div className="text-2xl font-bold text-primary">{s.v}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
