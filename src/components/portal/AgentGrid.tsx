import { CheckCircle2, ClipboardCheck, Stethoscope, Leaf, Globe2, Database } from "lucide-react";

const agents = [
  { title: "免申即享Agent", desc: "XXXXX", icon: CheckCircle2 },
  { title: "双控考核Agent", desc: "XXXXX", icon: ClipboardCheck },
  { title: "节能诊断Agent", desc: "XXXXX", icon: Stethoscope },
  { title: "绿色制造自评价Agent", desc: "XXXXX", icon: Leaf },
  { title: "CBAM咨询Agent", desc: "XXXXX", icon: Globe2 },
];

export function AgentGrid() {
  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">智能体集群</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((a) => (
            <div key={a.title} className="portal-card p-6 flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <a.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          ))}

          {/* 高亮卡片：大模型训练数据 */}
          <div
            className="rounded-xl p-6 text-white relative overflow-hidden flex items-start gap-4"
            style={{ background: "var(--portal-gradient-card-blue)" }}
          >
            <div className="flex-1 relative z-10">
              <h3 className="text-base font-semibold">大模型训练数据</h3>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                AI报告、网络模型与大数据视化训练数据
              </p>
            </div>
            <div className="h-14 w-14 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 relative z-10">
              <Database className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
