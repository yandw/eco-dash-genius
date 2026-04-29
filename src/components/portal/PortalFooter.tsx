import logo from "@/assets/portal/logo.png";

const links = [
  { label: "国家工信部", href: "https://www.miit.gov.cn" },
  { label: "国家发改委", href: "https://www.ndrc.gov.cn" },
  { label: "国家节能中心", href: "https://www.chinanecc.cn" },
  { label: "上海市经信委", href: "https://sheitc.sh.gov.cn" },
  { label: "上海市发改委", href: "https://fgw.sh.gov.cn" },
];

export function PortalFooter() {
  return (
    <footer className="portal-footer-dark mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 左：品牌 */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-md bg-white flex items-center justify-center overflow-hidden">
              <img src={logo} alt="平台 Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-base font-semibold text-white">
              上海市工业和通信业能碳数智空间
            </span>
          </div>
          <p className="text-xs text-white/65 leading-relaxed max-w-md">
            赋能制造业绿色低碳转型，为可持续发展提供智能化支撑。
          </p>
        </div>

        {/* 中：友情链接 */}
        <div className="md:col-span-4">
          <h3 className="text-sm font-semibold text-white mb-4">友情链接</h3>
          <div className="grid grid-cols-2 gap-y-2 text-xs text-white/65">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[hsl(210_100%_70%)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* 右：联系 */}
        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-white mb-4">联系我们</h3>
          <p className="text-xs text-white/65 leading-relaxed">
            地址：上海市虹口区中山北一路<br />121 号 A1 栋 5 楼
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-center text-[11px] text-white/55">
          © 2026 上海市节能中心 · 沪公网安备 31010102004535 号
        </div>
      </div>
    </footer>
  );
}
