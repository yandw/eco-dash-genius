// 节能档案 mock 数据 — 同时供企业侧填报和政府侧审核使用

export type ArchiveStatus = "draft" | "submitted" | "approved" | "rejected" | "pending";

export const ArchiveStatusLabel: Record<ArchiveStatus, string> = {
  draft: "草稿",
  submitted: "待审核",
  approved: "已通过",
  rejected: "已退回",
  pending: "待填报",
};

export const ARCHIVE_STEPS = [
  { key: "basic", title: "基本信息", desc: "重点用能单位基础情况、能源消费" },
  { key: "products", title: "主要产品情况", desc: "产品产能、产量、单位综合能耗" },
  { key: "equipments", title: "主要用能设备情况", desc: "系统自动同步、无需重复填报" },
  { key: "audits", title: "实施能源审计或能效诊断", desc: "审计 / 诊断时间、内容、建议、附件" },
  { key: "projects", title: "节能降碳改造和设备更新计划", desc: "正在实施和计划项目" },
] as const;

export type StepKey = typeof ARCHIVE_STEPS[number]["key"];

export interface AuditTimelineItem {
  time: string;
  actor: string;
  action: string;
  comment?: string;
  type: "info" | "success" | "danger" | "warn";
}

export interface FieldAnnotationItem {
  step: StepKey;
  field: string;
  comment: string;
  by: string;
  at: string;
}

export interface ProductRow {
  name: string;
  capacity: string;
  output: string;
  unit: string;
  energyUnit: string;
  energyValue: string;
  benchmark: string;
  level: "领跑" | "标杆" | "基准" | "未达标";
  industry: string;
}

export interface EquipmentRow {
  name: string;
  model: string;
  qty: number;
  years: number;
  level: "一级" | "二级" | "三级" | "未定级";
}

export type AuditKind = "audit" | "diagnose";

export interface AuditRow {
  id: string;
  kind: AuditKind;
  date: string;
  content: string;
  suggestion: string;
  fileName: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  unit: string;
  type: "新建" | "改造" | "更新";
  location: string;
  content: string;
  invest: string;
  duration: string;
  approval: string;
  energyApproval: string;
  envApproval: string;
  land: string;
}

export interface ArchiveDetail {
  basic: {
    enterpriseName: string;
    creditCode: string;
    province: string;
    industry: string;
    code: string;
    location: string;
    contact: string;
    annualEnergy: string;
    coal: string;
    rawEnergy: string;
    electricity: string;
    greenPower: string;
    output: string;
    addedValue: string;
  };
  products: ProductRow[];
  equipments: EquipmentRow[];
  audits: AuditRow[];
  projects: ProjectRow[];
  // 完成度（手填项）
  completed: Record<StepKey, boolean>;
}

export interface ArchiveYear {
  year: number;
  status: ArchiveStatus;
  createdAt: string;
  updatedAt: string;
  reviewer?: string;
  reviewAt?: string;
  rejectReason?: string;
  timeline: AuditTimelineItem[];
  annotations: FieldAnnotationItem[];
  detail: ArchiveDetail;
}

export interface EnterpriseArchive {
  id: string;
  name: string;
  creditCode: string;
  industry: string;
  district: string;
  years: ArchiveYear[];
}

