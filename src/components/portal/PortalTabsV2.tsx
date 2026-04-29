import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", label: "首页", target: "top" },
  { key: "green", label: "绿色制造", target: "green-mfg" },
  { key: "scene", label: "成果展示", target: "scenario" },
];

export function PortalTabsV2() {
  const [active, setActive] = useState("home");

  const onClick = (key: string, target: string) => {
    setActive(key);
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-card border-b border-border/70">
      <div className="max-w-[1400px] mx-auto px-6">
        <nav className="flex items-center justify-center gap-16 h-16">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onClick(t.key, t.target)}
                className={cn(
                  "relative text-base font-semibold transition-colors py-2",
                  isActive
                    ? "text-[hsl(28_92%_52%)]"
                    : "text-foreground/75 hover:text-primary"
                )}
              >
                {t.label}
                {isActive && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[3px] w-8 rounded-full bg-[hsl(28_92%_52%)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
