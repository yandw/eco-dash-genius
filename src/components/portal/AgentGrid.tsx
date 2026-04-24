import { CheckCircle2, ClipboardCheck, Stethoscope, Leaf, Globe2, ArrowRight } from "lucide-react";

const agents = [
  { title: "免申即享", desc: "智能匹配政策红利，免申即享", icon: CheckCircle2 },
  { title: "双控考核", desc: "能耗双控指标自动核算", icon: ClipboardCheck },
  { title: "节能诊断", desc: "AI 辅助节能潜力诊断", icon: Stethoscope },
  { title: "制造自评价", desc: "绿色制造体系智能自评", icon: Leaf },
  { title: "CBAM 咨询", desc: "碳边境调节机制智能问答", icon: Globe2 },
];

export function AgentGrid() {
  return (
    <section className="pt-20 pb-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">智能体集群</h2>
            <p className="text-sm text-muted-foreground mt-1">
              五大智能体协同，让能碳管理更智能、更高效
            </p>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            查看全部 Agent <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {agents.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                className="portal-card p-5 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="portal-icon-badge mb-4 group-hover:scale-110 transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {a.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
