import { MapPin } from "lucide-react";
import hall from "@/assets/portal/mfg-green-factory.jpg";
import expo from "@/assets/portal/mfg-zero-park.jpg";
import center from "@/assets/portal/mfg-supply.jpg";

const bases = [
  {
    no: "01",
    title: "节能中心展示大厅",
    desc: "节能中心展示大厅是核心的线下展示窗口，总面积超过 3000 平方米，分为绿色技术综合展区、互动体验区、项目路演区三大功能区域。这里汇聚了历届大赛的优质技术成果，通过实物展示、模型演示、多媒体互动等多种形式，全方位呈现绿色科技创新的前沿技术和应用案例。大厅配备专业讲解团队，可为来访者提供中英文双语讲解服务，并定期举办技术分享会和工作坊。",
    address: "上海市徐汇区漕河泾开发区桂平路 700 号",
    image: hall,
  },
  {
    no: "02",
    title: "工博会专区",
    desc: "工博会专区位于中国国际工业博览会核心展区，面积达 3000 平方米，是国家级工业展会上的重要展示窗口。专区设置技术创新展区、项目路演区、合作洽谈区三大功能区，每年吸引数百家企业和专业观众前来参观交流。这里不仅展示最新的绿色制造技术和解决方案，还为参展项目提供与产业资本对接的宝贵机会，是技术成果走向产业化落地的重要平台。",
    address: "上海市青浦区崧泽大道 333 号国家会展中心",
    image: expo,
  },
  {
    no: "03",
    title: "徐汇西岸常态化展示中心",
    desc: "徐汇西岸常态化展示中心位于上海西岸智慧谷核心区域，是面向公众的绿色科技常态化展示空间。中心采用「科技 + 艺术」的策展理念，通过数字孪生、AR 增强现实、沉浸式体验等前沿技术手段，为参观者带来独特的绿色科技体验。展示内容定期更新，涵盖能源转型、碳中和技术、智能制造等多个领域的创新成果，是公众了解绿色科技发展的重要窗口。",
    address: "上海市徐汇区龙腾大道 2350 号西岸智慧谷 B 栋",
    image: center,
  },
];

export function ExhibitionBases() {
  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="portal-section-title">线下展示基地</h2>
        <span className="portal-section-divider" />
        <p className="portal-section-sub">
          三大常态化展示窗口，为绿色科技成果提供全流程的展示与对接服务
        </p>

        <div className="flex flex-col gap-12 mt-4">
          {bases.map((b, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={b.no}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <div className="text-5xl font-bold text-primary/15 leading-none mb-2">
                    {b.no}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {b.desc}
                  </p>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-accent border border-primary/15 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>展厅地址：{b.address}</span>
                  </div>
                </div>
                <div className={reverse ? "lg:order-1" : ""}>
                  <div className="relative rounded-xl overflow-hidden h-[360px] portal-card">
                    <img
                      src={b.image}
                      alt={b.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
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
