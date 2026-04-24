import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { newsList } from "@/components/portal/NewsCarousel";

export default function PortalNewsDetail() {
  const { id } = useParams();
  const n = newsList.find((x) => x.id === id) ?? newsList[0];

  return (
    <PortalLayout headerVariant="solid">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/portal/news" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4" /> 返回列表
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{n.title}</h1>
        <div className="text-xs text-muted-foreground mb-6">发布时间：{n.date}</div>
        <img
          src={n.img}
          alt={n.title}
          loading="lazy"
          width={800}
          height={512}
          className="w-full rounded-lg mb-6"
        />
        <p className="text-base text-foreground/85 leading-loose mb-4">{n.summary}</p>
        <p className="text-base text-foreground/85 leading-loose">
          上海市节能中心将持续推进AI+节能降碳可信数据空间建设，构建覆盖能源数据采集、传输、存储、分析全链路的标准体系，
          为上海市工业和通信业绿色低碳转型提供坚实的数据基础和技术支撑。
        </p>
      </article>
    </PortalLayout>
  );
}
