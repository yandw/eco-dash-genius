// 考核管理 mock 数据
// 涵盖：碳排放目标分解（图1/4）+ 能耗双控考核（图3/4/5/图1企业自评）

export type DistrictId =
  | "qingpu" | "jiading" | "changning" | "xuhui" | "jingan" | "fengxian"
  | "jinshan" | "pudong" | "songjiang" | "putuo" | "minhang" | "huangpu"
  | "yangpu" | "hongkou" | "baoshan" | "chongming" | "center";

export interface DistrictMeta {
  id: DistrictId;
  name: string;
}

export const districts: DistrictMeta[] = [
  { id: "qingpu", name: "青浦区" },
  { id: "center", name: "节能中心" },
  { id: "jiading", name: "嘉定区" },
  { id: "changning", name: "长宁区" },
  { id: "xuhui", name: "徐汇区" },
  { id: "jingan", name: "静安区" },
  { id: "fengxian", name: "奉贤区" },
  { id: "jinshan", name: "金山区" },
  { id: "pudong", name: "浦东新区" },
  { id: "songjiang", name: "松江区" },
  { id: "putuo", name: "普陀区" },
  { id: "minhang", name: "闵行区" },
  { id: "huangpu", name: "黄浦区" },
  { id: "yangpu", name: "杨浦区" },
  { id: "hongkou", name: "虹口区" },
  { id: "baoshan", name: "宝山区" },
  { id: "chongming", name: "崇明区" },
];

export const districtCounts: Record<DistrictId, number> = {
  qingpu: 30, center: 20, jiading: 66, changning: 6, xuhui: 7, jingan: 3,
  fengxian: 57, jinshan: 60, pudong: 147, songjiang: 51, putuo: 3,
  minhang: 48, huangpu: 12, yangpu: 18, hongkou: 5, baoshan: 22, chongming: 9,
};

// ====================== 碳排放目标分解（图1/4） ======================

export interface ChangeRecord {
  field: string;
  oldValue: string | number | null;
  newValue: string | number | null;
  remark: string;
  by: string;
  at: string;
}

// 区下属企业碳排放目标分解（图1）
export interface CarbonGoalRow {
  id: string;
  districtId: DistrictId;
  creditCode: string;
  entName: string;
  // 2025 年碳排放数据
  total2025: number;
  intensity2025: number;
  // 推荐值（预留）
  recommendTotal: number | null;
  // 2026 年碳排放目标（企业填写）
  total2026: number | null;
  intensity2026: number | null;
  intensityIndicator: string;
  intensityUnit: string;
  remark: string;
  status: "draft" | "submitted" | "modified";
  changes: ChangeRecord[];
}

// 百千家通信业 (图4) — 字段对齐《2026年重点单位碳排放双控目标分解》
export interface BqGoalRow {
  id: string;
  districtName: string;            // 区名称
  creditCode: string;
  entName: string;
  // 2025 年碳排放数据
  total2025: number | null;        // 总量（吨CO2）
  intensity2025: number | null;    // 单位产值碳排放（吨CO2/万元）
  // 2026 年碳排放目标
  recommendTotal: number | null;   // 总量推荐值（万吨CO2）
  totalGoal: number | null;        // 总量目标值（万吨CO2）
  intensityGoal: number | null;    // 强度目标值
  intensityIndicator: string;      // 强度指标
  intensityUnit: string;           // 强度单位
  remark: string;
  status: "draft" | "submitted" | "modified";
  changes: ChangeRecord[];
}

