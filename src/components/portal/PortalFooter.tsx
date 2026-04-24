import { Leaf } from "lucide-react";

const links = [
  { label: "国家工信部", href: "#" },
  { label: "国家发改委", href: "#" },
  { label: "国家节能中心", href: "#" },
  { label: "上海市经信委", href: "#" },
  { label: "上海市发改委", href: "#" },
  { label: "上海市节能中心", href: "#" },
];

export function PortalFooter() {
  return (
    <footer className="portal-footer mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 左：品牌 */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold text-foreground">
              Carbon Intelligence Shanghai
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            上海市工业和通信业能碳数智空间，赋能制造业绿色低碳转型，为可持续发展提供智能化支撑。
          </p>
        </div>

        {/* 中：友情链接 */}
        <div className="md:col-span-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">友情链接</h3>
          <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* 右：联系 */}
        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-foreground mb-4">联系我们</h3>
          <p className="text-xs text-muted-foreground mb-1">电话：XXX-XXXXX</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            地址：上海市虹口区中山北一路<br />121 号 A1 栋 5 楼
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-center text-[11px] text-muted-foreground">
          © 2026 上海市节能中心 · 沪公网安备 31010102004535 号
        </div>
      </div>
    </footer>
  );
}