const baseDetail = (year: number, withData = true): ArchiveDetail => ({
  basic: {
    enterpriseName: "测试企业",
    creditCode: "910100100101010",
    province: "上海市",
    industry: "食品制造业",
    code: "123456",
    location: "上海市浦东新区张江路 88 号",
    contact: "张工 13800001234",
    annualEnergy: withData ? "1.887427" : "",
    coal: "0",
    rawEnergy: "0",
    electricity: withData ? "5463.79" : "",
    greenPower: "0",
    output: withData ? "42.4259" : "",
    addedValue: withData ? "12.86" : "",
  },
  products: [
    {
      name: "速冻调理食品",
      capacity: "5.0 万吨/年",
      output: "4.6 万吨",
      unit: "吨",
      energyUnit: "kgce/吨",
      energyValue: "82.4",
      benchmark: "GB 32034-2015",
      level: "标杆",
      industry: "食品制造业",
    },
    {
      name: "冷冻烘焙制品",
      capacity: "1.2 万吨/年",
      output: "0.95 万吨",
      unit: "吨",
      energyUnit: "kgce/吨",
      energyValue: "146.0",
      benchmark: "GB 32034-2015",
      level: "基准",
      industry: "食品制造业",
    },
  ],
  equipments: [
    { name: "螺杆式冷水机组", model: "RWB II 480", qty: 4, years: 6, level: "一级" },
    { name: "工业锅炉", model: "WNS6-1.25-Y(Q)", qty: 2, years: 9, level: "二级" },
    { name: "空压机", model: "GA75 VSD+", qty: 3, years: 4, level: "一级" },
  ],
  audits: withData
    ? [
        {
          id: `aud-${year}-1`,
          kind: "audit",
          date: `${year}-08-01`,
          content: "对全厂电力、热力、冷量进行能源审计",
          suggestion: "建议优化冷库温度控制策略，回收锅炉烟气余热",
          fileName: `${year}年度能源审计报告.pdf`,
        },
        {
          id: `aud-${year}-2`,
          kind: "audit",
          date: `${year}-07-02`,
          content: "供配电系统专项能源审计",
          suggestion: "更换老旧变压器，优化无功补偿配置",
          fileName: `${year}年度供配电审计报告.pdf`,
        },
        {
          id: `dia-${year}-1`,
          kind: "diagnose",
          date: `${year}-07-09`,
          content: "压缩空气系统能效诊断",
          suggestion: "调整空压机加卸载策略，新增热回收装置",
          fileName: `${year}年度压空诊断报告.pdf`,
        },
        {
          id: `dia-${year}-2`,
          kind: "diagnose",
          date: `${year}-07-10`,
          content: "锅炉房能效诊断",
          suggestion: "升级燃烧器，加装烟气余热回收",
          fileName: `${year}年度锅炉诊断报告.pdf`,
        },
      ]
    : [],
  projects: withData
    ? [
        {
          id: `proj-${year}-1`,
          name: "冷库改造及节能降碳项目",
          unit: "测试企业",
          type: "改造",
          location: "上海市浦东新区张江路 88 号",
          content: "更换氨制冷机组、变频改造、保温层升级",
          invest: "0.42",
          duration: `${year}-06 至 ${year + 1}-12`,
          approval: "沪发改备〔2024〕118号",
          energyApproval: "免于能评",
          envApproval: "环评登记表",
          land: "存量用地",
        },
      ]
    : [],
  completed: {
    basic: true,
    products: true,
    equipments: true,
    audits: withData,
    projects: withData,
  },
});

const buildTimeline = (status: ArchiveStatus, year: number): AuditTimelineItem[] => {
  const items: AuditTimelineItem[] = [
    { time: `${year + 1}-01-15 09:12`, actor: "测试企业 · 张工", action: "创建年度档案", type: "info" },
    { time: `${year + 1}-02-08 17:30`, actor: "测试企业 · 张工", action: "保存草稿（基本信息）", type: "info" },
  ];
  if (status !== "draft") {
    items.push({
      time: `${year + 1}-03-05 10:22`,
      actor: "测试企业 · 张工",
      action: "提交审核",
      type: "info",
    });
  }
  if (status === "approved") {
    items.push({
      time: `${year + 1}-03-12 14:08`,
      actor: "经信委 · 中心管理员",
      action: "审核通过",
      comment: "材料齐全，能耗及对标信息无异常",
      type: "success",
    });
  }
  if (status === "rejected") {
    items.push({
      time: `${year + 1}-03-12 14:08`,
      actor: "经信委 · 中心管理员",
      action: "审核退回",
      comment: "①能源管理岗位人员联系方式缺失；②主要产品综合能耗与历年差异较大，请复核",
      type: "danger",
    });
  }
  return items;
};

