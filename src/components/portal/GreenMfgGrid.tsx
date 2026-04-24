import { Factory, Award, Recycle, Trees, Sun, Wind } from "lucide-react";

const items = [
  { title: "绿色工厂", desc: "数智化追踪管控，赋能工厂全生命周期绿色转型", icon: Factory },
  { title: "示范单位", desc: "全链条赋能行业升级，营造工业低碳发展行业标杆", icon: Award },
  { title: "绿色供应链", desc: "贯通上下游，构建低碳供应链管理体系", icon: Recycle },
  { title: "绿色园区", desc: "园区集约化管理，打造低碳产业生态", icon: Trees },
  { title: "绿色产品", desc: "全生命周期评价，推动绿色产品认证", icon: Sun },
  { title: "绿色低碳服务", desc: "面向制造业的绿色低碳综合服务", icon: Wind },
];

export function GreenMfgGrid() {
  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">绿色制造</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.title} className="portal-card p-6 flex items-center gap-5">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <div className="h-14 w-14 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