const _qpEnts = [
  ["91310118MA1H1Q5R8K", "宏茂微电子（上海）有限公司", 30706, 0.238],
  ["91310118MA1H2N3T2P", "上海金发科技发展有限公司", 22004, 0.061],
  ["91310118MA1H3D5K9X", "上海晶盟硅材料有限公司", 23330, 0.221],
  ["91310118MA1H7T2Q1L", "上海璀绰信息技术有限公司", 0, 0],
  ["91310118MA1H8B5N6Z", "上海美蓓亚精密机电有限公司", 22943, 0.093],
  ["91310118MA1H9C2X3R", "上海青谊路建新材料科技有限公司", 19670, 1.130],
  ["91310118MA1HA1L4K7", "好丽友食品(上海)有限公司", 14470, 0.120],
  ["91310118MA1HB2M5J9", "英威达特种纤维(上海)有限公司", 15288, 0.198],
  ["91310118MA1HC3N6H8", "上海协和氨基酸有限公司", 15016, 0.300],
  ["91310118MA1HD4P7G6", "上海腾讯信息技术有限公司", 0, 0],
  ["91310118MA1HE5Q8F5", "希悦尔(中国)有限公司", 11933, 0.143],
  ["91310118MA1HF6R9E4", "尤妮佳生活用品(中国)有限公司", 11850, 0.036],
  ["91310118MA1HG7S1D3", "上海征世科技股份有限公司", 10531, 1.550],
  ["91310118MA1HH8T2C2", "纳峰真空镀膜（上海）有限公司", 11688, 0.334],
  ["91310118MA1HJ9U3B1", "上好佳(中国)有限公司", 11443, 0.150],
  ["91310118MA1HK1V4A0", "上海浔兴拉链制造有限公司", 6280, 0.161],
  ["91310118MA1HL2W5Z9", "杜邦特种材料（上海）有限公司", 8528, 0.175],
  ["91310118MA1HM3X6Y8", "上海青浦自来水有限公司", 8388, 0.289],
  ["91310118MA1HN4Y7X7", "上海华电福新能源有限公司", 18354, 0.583],
] as const;

export const carbonGoals: CarbonGoalRow[] = _qpEnts.map(([code, name, t, i], idx) => {
  const total2026 = t > 0 ? Math.round(t * 0.95) : null;
  const intensity2026 = i > 0 ? Number((i * 0.93).toFixed(3)) : null;
  const isModified = idx === 2 || idx === 6;
  return {
    id: `cg-qp-${idx + 1}`,
    districtId: "qingpu",
    creditCode: code as string,
    entName: name as string,
    total2025: t as number,
    intensity2025: i as number,
    recommendTotal: t > 0 ? Math.round((t as number) * 0.94) : null,
    total2026,
    intensity2026,
    intensityIndicator: "单位产值碳排放",
    intensityUnit: "吨CO2/万元",
    remark: t === 0 ? "属于非工企业，由区发改委管理" : "",
    status: isModified ? "modified" : (idx % 4 === 0 ? "draft" : "submitted"),
    changes: isModified
      ? [
          {
            field: "total2026",
            oldValue: total2026,
            newValue: total2026 ? Math.round(total2026 * 0.97) : null,
            remark: "根据区年度减排任务调整下达指标",
            by: "青浦区管理员",
            at: "2026-03-15 10:24",
          },
        ]
      : [],
  };
});

// 把第3和第7条的 total2026 同步替换为修改后的"新值"
carbonGoals.forEach((r) => {
  r.changes.forEach((c) => {
    (r as unknown as Record<string, unknown>)[c.field] = c.newValue;
  });
});

