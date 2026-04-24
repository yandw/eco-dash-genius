import { NavLink } from "@/components/NavLink";

const tabs = [
  { name: "首页", to: "/gov" },
  { name: "十年节能", to: "/gov/decade" },
  { name: "双控跟踪", to: "/gov/dual-track" },
  { name: "双控考核", to: "/gov/dual-assess" },
  { name: "IDC监察", to: "/gov/idc" },
  { name: "设备对标", to: "/gov/equip-bench" },
];

export function MonitoringTabs() {
  return (
    <div className="mb-5 flex items-center gap-1 border-b border-border/60 overflow-x-auto">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end
          className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-smooth border-b-2 border-transparent whitespace-nowrap"
          activeClassName="!text-primary !border-primary font-medium"
        >
          {t.name}
        </NavLink>
      ))}
    </div>
  );
}
