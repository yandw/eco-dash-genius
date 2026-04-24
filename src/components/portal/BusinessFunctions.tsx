import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  CalendarDays,
  Gauge,
  Leaf,
  ClipboardCheck,
  BarChart3,
  Cloud,
  Database,
  Cpu,
  Zap,
} from "lucide-react";
import cube from "@/assets/portal/cube-3d.png";

const govItems = [
  { label: "月报填写", desc: "XXXXXX", icon: FileText },
  { label: "年报填写", desc: "XXXXXX", icon: CalendarDays },
  { label: "限额填报", desc: "XXXXXX", icon: Gauge },
  { label: "绿色制造申报", desc: "XXXXXX", icon: Leaf },
  { label: "双控考核", desc: "XXXXXX", icon: ClipboardCheck },
  { label: "数据分析", desc: "XXXXXX", icon: BarChart3 },
];

const enterpriseItems = [
  { label: "能耗填报", desc: "XXXXXX", icon: FileText },
  { label: "碳排放核算", desc: "XXXXXX", icon: Cloud },
  { label: "节能诊断", desc: "XXXXXX", icon: Cpu },
  { label: "数据中心", desc: "XXXXXX", icon: Database },
  { label: "绿电采购", desc: "XXXXXX", icon: Zap },
  { label: "对标分析", desc: "XXXXXX", icon: BarChart3 },
];

const orbitIcons = [Cloud, Database, Cpu, Zap, Leaf, BarChart3];

export function BusinessFunctions() {
  const [side, setSide] = useState<"gov" | "ent">("gov");
  const items = side === "gov" ? govItems : enterpriseItems;

  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">业务功能</h2>
          <div className="inline-flex rounded-full bg-card border border-border p-1">
            <button
              onClick={() => setSide("gov")}
              className={cn(
                "px-5 py-1.5 text-xs rounded-full transition-all",
                side === "gov" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              政府侧
            </button>
            <button
              onClick={() => setSide("ent")}
              className={cn(
                "px-5 py-1.5 text-xs rounded-full transition-all",
                side === "ent" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              企业侧
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 左侧功能列表 */}
          <div className="portal-card p-6 grid grid-cols-2 gap-4">
            {items.map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white shrink-0">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{it.label}</div>
                  <div className="text-xs text-muted-foreground">{it.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 右侧立方体 + 轨道 */}
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full border border-primary/20 absolute" />
              <div className="h-96 w-96 rounded-full border border-primary/10 absolute" />
            </div>

            <img
              src={cube}
              alt="数据立方体"
              loading="lazy"
              width={768}
              height={768}
              className="relative z-10 w-64 h-64 object-contain portal-float drop-shadow-2xl"
            />

            {orbitIcons.map((Icon, i) => {
              const angle = (i / orbitIcons.length) * Math.PI * 2;
              const radius = 170;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute h-12 w-12 rounded-full bg-card border border-primary/30 flex items-center justify-center shadow-lg z-20"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