// 百千家 mock（图4）
// 百千家 mock — [区名称, 信用代码, 企业名称, 2025总量(吨CO2), 2025单位产值碳排放(吨CO2/万元), 2026总量目标(万吨CO2), 强度目标值, 强度指标, 强度单位]
const _bqRaw: Array<[string, string, string, number | null, number | null, number | null, number | null, string, string]> = [
  ["徐汇区", "91310000631501258R", "东方有线网络有限公司", 27124, 0.001, 2.58, 0.0009, "单位信息流量能耗", "吨CO2/万TB"],
  ["静安区", "91310115671143758E", "中国电信股份有限公司上海分公司", 455000, 0.109, 43.20, 0.103, "单位电信业务总量能耗", "吨CO2/万元"],
  ["静安区", "91310115X073202692", "中国联合网络通信有限公司上海市分公司", 250000, 0.161, 23.75, 0.153, "单位电信业务总量能耗", "吨CO2/万元"],
  ["浦东新区", "91310000132149237G", "中国移动通信集团上海有限公司", 461402, 115.770, 43.83, 110.00, "单位电信业务量综合能耗", "千克CO2/万元"],
  ["金山区", "91310112132284914U", "上海华谊能源化工有限公司", null, null, null, null, "", ""],
  ["金山区", "91310000607200180E", "上海氯碱化工股份有限公司", 562500, 1.42, 53.40, 1.35, "单位产值碳排放", "吨CO2/万元"],
  ["黄浦区", "91310101132224671B", "国网上海市电力公司", 1780000, 0.036, 169.10, 0.034, "线损碳排放强度", "%"],
  ["宝山区", "91310000631696382C", "宝山钢铁股份有限公司", 11768500, 1.93, 1118.00, 1.83, "吨钢碳排放", "吨CO2/吨钢"],
  ["宝山区", "91310113132230684W", "宝武碳业科技股份有限公司", 950000, 2.10, 90.25, 2.00, "单位产值碳排放", "吨CO2/万元"],
  ["浦东新区", "91310000MA1K38CF47", "中国石化上海高桥石油化工有限公司", 1700000, 0.85, 161.50, 0.81, "单位产值碳排放", "吨CO2/万元"],
  ["金山区", "91310000132212291W", "中国石化上海石油化工股份有限公司", 5160000, 0.92, 490.20, 0.87, "单位产值碳排放", "吨CO2/万元"],
  ["金山区", "913100007109365242", "科思创聚合物（中国）有限公司", 700000, 0.78, 66.50, 0.74, "单位产值碳排放", "吨CO2/万元"],
  ["金山区", "913100007109384740", "上海赛科石油化工有限责任公司", 550000, 0.81, 52.25, 0.77, "单位产值碳排放", "吨CO2/万元"],
];

export const bqGoals: BqGoalRow[] = _bqRaw.map(([dist, code, name, t25, i25, tg, ig, ind, unit], idx) => ({
  id: `bq-${idx + 1}`,
  districtName: dist,
  creditCode: code,
  entName: name,
  total2025: t25,
  intensity2025: i25,
  recommendTotal: tg !== null ? Number((tg * 0.99).toFixed(2)) : null,
  totalGoal: tg,
  intensityGoal: ig,
  intensityIndicator: ind,
  intensityUnit: unit,
  remark: tg === null ? "已关停" : "",
  status: "submitted",
  changes: [],
}));

// ====================== 双控考核 · 能耗（图1企业自评 / 图3-5考评） ======================

export interface EnergyAssessRow {
  id: string;
  districtId: DistrictId;
  creditCode: string;
  entName: string;
  // 能耗总量目标完成情况（吨标准煤）
  totalGoal: number;
  totalActual: number;
  totalActualNetGreen: number;     // 扣除绿电绿证可再生能源后的能耗总量
  // 能耗强度
  intensityGoal: number;
  intensityActual: number;
  intensityActualNetGreen: number;
  intensityIndicator: string;
  intensityUnit: string;
  // 人工字段
  resultOverride?: "完成" | "未完成";
  resultOverrideRemark?: string;
  remark: string;
}

// 与 carbonGoals 对应（同一批企业，能耗考核）— 数据参照图5
const _qpAssess: Array<[number, number, number, number, number, number]> = [
  [30706, 35488, 35488, 0.238, 0.177, 0.177],
  [22004, 31761, 31761, 0.061, 0.068, 0.068],
  [23330, 27785, 23928, 0.221, 0.223, 0.192],
  [0,     29730, 29730, 0,     4.574, 0],
  [22943, 22988, 22062, 0.093, 0.096, 0.092],
  [19670, 17115, 17115, 1.130, 0.965, 1.217],
  [14470, 17224, 16324, 0.120, 0.123, 0.116],
  [15288, 15231, 15231, 0.198, 0.163, 0.163],
  [15016, 13480, 12134, 0.300, 0.304, 0.273],
  [0,     21338, 6172,  0,     0.161, 0],
  [11933, 13676, 11839, 0.143, 0.138, 0.119],
  [11850, 10765, 8465,  0.036, 0.051, 0.040],
  [10531, 7087,  7087,  1.550, 1.573, 1.574],
];

