import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Car, Hammer, Building, Bus } from "lucide-react";

const tabs = [
  { key: "finance", label: "智慧金融", icon: TrendingUp },
  { key: "auto", label: "汽车制造", icon: Car },
  { key: "steel", label: "钢型建材", icon: Hammer },
  { key: "realestate", label: "房地产", icon: Building },
  { key: "mobility", label: "智慧出行", icon: Bus },
];

export function ScenarioTabs() {
  const [active, setActive] = useState("finance");
  const Active = tabs.find((t) => t.key === active)!;

  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">场景招商</h2>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                active === t.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground/70 hover:bg-accent hover:text-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[280px]"
          style={{ background: "var(--portal-gradient-card-blue)" }}
        >
          <div className="p-10 text-white flex flex-col justify-center">
            <Active.icon className="h-10 w-10 mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-3">{Active.label}场景</h3>
            <p className="text-white/85 text-sm leading-relaxed mb-6">
              聚焦{Active.label}行业绿色低碳转型典型场景，提供从碳数据采集、核算、披露到减碳路径规划的一体化解决方案。
            </p>
            <button className="self-start px-6 py-2 rounded-full bg-white/20 border border-white/40 text-sm hover:bg-white/30 transition-colors">
              了解更多
            </button>
          </div>
          <div className="lg:col-span-2 bg-card/95 p-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-lg bg-gradient-to-br from-accent to-secondary border border-border flex items-center justify-center text-xs text-muted-foreground"
              >
                典型案例 {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
