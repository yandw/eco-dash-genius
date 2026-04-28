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

// 百千家通信业 (图4)
export interface BqGoalRow {
  id: string;
  creditCode: string;
  entName: string;
  totalGoal: number | null;        // 能耗总量目标 -> 这里改为碳排放总量目标（万吨CO2）
  intensityGoal: number | null;    // 强度目标值
  intensityIndicator: string;
  intensityUnit: string;
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
const _bqRaw = [
  ["91310000631501258R", "东方有线网络有限公司", 27124, 0.001, "单位信息流量能耗", "吨标准煤/万TB"],
  ["91310115671143758E", "中国电信股份有限公司上海分公司", 455000, 0.109, "单位电信业务总量能耗", "吨标准煤/万元"],
  ["91310115X073202692", "中国联合网络通信有限公司上海市分公司", 250000, 0.161, "单位电信业务总量能耗", "吨标准煤/万元"],
  ["91310000132149237G", "中国移动通信集团上海有限公司", 461402, 115.770, "单位电信业务量综合能耗", "千克标煤/万元"],
  ["91310112132284914U", "上海华谊能源化工有限公司", null, null, "", ""],
  ["91310000607200180E", "上海氯碱化工股份有限公司", 56.25, -14, "产值能耗增减率", "%"],
  ["91310101132224671B", "国网上海市电力公司", 178, 3.6, "线损率", "%"],
  ["91310000631696382C", "宝山钢铁股份有限公司", 1176.85, -15, "产值能耗增减率", "%"],
  ["91310113132230684W", "宝武碳业科技股份有限公司", 95, -14, "产值能耗增减率", "%"],
  ["91310000MA1K38CF47", "中国石化上海高桥石油化工有限公司", 170, -15, "产值能耗增减率", "%"],
  ["91310000132212291W", "中国石化上海石油化工股份有限公司", 516, -15, "产值能耗增减率", "%"],
  ["913100007109365242", "科思创聚合物（中国）有限公司", 70, -14, "产值能耗增减率", "%"],
  ["913100007109384740", "上海赛科石油化工有限责任公司", 55, -15, "产值能耗增减率", "%"],
] as const;

export const bqGoals: BqGoalRow[] = _bqRaw.map(([code, name, t, i, ind, unit], idx) => ({
  id: `bq-${idx + 1}`,
  creditCode: code as string,
  entName: name as string,
  totalGoal: t as number | null,
  intensityGoal: i as number | null,
  intensityIndicator: ind as string,
  intensityUnit: unit as string,
  remark: t === null ? "已关停" : "",
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
    return {
      year: y,
      totalGoal: base.totalGoal,
      totalActual,
      totalActualNetGreen: totalActualNet,
      totalPass: passByValue(base.totalGoal, totalActualNet),
      intensityIndicator: base.intensityIndicator,
      intensityUnit: base.intensityUnit,
      intensityGoal: base.intensityGoal,
      intensityActual,
      intensityActualNetGreen: intensityActualNet,
      intensityPass: passByValue(base.intensityGoal, intensityActualNet),
      remark: i === 1 ? "完成全年节能任务" : "",
    };
  });
}

// 区级考评列表状态
export interface DistrictAssessSummary {
  districtId: DistrictId;
  name: string;
  count: number;
  status: "待考核" | "考核中" | "已考核";
  assessTime: string | null;
  hasStampedDoc: boolean;
}

export const districtAssessSummary: DistrictAssessSummary[] = districts.map((d) => {
  const status: "待考核" | "考核中" | "已考核" =
    d.id === "qingpu" ? "考核中" : d.id === "jiading" || d.id === "xuhui" ? "已考核" : "待考核";
  return {
    districtId: d.id,
    name: d.name,
    count: districtCounts[d.id],
    status,
    assessTime: status === "已考核" ? "2026-03-20" : null,
    hasStampedDoc: status === "已考核",
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