export const energyAssess: EnergyAssessRow[] = _qpAssess.map((row, idx) => {
  const ent = _qpEnts[idx];
  return {
    id: `ea-qp-${idx + 1}`,
    districtId: "qingpu",
    creditCode: ent[0] as string,
    entName: ent[1] as string,
    totalGoal: row[0],
    totalActual: row[1],
    totalActualNetGreen: row[2],
    intensityGoal: row[3],
    intensityActual: row[4],
    intensityActualNetGreen: row[5],
    intensityIndicator: "单位产值能耗",
    intensityUnit: "吨标准煤/万元",
    remark: "",
  };
});

// 自动判定函数
export function passByValue(goal: number, actual: number): "达标" | "未达标" | "—" {
  if (!goal || goal === 0) return "—";
  return actual <= goal ? "达标" : "未达标";
}

export function dualResult(row: EnergyAssessRow): "完成" | "未完成" | "—" {
  const t = passByValue(row.totalGoal, row.totalActualNetGreen);
  const i = passByValue(row.intensityGoal, row.intensityActualNetGreen);
  if (t === "—" || i === "—") return "—";
  return t === "达标" && i === "达标" ? "完成" : "未完成";
}

// 企业自评（图1）— 取本企业最近三年
export interface EntAssessYearRow {
  year: number;
  totalGoal: number;
  totalActual: number;
  totalActualNetGreen: number;
  totalPass: "达标" | "未达标" | "—";
  intensityIndicator: string;
  intensityUnit: string;
  intensityGoal: number;
  intensityActual: number;
  intensityActualNetGreen: number;
  intensityPass: "达标" | "未达标" | "—";
  dualPass: "完成" | "未完成" | "—";
  assessResult: "完成" | "未完成" | "—";
  remark: string;
}

export function getEntAssess(entId: string): EntAssessYearRow[] {
  // 取第一条作为"测试企业"
  const base = energyAssess.find((r) => r.id === entId) ?? energyAssess[0];
  const years = [2024, 2025, 2026];
  return years.map((y, i) => {
    const factor = 1 - i * 0.03;
    const totalActual = Math.round(base.totalActual * factor);
    const totalActualNet = Math.round(base.totalActualNetGreen * factor);
    const intensityActual = Number((base.intensityActual * factor).toFixed(3));
    const intensityActualNet = Number((base.intensityActualNetGreen * factor).toFixed(3));
    const totalPass = passByValue(base.totalGoal, totalActualNet);
    const intensityPass = passByValue(base.intensityGoal, intensityActualNet);
    const dualPass: "完成" | "未完成" | "—" =
      totalPass === "—" || intensityPass === "—"
        ? "—"
        : totalPass === "达标" && intensityPass === "达标"
          ? "完成"
          : "未完成";
    // 演示破例：2024 年双控未完成，但考核结果完成（需在备注中说明原因）
    const isException = y === 2024;
    const assessResult: "完成" | "未完成" | "—" = isException ? "完成" : dualPass;
    const remark = isException
      ? "因企业新增重点产能项目经主管部门核定，准予本年度考核通过"
      : i === 1
        ? "完成全年节能任务"
        : "";
    return {
      year: y,
      totalGoal: base.totalGoal,
      totalActual,
      totalActualNetGreen: totalActualNet,
      totalPass,
      intensityIndicator: base.intensityIndicator,
      intensityUnit: base.intensityUnit,
      intensityGoal: base.intensityGoal,
      intensityActual,
      intensityActualNetGreen: intensityActualNet,
      intensityPass,
      dualPass: isException ? "未完成" : dualPass,
      assessResult,
      remark,
    };
  });
}

// 区级考评列表状态
export interface DistrictAssessSummary {
  districtId: DistrictId;
  name: string;
  count: number;
  status: "待考核" | "考核中" | "已考核" | "完成考核";
  assessTime: string | null;
  hasStampedDoc: boolean;
}

export const districtAssessSummary: DistrictAssessSummary[] = districts.map((d) => {
  const status: "待考核" | "考核中" | "已考核" | "完成考核" =
    d.id === "qingpu" ? "考核中" : d.id === "jiading" || d.id === "xuhui" ? "完成考核" : "待考核";
  return {
    districtId: d.id,
    name: d.name,
    count: districtCounts[d.id],
    status,
    assessTime: status === "完成考核" ? "2026-03-20" : null,
    hasStampedDoc: status === "完成考核",
  };
});

