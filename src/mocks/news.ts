import news1 from "@/assets/portal/news-1.jpg";
import news2 from "@/assets/portal/news-2.jpg";
import news3 from "@/assets/portal/news-3.jpg";

export type NewsCategory = "hot" | "enterprise" | "notice";
export type NewsStatus = "draft" | "published" | "offline";
export type NewsSource = "节能中心" | "上海经信委" | "其他";

export interface NewsArticle {
  id: string;
  title: string;
  category: NewsCategory;
  source: NewsSource;
  sourceCustom?: string;
  wechatUrl: string;
  cover: string;
  summary: string;
  publishAt: string; // YYYY-MM-DD
  pinned: boolean;
  status: NewsStatus;
  views: number;
  createdBy: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  hot: "热点动态",
  enterprise: "企业发布",
  notice: "通知公告",
};

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  hot: "bg-red-500/10 text-red-600 border-red-500/30",
  enterprise: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  notice: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export const STATUS_LABELS: Record<NewsStatus, string> = {
  draft: "草稿",
  published: "已发布",
  offline: "已下架",
};

export const SOURCE_OPTIONS: NewsSource[] = ["节能中心", "上海经信委", "其他"];

export const newsArticles: NewsArticle[] = [
  {
    id: "n1",
    title: "上海市工业和通信业能碳数智平台正式上线运行，助力高质量绿色低碳转型",
    category: "hot",
    source: "节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-1",
    cover: news1,
    summary: "平台聚合全市能碳数据，构建一体化数智底座，助力工业绿色转型。",
    publishAt: "2026-04-23",
    pinned: true,
    status: "published",
    views: 1284,
    createdBy: "市级总账号",
    updatedAt: "2026-04-23 10:30",
  },
  {
    id: "n2",
    title: "市经信委召开 2026 年工业节能与综合利用工作座谈会",
    category: "hot",
    source: "上海经信委",
    wechatUrl: "https://mp.weixin.qq.com/s/example-2",
    cover: news2,
    summary: "聚焦节能减排、综合利用与绿色制造体系建设，研究部署 2026 年重点任务。",
    publishAt: "2026-04-18",
    pinned: false,
    status: "published",
    views: 892,
    createdBy: "市级总账号",
    updatedAt: "2026-04-18 14:20",
  },
  {
    id: "n3",
    title: "首批「能效领跑」示范企业名单正式发布",
    category: "notice",
    source: "节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-3",
    cover: news3,
    summary: "覆盖钢铁、化工、电子等多个行业的能效领跑标杆企业名单出炉。",
    publishAt: "2026-04-15",
    pinned: false,
    status: "published",
    views: 643,
    createdBy: "市级总账号",
    updatedAt: "2026-04-15 09:00",
  },
  {
    id: "n4",
    title: "宝钢股份发布2025年度绿色低碳发展报告",
    category: "enterprise",
    source: "其他",
    sourceCustom: "宝钢股份",
    wechatUrl: "https://mp.weixin.qq.com/s/example-4",
    cover: news1,
    summary: "宝钢股份率先发布全行业首份ESG绿色低碳综合报告，碳排放强度同比下降5.2%。",
    publishAt: "2026-04-10",
    pinned: false,
    status: "published",
    views: 412,
    createdBy: "市级总账号",
    updatedAt: "2026-04-10 16:00",
  },
  {
    id: "n5",
    title: "关于开展2026年度重点用能单位能源审计工作的通知",
    category: "notice",
    source: "上海经信委",
    wechatUrl: "https://mp.weixin.qq.com/s/example-5",
    cover: news2,
    summary: "请各重点用能单位按通知要求于6月30日前完成能源审计报告报送。",
    publishAt: "2026-04-08",
    pinned: true,
    status: "published",
    views: 1567,
    createdBy: "市级总账号",
    updatedAt: "2026-04-08 11:15",
  },
  {
    id: "n6",
    title: "智能体集群助力企业 CBAM 合规申报",
    category: "hot",
    source: "节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-6",
    cover: news3,
    summary: "AI Agent 协同帮助出口企业一键完成碳边境调节机制合规申报。",
    publishAt: "2026-04-05",
    pinned: false,
    status: "draft",
    views: 0,
    createdBy: "市级总账号",
    updatedAt: "2026-04-05 18:30",
  },
  {
    id: "n7",
    title: "上海石化数字化转型助力节能降耗（旧版）",
    category: "enterprise",
    source: "其他",
    sourceCustom: "上海石化",
    wechatUrl: "https://mp.weixin.qq.com/s/example-7",
    cover: news1,
    summary: "通过数字孪生技术，上海石化全年节约标煤2.3万吨。",
    publishAt: "2026-03-20",
    pinned: false,
    status: "offline",
    views: 234,
    createdBy: "市级总账号",
    updatedAt: "2026-03-20 09:45",
  },
];

export function getNewsById(id: string) {
  return newsArticles.find((n) => n.id === id);
}

export function getSourceLabel(article: Pick<NewsArticle, "source" | "sourceCustom">) {
  return article.source === "其他" && article.sourceCustom ? article.sourceCustom : article.source;
}
