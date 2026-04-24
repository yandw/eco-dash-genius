import factory from "@/assets/portal/mfg-green-factory.jpg";
import zeroPark from "@/assets/portal/mfg-zero-park.jpg";
import demo from "@/assets/portal/mfg-demo.jpg";
import supply from "@/assets/portal/mfg-supply.jpg";

interface Tile {
  title: string;
  desc: string;
  image: string;
  className: string;
}

const tiles: Tile[] = [
  {
    title: "绿色工厂",
    desc: "全面构建数智化、清洁化、低碳化生产体系，打造行业绿色标杆",
    image: factory,
    className: "lg:col-span-6 lg:row-span-2 h-[440px]",
  },
  {
    title: "零碳园区",
    desc: "源网荷储一体化，可再生能源高比例利用",
    image: zeroPark,
    className: "lg:col-span-6 h-[210px]",
  },
  {
    title: "示范单位",
    desc: "树立行业能效标杆",
    image: demo,
    className: "lg:col-span-3 h-[210px]",
  },
  {
    title: "绿色供应链",
    desc: "上下游协同减碳",
    image: supply,
    className: "lg:col-span-3 h-[210px]",
  },
];

export function GreenMfgGrid() {
  return (
    <section className="py-14 bg-secondary/40">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">现代绿色生态制造体系</h2>
        <span className="portal-section-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
          {tiles.map((t) => (
            <div
              key={t.title}
              className={
                "relative overflow-hidden rounded-xl group cursor-pointer " + t.className
              }
            >
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
