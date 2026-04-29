import factoryImg from "@/assets/portal/mfg-green-factory.jpg";
import zeroPark from "@/assets/portal/mfg-zero-park.jpg";
import demo from "@/assets/portal/mfg-demo.jpg";
import supply from "@/assets/portal/mfg-supply.jpg";
import alu from "@/assets/portal/scene-aluminum.jpg";
import auto from "@/assets/portal/scene-auto.jpg";

interface Factory {
  name: string;
  level: string;
  year: string;
  image: string;
  measures: { title: string; desc: string }[];
}

const factories: Factory[] = [
  {
    name: "上海法雷奥汽车电器系统有限公司",
    level: "国家级绿色工厂",
    year: "2025",
    image: auto,
    measures: [
      { title: "高效设备改造", desc: "照明、空压机节能改造，年节能超 138 吨标煤。" },
      { title: "光伏电站", desc: "建设 3.6MWp 分布式光伏，年发电量 389 万度。" },
      { title: "能碳管理", desc: "碳盘查 + 碳足迹认证，热交换系统优化（电耗降 50%）。" },
      { title: "绿电替代", desc: "大规模采购绿色电力，推进物流电动化。" },
    ],
  },
  {
    name: "上汽通用动力科技（上海）有限公司",
    level: "国家级绿色工厂",
    year: "2025",
    image: factoryImg,
    measures: [
      { title: "绿色产线", desc: "奥特能超级工厂，电池制造全流程环保，污染物近零排放。" },
      { title: "能源低碳化", desc: "高比例绿电 + 余热回收，构建\"五化\"（集约/洁净/低碳/无害/资源化）范式。" },
      { title: "智能管控", desc: "数字孪生 + 能源管理系统，实时监控能耗与碳排放。" },
    ],
  },
  {
    name: "联合汽车电子有限公司",
    level: "国家级绿色工厂",
    year: "2025",
    image: alu,
    measures: [
      { title: "节能技改", desc: "2024 年实施 55 项改造（空压机/锅炉升级），年节能 995 吨标煤。" },
      { title: "数智融合", desc: "清洁生产数字化平台 + 智能控制系统，自动化率 95%、数控化率 98%。" },
      { title: "光伏 + 绿电", desc: "自建光伏 + 采购绿电，年绿电占比持续提升。" },
      { title: "绿色供应链", desc: "供应商环保评级 + 低碳物料优先采购。" },
    ],
  },
  {
    name: "上海发电机厂（上海电气集团）",
    level: "国家级绿色工厂",
    year: "2025",
    image: demo,
    measures: [
      { title: "低碳产品", desc: "发电机/储能机组碳足迹认证，零污染高效率。" },
      { title: "智能产线", desc: "数字样机仿真 + 智能转子产线，降低研发能耗。" },
      { title: "智慧能源", desc: "能源管理系统 + 智慧照明，能耗实时调控。" },
      { title: "固废利用", desc: "大宗工业固废综合利用率行业领先。" },
    ],
  },
  {
    name: "阿克苏诺贝尔漆油（上海）有限公司",
    level: "国家级绿色工厂",
    year: "2025",
    image: zeroPark,
    measures: [
      { title: "光伏电站", desc: "光伏覆盖 45% 用电，2026 年目标 90%+。" },
      { title: "高效产线", desc: "全密闭一体化灌装线，原料浪费大幅减少。" },
      { title: "能源管理", desc: "Energy Portal 系统，实时监控优化能耗。" },
    ],
  },
  {
    name: "书香门地集团股份有限公司",
    level: "市级绿色工厂",
    year: "2025（第二批）",
    image: supply,
    measures: [
      { title: "清洁生产", desc: "低 VOCs 胶黏剂替代，废气高效处理，达标排放。" },
      { title: "资源循环", desc: "木材边角料 100% 回收利用，水重复利用率 85%+。" },
      { title: "节能改造", desc: "高效烘干设备 + 余热回收，能耗降低 20%。" },
    ],
  },
];

export function GreenFactoriesShowcase() {
  return (
    <section className="py-16 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">绿色工厂示范单位</h2>
        <span className="portal-section-divider" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {factories.map((f) => {
            const isNational = f.level.startsWith("国家级");
            return (
              <div key={f.name} className="portal-card overflow-hidden flex flex-col group">
                <div className="relative h-[200px] overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={
                      "absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-md " +
                      (isNational ? "bg-primary/10 text-primary" : "bg-emerald-100 text-emerald-700")
                    }
                  >
                    {f.level} · {f.year}
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-semibold text-primary">核心举措</span>
                    <ul className="flex flex-col gap-2">
                      {f.measures.map((m) => (
                        <li key={m.title} className="text-sm text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-foreground">{m.title}：</span>
                          {m.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