// 区级目标分解列表（图3）
export interface DistrictGoalSummary {
  districtId: DistrictId;
  name: string;
  count: number;
  status: "未开始" | "进行中" | "已完成";
}

export const districtGoalSummary: DistrictGoalSummary[] = districts.map((d) => ({
  districtId: d.id,
  name: d.name,
  count: districtCounts[d.id],
  status: d.id === "putuo" || d.id === "chongming" ? "进行中" : "已完成",
}));

// ====================== 百千家·通信业 企业能耗考核（市级管理员） ======================

export interface BqEntAssessReportFile {
  name: string;
  url: string;
  uploadedAt: string;
}

export interface BqEntAssessRow {
  id: string;
  year: number;
  entName: string;
  selfScore: number;
  totalScore: number;
  status: "已完成" | "考核中" | "待考核" | "待提交" | "已提交";
  reportFile?: BqEntAssessReportFile;
}

const _bqEntNames: Array<[string, number, number]> = [
  ["东方有线网络有限公司", 70, 71],
  ["中国电信股份有限公司上海分公司", 82, 76],
  ["中国联合网络通信有限公司上海市分公司", 75, 76],
  ["中国移动通信集团上海有限公司", 94, 81],
  ["上海华谊能源化工有限公司", 70, 64],
  ["上海氯碱化工股份有限公司", 89, 87],
  ["国网上海市电力公司", 100, 83],
  ["远纺工业（上海）有限公司", 66, 67],
  ["宝山钢铁股份有限公司", 98, 77],
  ["宝武碳业科技股份有限公司", 98, 76],
  ["中国石化上海高桥石油化工有限公司", 81, 73],
  ["中国石化上海石油化工股份有限公司", 92, 86],
  ["科思创聚合物（中国）有限公司", 77, 76],
  ["上海赛科石油化工有限责任公司", 95, 93],
];

export const bqEntAssessList: BqEntAssessRow[] = _bqEntNames.map(([name, self, total], idx) => ({
  id: `bqea-${idx + 1}`,
  year: 2024,
  entName: name,
  selfScore: self,
  totalScore: total,
  status: idx === 0 ? "待提交" : "已完成",
  reportFile: idx === 6 ? { name: "国网上海市电力公司2024考核报告.pdf", url: "#", uploadedAt: "2025-01-15" } : undefined,
}));

// 评分明细行
export interface BqAssessDetailRow {
  no: string;
  groupName?: string;        // 顶层指标分组（用于合并行）
  groupScore?: number;       // 分组分值
  itemScore: number;         // 单项分值
  criterion: string;         // 评分标准
  selfScore: number;
  selfBasis: string;
  proofs: { name: string; url: string }[];
  reviewScore: number;
  reviewBasis: string;
}

