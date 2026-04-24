import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  CalendarDays,
  Gauge,
  Leaf,
  Cloud,
  Cpu,
  Database,
  Zap,
} from "lucide-react";

const govItems = [
  { label: "月报填写", desc: "在线填写月度报表，自动校验", icon: FileText },
  { label: "年报填写", desc: "年度数据汇总与报送", icon: CalendarDays },
  { label: "限额填报", desc: "能耗限额指标统一申报", icon: Gauge },
  { label: "绿色制造申报", desc: "绿色工厂/园区一站式申报", icon: Leaf },
];

const enterpriseItems = [
  { label: "能耗填报", desc: "智能采集，自动汇总", icon: FileText },
  { label: "碳排放核算", desc: "符合国家方法学的核算工具", icon: Cloud },
  { label: "节能诊断", desc: "AI 智能识别节能潜力", icon: Cpu },
  { label: "数据中心", desc: "实时监测设备能耗", icon: Database },
];

export function BusinessFunctions() {
  const [side, setSide] = useState<"gov" | "ent">("gov");
  const items = side === "gov" ? govItems : enterpriseItems;

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.label}
                className="portal-card p-6 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="portal-icon-badge mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{it.label}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {it.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
