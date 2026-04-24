import { Activity } from "lucide-react";

const links = [
  { label: "国家工信部", href: "#" },
  { label: "国家发改委", href: "#" },
  { label: "国家节能中心", href: "#" },
  { label: "上海市经信委", href: "#" },
  { label: "上海市发改委", href: "#" },
];

export function PortalFooter() {
  return (
    <footer className="portal-footer text-white mt-16">
      <div className="relative max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-base font-semibold mb-6">相关链接</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 max-w-md text-sm text-white/70">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="md:text-right">
          <div className="flex md:justify-end items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold">上海市节能中心</span>
          </div>
          <p className="text-sm text-white/70">电话：XXX-XXXXX</p>
          <p className="text-sm text-white/70 mt-1">
            地址：上海市虹口区中山北一路121号A1栋5楼
          </p>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-center text-xs text-white/50">
          © 2024 上海市节能中心 | 沪公网安备 31010102004535号
        </div>
      </div>
    </footer>
  );
}
