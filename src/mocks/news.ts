import news1 from "@/assets/portal/news-1.jpg";
import news2 from "@/assets/portal/news-2.jpg";
import news3 from "@/assets/portal/news-3.jpg";

export type NewsCategory = "hot" | "enterprise" | "notice";
export type NewsStatus = "draft" | "published" | "offline";
export type NewsSource = "上海市节能中心" | "上海市经信委" | "其他";

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
  content?: string[];
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

export const SOURCE_OPTIONS: NewsSource[] = ["上海市节能中心", "上海市经信委", "其他"];

export const newsArticles: NewsArticle[] = [
  {
    id: "n1",
    title: "上海市工业和通信业能碳数智平台正式上线运行，助力高质量绿色低碳转型",
    category: "hot",
    source: "上海市节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-1",
    cover: news1,
    summary: "平台聚合全市能碳数据，构建一体化数智底座，助力工业绿色转型。",
    publishAt: "2026-04-23",
    pinned: true,
    status: "published",
    views: 1284,
    createdBy: "市级总账号",
    updatedAt: "2026-04-23 10:30",
    content: [
      "4月23日，由上海市经济和信息化委员会指导、上海市节能中心建设运营的「上海市工业和通信业能碳数智平台」正式上线运行。平台以全市规上工业企业能源与碳排放数据为基础，构建一体化的数智底座，为政府监管、企业服务、产业转型提供统一的数据支撑。",
      "平台围绕「数据归集 — 智能分析 — 业务联动」三大能力，已接入全市 16 个区、上百家重点用能单位的实时能耗与碳排放数据，覆盖电、热、气、水多种能源介质，并打通了能源审计、节能诊断、双控考核等核心业务流程。",
      "据介绍，平台首期上线了能碳全景看板、企业能效画像、双控指标跟踪、绿色制造服务、政策智能匹配等核心模块。下一步，平台将持续迭代 AI Agent 智能体集群，围绕碳盘查、CBAM 合规申报、绿电交易等场景为企业提供更精细化的智能服务。",
      "市经信委相关负责人表示，平台的上线标志着上海工业和通信业在数字化、智能化绿色转型上又迈出关键一步，将为完成「十四五」节能降碳目标、推动新型工业化高质量发展提供坚实支撑。",
    ],
  },
  {
    id: "n2",
    title: "市经信委召开 2026 年工业节能与综合利用工作座谈会",
    category: "hot",
    source: "上海市经信委",
    wechatUrl: "https://mp.weixin.qq.com/s/example-2",
    cover: news2,
    summary: "聚焦节能减排、综合利用与绿色制造体系建设，研究部署 2026 年重点任务。",
    publishAt: "2026-04-18",
    pinned: false,
    status: "published",
    views: 892,
    createdBy: "市级总账号",
    updatedAt: "2026-04-18 14:20",
    content: [
      "4月18日，上海市经济和信息化委员会在沪召开 2026 年工业节能与综合利用工作座谈会，全市 16 个区经信部门、重点行业协会以及部分龙头企业代表参加会议。",
      "会议系统总结了「十四五」以来全市工业节能与综合利用工作成效，单位工业增加值能耗、单位工业增加值二氧化碳排放等主要指标均提前完成阶段性目标。",
      "围绕 2026 年重点任务，会议明确将持续推进重点用能单位百千万行动、深化绿色制造体系建设、加快工业固废综合利用与再生资源循环利用、强化数据中心等新型基础设施能效管理。",
      "会议要求，各区要充分用好能碳数智平台等工具，强化精细化管理，推动政策、技术、服务协同发力，为上海高质量完成全年节能降碳目标提供有力保障。",
    ],
  },
  {
    id: "n3",
    title: "首批「能效领跑」示范企业名单正式发布",
    category: "notice",
    source: "上海市节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-3",
    cover: news3,
    summary: "覆盖钢铁、化工、电子等多个行业的能效领跑标杆企业名单出炉。",
    publishAt: "2026-04-15",
    pinned: false,
    status: "published",
    views: 643,
    createdBy: "市级总账号",
    updatedAt: "2026-04-15 09:00",
    content: [
      "近日，上海市节能中心组织开展的首批「能效领跑」示范企业评选结果正式发布，共有 32 家企业上榜，覆盖钢铁、化工、电子信息、汽车制造、生物医药等多个重点行业。",
      "评选以企业近三年单位产品能耗、能效水平、节能管理体系建设、技术改造投入等指标为核心，并结合现场核查与专家评审最终确定名单。",
      "入选企业普遍在工艺优化、余热余压利用、绿电替代、数字化能源管理等方面形成了一批可复制可推广的典型经验，将作为行业标杆向全市推广。",
      "下一步，市节能中心将组织能效领跑企业开展经验交流、行业培训和帮扶诊断，带动更多企业加快能效提升，推动上海工业加快迈向碳达峰目标。",
    ],
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
    content: [
      "宝钢股份近日正式对外发布《2025 年度绿色低碳发展报告》，这是钢铁行业首份将 ESG 与绿色低碳深度融合的综合性披露报告。",
      "报告显示，2025 年宝钢股份吨钢综合能耗、吨钢二氧化碳排放强度同比分别下降 3.8% 和 5.2%，主要污染物排放绩效继续保持行业领先水平。",
      "报告披露了宝钢在氢冶金、近终形制造、富氧燃烧、CCUS（碳捕集利用与封存）等关键低碳技术上的最新进展，并明确了 2030 年前碳达峰、2050 年前实现碳中和的路线图。",
      "宝钢股份表示，将持续以技术创新和数智化为驱动，携手上下游产业链共同打造世界级绿色低碳精品钢铁基地。",
    ],
  },
  {
    id: "n5",
    title: "关于开展2026年度重点用能单位能源审计工作的通知",
    category: "notice",
    source: "上海市经信委",
    wechatUrl: "https://mp.weixin.qq.com/s/example-5",
    cover: news2,
    summary: "请各重点用能单位按通知要求于6月30日前完成能源审计报告报送。",
    publishAt: "2026-04-08",
    pinned: true,
    status: "published",
    views: 1567,
    createdBy: "市级总账号",
    updatedAt: "2026-04-08 11:15",
    content: [
      "为贯彻落实国家和本市关于节能降碳的有关要求，进一步加强重点用能单位能源管理，市经信委决定组织开展 2026 年度重点用能单位能源审计工作。",
      "本次能源审计对象为本市年综合能耗 5000 吨标准煤及以上的工业和通信业重点用能单位。各单位应委托具备相应资质的第三方机构开展审计，并按规定模板编制能源审计报告。",
      "请各单位于 2026 年 6 月 30 日前，通过上海市工业和通信业能碳数智平台完成能源审计报告的在线报送，同步上传现场审计影像资料、用能设备清单等附件材料。",
      "市经信委将组织对报告质量进行抽查，对审计中发现的重大节能潜力点，将纳入年度节能技改项目支持范围。",
    ],
  },
  {
    id: "n6",
    title: "智能体集群助力企业 CBAM 合规申报",
    category: "hot",
    source: "上海市节能中心",
    wechatUrl: "https://mp.weixin.qq.com/s/example-6",
    cover: news3,
    summary: "AI Agent 协同帮助出口企业一键完成碳边境调节机制合规申报。",
    publishAt: "2026-04-05",
    pinned: false,
    status: "published",
    views: 256,
    createdBy: "市级总账号",
    updatedAt: "2026-04-05 18:30",
    content: [
      "面对欧盟碳边境调节机制（CBAM）正式进入征税过渡期，上海市节能中心联合多家技术伙伴推出基于 AI Agent 智能体集群的 CBAM 合规申报服务，已在多家钢铁、铝业、化肥出口企业试点应用。",
      "智能体集群通过「数据采集 Agent — 排放核算 Agent — 报告生成 Agent — 申报提交 Agent」的协同工作模式，可自动从企业 ERP、能源管理系统中归集生产与能耗数据，并按 CBAM 方法学完成隐含碳排放核算与报告生成。",
      "试点企业反馈，原本需要 2–3 周完成的 CBAM 季度申报工作，现在可在 1–2 个工作日内完成，且数据可追溯、可复核，显著降低了合规成本。",
      "下一步，平台将持续扩大智能体能力边界，覆盖绿电交易、绿色产品认证、ESG 报告等更多绿色合规场景。",
    ],
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
