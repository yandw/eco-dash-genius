import { Link } from "react-router-dom";
import factory from "@/assets/portal/mfg-green-factory.jpg";
import zeroPark from "@/assets/portal/mfg-zero-park.jpg";
import demo from "@/assets/portal/mfg-demo.jpg";
import supply from "@/assets/portal/mfg-supply.jpg";

interface Tile {
  title: string;
  desc: string;
  image: string;
  className: string;
  to?: string;
}

const tiles: Tile[] = [
  {
    title: "绿色工厂",
    desc: "全面构建数智化、清洁化、低碳化生产体系，打造行业绿色标杆",
    image: factory,
    className: "lg:col-span-6 lg:row-span-2 h-[440px]",
  },
  {
    title: "企业预评估",
    desc: "面向申报企业提供绿色制造水平自评与诊断服务",
    image: zeroPark,
    className: "lg:col-span-6 h-[210px]",
  },
  {
    title: "培育库",
    desc: "梯度培育、动态管理，储备优质绿色制造后备力量",
    image: supply,
    className: "lg:col-span-3 h-[210px]",
  },
  {
    title: "示范单位",
    desc: "树立行业能效标杆，展示绿色工厂典型案例",
    image: demo,
    className: "lg:col-span-3 h-[210px]",
    to: "/portal/green-mfg/factories",
  },
];

export function GreenMfgGrid() {
  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">绿色制造</h2>
        <span className="portal-section-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
          {tiles.map((t) => {
            const inner = (
              <>
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute left-5 bottom-4 right-5 text-white">
                  <h3 className="text-lg font-bold drop-shadow">{t.title}</h3>
                  <p className="text-xs text-white/85 mt-1 leading-relaxed line-clamp-2">
                    {t.desc}
                  </p>
                </div>
              </>
            );
            const cls =
              "relative overflow-hidden rounded-xl group cursor-pointer block " + t.className;
            return t.to ? (
              <Link key={t.title} to={t.to} className={cls}>
                {inner}
              </Link>
            ) : (
              <div key={t.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