export const enterprises: EnterpriseArchive[] = [
  {
    id: "ent-001",
    name: "测试企业",
    creditCode: "910100100101010",
    industry: "食品制造业",
    district: "浦东新区",
    years: [
      {
        year: 2025,
        status: "pending",
        createdAt: "2026-01-01 00:00",
        updatedAt: "-",
        timeline: [],
        annotations: [],
        detail: baseDetail(2025, false),
      },
      {
        year: 2024,
        status: "rejected",
        createdAt: "2025-01-15 09:12",
        updatedAt: "2025-03-12 14:08",
        reviewer: "中心管理员",
        reviewAt: "2025-03-12 14:08",
        rejectReason: "①岗位负责人联系方式缺失 ②产品综合能耗波动较大",
        timeline: buildTimeline("rejected", 2024),
        annotations: [
          {
            step: "basic",
            field: "能源管理岗位人员及联系方式",
            comment: "联系电话格式不正确，请补充岗位负责人手机号",
            by: "中心管理员",
            at: "2025-03-12 14:05",
          },
          {
            step: "products",
            field: "速冻调理食品 单位产品综合能耗",
            comment: "本年 82.4 较去年下降 12%，请说明节能措施依据",
            by: "中心管理员",
            at: "2025-03-12 14:06",
          },
        ],
        detail: baseDetail(2024),
      },
      {
        year: 2023,
        status: "approved",
        createdAt: "2024-01-10 10:14",
        updatedAt: "2024-03-22 16:40",
        reviewer: "中心管理员",
        reviewAt: "2024-03-22 16:40",
        timeline: buildTimeline("approved", 2023),
        annotations: [],
        detail: baseDetail(2023),
      },
    ],
  },
  {
    id: "ent-002",
    name: "上海绿能新材料有限公司",
    creditCode: "91310000778929080B",
    industry: "新材料制造",
    district: "金山区",
    years: [
      {
        year: 2024,
        status: "submitted",
        createdAt: "2025-02-02 11:00",
        updatedAt: "2025-03-08 10:22",
        timeline: buildTimeline("submitted", 2024),
        annotations: [],
        detail: baseDetail(2024),
      },
      { year: 2023, status: "approved", createdAt: "2024-01-20", updatedAt: "2024-04-01", timeline: buildTimeline("approved", 2023), annotations: [], detail: baseDetail(2023) },
    ],
  },
  {
    id: "ent-003",
    name: "上海三井化学功能复合塑料有限公司",
    creditCode: "91310000054561567R",
    industry: "化工",
    district: "宝山区",
    years: [
      { year: 2024, status: "pending", createdAt: "-", updatedAt: "-", timeline: [], annotations: [], detail: baseDetail(2024, false) },
      { year: 2023, status: "approved", createdAt: "2024-01-09", updatedAt: "2024-03-30", timeline: buildTimeline("approved", 2023), annotations: [], detail: baseDetail(2023) },
    ],
  },
  {
    id: "ent-004",
    name: "上海一胜百模具技术有限公司",
    creditCode: "91310000607335000",
    industry: "装备制造",
    district: "嘉定区",
    years: [
      { year: 2024, status: "approved", createdAt: "2025-01-12", updatedAt: "2025-02-28", timeline: buildTimeline("approved", 2024), annotations: [], detail: baseDetail(2024) },
      { year: 2023, status: "approved", createdAt: "2024-01-08", updatedAt: "2024-03-18", timeline: buildTimeline("approved", 2023), annotations: [], detail: baseDetail(2023) },
    ],
  },
  {
    id: "ent-005",
    name: "上海三菱电梯有限公司",
    creditCode: "91310000740575221B",
    industry: "装备制造",
    district: "闵行区",
    years: [
      { year: 2024, status: "submitted", createdAt: "2025-02-15", updatedAt: "2025-03-09", timeline: buildTimeline("submitted", 2024), annotations: [], detail: baseDetail(2024) },
      { year: 2023, status: "approved", createdAt: "2024-01-11", updatedAt: "2024-03-25", timeline: buildTimeline("approved", 2023), annotations: [], detail: baseDetail(2023) },
    ],
  },
  {
    id: "ent-006",
    name: "ABB高压电机有限公司",
    creditCode: "91310115607350808W",
    industry: "装备制造",
    district: "浦东新区",
    years: [
      { year: 2024, status: "rejected", createdAt: "2025-01-30", updatedAt: "2025-03-11", timeline: buildTimeline("rejected", 2024), annotations: [], detail: baseDetail(2024) },
      { year: 2023, status: "approved", createdAt: "2024-01-15", updatedAt: "2024-03-20", timeline: buildTimeline("approved", 2023), annotations: [], detail: baseDetail(2023) },
    ],
  },
];

// 当前登录企业（企业侧）
export const CURRENT_ENT_ID = "ent-001";

export const findEnterprise = (id: string) => enterprises.find((e) => e.id === id);
export const findYear = (ent: EnterpriseArchive | undefined, year: number) =>
  ent?.years.find((y) => y.year === year);