export const bqAssessDetail: BqAssessDetailRow[] = [
  // 1. 能耗总量和强度目标 (30)
  { no: "1.1", groupName: "能耗总量和强度目标", groupScore: 30, itemScore: 15,
    criterion: "能耗总量目标完成情况：以《上海市经济信息化委关于下达2024年规上工业和通信业节能目标的通知》（沪经信节〔2024〕463号）为准，依据市统计局统计数据进行考核。完成2024年总量控制目标的，得15分；总量超过控制目标的10%以内，得10分；总量超过控制目标的10%以上，不得分。",
    selfScore: 15, selfBasis: "2024年能耗总量（等价值…",
    proofs: [{ name: "东方有线网络有限公司2024能源利用状况报告（年报）-已盖章.pdf", url: "#" }],
    reviewScore: 15, reviewBasis: "2024年能耗总量（等价…" },
  { no: "1.2", itemScore: 15,
    criterion: "能耗强度目标完成情况：以《上海市经济信息化委关于下达2024年规上工业和通信业节能目标的通知》（沪经信节〔2024〕463号）为准，依据市统计局统计数据进行考核。除国网上海市电力公司外，其他企业完成能耗强度控制目标的，得15分；未完成目标但能耗强度同比下降的，得10分；能耗强度同比未有下降的，不得分。国网上海市电力公司产品单耗完成目标的，得15分；未完成目标的，不得分。",
    selfScore: 15, selfBasis: "2024年强度目标类型为吨…",
    proofs: [{ name: "东方有线网络有限公司2024能源利用状况报告（年报）-已盖章.pdf", url: "#" }],
    reviewScore: 15, reviewBasis: "2024年单位电信业务总…" },

  // 2. 节能管理制度落实情况 (30)
  { no: "2.1", groupName: "节能管理制度落实情况", groupScore: 30, itemScore: 4,
    criterion: "建立节能工作组织保障体系情况：设有节能工作领导小组，单位主要领导担任负责人的，得1分；设有能源管理岗位，聘有能源管理负责人并报备案的，得1分；设有能源管理机构，并有能源计量、统计、审计等能源管理岗位并报备案的，得1分；设有节能监察机构，并有专人负责的，得1分。",
    selfScore: 4, selfBasis: "1、东方有线节能减排领…",
    proofs: [{ name: "东方有线节能减排领导和工作小组组织架构图&岗位备案表（已盖章）.pdf", url: "#" }],
    reviewScore: 4, reviewBasis: "设有工作领导小组、能…" },
  { no: "2.2", itemScore: 2,
    criterion: "节能目标责任制建立情况：建立节能目标责任制，并合理分解目标，落实到相应层级或岗位的，得1分；定期组织内部考核的，得1分。",
    selfScore: 2, selfBasis: "1、东方有线能源管理办…",
    proofs: [{ name: "节能目标责任制相关附件（已盖章）.pdf", url: "#" }],
    reviewScore: 2, reviewBasis: "建立并落实能源管理制…" },
  { no: "2.3", itemScore: 4,
    criterion: "制定并实施年度节能计划和节能措施的，得1分；有建立能源管理制度的，得1分；有建立能源统计管理制度的，得1分；有建立能源计量管理制度的，得1分。",
    selfScore: 4, selfBasis: "1、东方有线能源管理办…",
    proofs: [{ name: "年度节能计划和措施相关附件（已盖章）.pdf", url: "#" }],
    reviewScore: 4, reviewBasis: "证明材料中有制定年度…" },
  { no: "2.4", itemScore: 2,
    criterion: "节能奖惩制度建立情况。制定节能奖惩制度办法的，得1分；有落实节能奖惩制度的，得1分。",
    selfScore: 1, selfBasis: "东方有线能源管理办法",
    proofs: [{ name: "东方有线能源管理办法（已盖章）.pdf", url: "#" }],
    reviewScore: 1, reviewBasis: "制定节能奖惩制度" },
  { no: "2.5", itemScore: 3,
    criterion: "落实固定资产投资项目节能审查制度情况：提供企业2024年固定资产投资项目台账的，得1分；台账中项目均落实节能审查制度的，得1分；完全落实节能审查意见的，得1分。",
    selfScore: 3, selfBasis: "2024年度不涉及固定资产…",
    proofs: [],
    reviewScore: 3, reviewBasis: "未涉及" },
  { no: "2.6", itemScore: 6,
    criterion: "落实高耗能设备淘汰工作情况：企业按时上报高耗能落后淘汰年报季报的，得2分；企业在2024年度已完成全部高耗能落后设备淘汰工作的，得4分。",
    selfScore: 2, selfBasis: "企业落后机电设备（产…",
    proofs: [{ name: "（产品）、工艺自查淘汰计划表（东方有线2024年第4季度）241231-提交版（已盖章）.pdf", url: "#" }],
    reviewScore: 3, reviewBasis: "中心数据，按时上报，…" },
  { no: "2.7", itemScore: 2,
    criterion: "能源利用状况报告上报情况：以市节能中心统计数据为准，按时上报2024年能源利用状况报告的，得2分。",
    selfScore: 2, selfBasis: "东方有线网络有限公司20…",
    proofs: [{ name: "东方有线网络有限公司2024能源利用状况报告（年报）-已盖章.pdf", url: "#" }],
    reviewScore: 2, reviewBasis: "中心数据，按时上报" },
  { no: "2.8", itemScore: 5,
    criterion: "2024年节能月报上报情况：以市节能中心统计数据为准，2024年节能月报上报率达到100%的，得5分；上报率达到90%及以上的，得3分；上报率达到80%及以上的，得2分；未达到80%的，不得分。",
    selfScore: 5, selfBasis: "2024年节能月报上报率10…",
    proofs: [{ name: "2024年节能月报上报率100%-平台截图（已盖章）.pdf", url: "#" }],
    reviewScore: 5, reviewBasis: "中心数据，按时上报" },
  { no: "2.9", itemScore: 2,
    criterion: "能源管理体系建设情况：开展能源管理体系评价工作的，得1分；已取得能源管理体系认证的，得2分。",
    selfScore: 1, selfBasis: "东方有线能源管理办法",
    proofs: [{ name: "东方有线能源管理办法（已盖章）.pdf", url: "#" }],
    reviewScore: 0, reviewBasis: "无相关证明材料" },

  // 3. 节能重点工作落实情况 (40)
  { no: "3.1", groupName: "节能重点工作落实情况", groupScore: 40, itemScore: 10,
    criterion: '在"十四五"期间开展能源审计工作的，得2分；未开展的，不得分；能源审计中列入的节能技改措施已开展实施的，得6分；未开展的，不得分；开展节能技改采用合同能源方式的，得2分。',
    selfScore: 8, selfBasis: "1、东方有线十四五能源…",
    proofs: [{ name: "能源审计相关附件（已盖章）-压缩版.pdf", url: "#" }],
    reviewScore: 8, reviewBasis: "正在进行能源审计，无…" },
  { no: "3.2", itemScore: 6,
    criterion: "落实节能降碳改造实施方案，累计完成十四五节能量目标80%（含）以上得6分,70%（含）-80%得4分，60%（含）-70%得2分，60%以下不得分。",
    selfScore: 6, selfBasis: "", proofs: [], reviewScore: 6, reviewBasis: "" },
  { no: "3.3", itemScore: 6,
    criterion: '行业能效水平对标情况，能效优于标杆水平的，得4分；达到基准水平的，得2分；低于基准水平的，不得分；入选上海市能效"领跑者"名单的，得2分。',
    selfScore: 6, selfBasis: "通信业无标杆水平和基准…",
    proofs: [], reviewScore: 4, reviewBasis: "不涉及能效对标，未入…" },
  { no: "3.4", itemScore: 4,
    criterion: "开展绿色工厂、绿色产品、绿色供应链、零碳工厂等相关创建工作的，得2分；获得国家或本市绿色制造示范单位荣誉的，得2分。",
    selfScore: 0, selfBasis: "", proofs: [], reviewScore: 0, reviewBasis: "" },
  { no: "3.5", itemScore: 6,
    criterion: "分布式光伏发电及其它新能源：推动企业分布式光伏发电及其它新能源应用，得2分；企业可利用的建筑屋顶光伏安装比例达到50%及以上的，得4分。",
    selfScore: 0, selfBasis: "", proofs: [], reviewScore: 0, reviewBasis: "" },
  { no: "3.6", itemScore: 4,
    criterion: "清洁生产审核开展情况：开展清洁生产审核的，得2分；完成清洁生产项目改造验收的，得2分。",
    selfScore: 4, selfBasis: "", proofs: [], reviewScore: 4, reviewBasis: "不涉及" },
  { no: "3.7", itemScore: 2,
    criterion: "应用国家和本市推广的节能、环保、节水、绿色技术产品的，得2分。",
    selfScore: 2, selfBasis: "2023年通信机房绿色改造…",
    proofs: [{ name: "2023年通信机房绿色改造典型案例-证书（已盖章）.pdf", url: "#" }],
    reviewScore: 2, reviewBasis: "证书" },
  { no: "3.8", itemScore: 2,
    criterion: "推进碳管理工作：围绕产品碳足迹评价与碳标签、数字化碳管理平台、碳管理体系、供应链碳管理、碳标准建设及应用、碳金融产品创新、低碳技术产品示范应用等七大领域积极推荐申报工业碳管理试点项目的，得2分。",
    selfScore: 2, selfBasis: "", proofs: [], reviewScore: 2, reviewBasis: "" },
];
