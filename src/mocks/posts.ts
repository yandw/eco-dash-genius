// 岗位备案数据模型与 mock

export type FilingStatus = "complete" | "partial" | "empty";

export interface BasicInfo {
  creditCode: string;
  name: string;
  industry: string;
  park: string;
  energyLevel: string;
  isWanjia: boolean;
  statName: string;
  statPhone: string;
  capital: string;
  registerDate: string;
  legalRep: string;
  fax: string;
  postalCode: string;
  district: string;
  address: string;
  county: string;
  group: string;
}

export interface LeaderInfo {
  name: string;
  duty: string;
  title: string;
  phone: string;
  email: string;
}

export interface OwnerInfo {
  name: string;
  department: string;
  duty: string;
  title: string;
  major: string;
  education: string;
  hasCert: boolean;
  certDate: string;
  certNo: string;
  phone: string;
  email: string;
  filingDate: string;
  experience: string;
}

export interface FilingFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  hireDate: string;
  techTitle: string;
  hasCert: boolean;
  certNo: string;
  phone: string;
}

export interface PostFiling {
  leader: LeaderInfo;
  owner: OwnerInfo;
  files: FilingFile[];
  staff: StaffMember[];
  updatedAt: string;
}

export interface EnterprisePostData {
  id: string;
  basic: BasicInfo;
  energy: PostFiling;
  carbon: PostFiling;
}

const emptyLeader = (): LeaderInfo => ({ name: "", duty: "", title: "", phone: "", email: "" });
const emptyOwner = (): OwnerInfo => ({
  name: "", department: "", duty: "", title: "", major: "", education: "",
  hasCert: false, certDate: "", certNo: "", phone: "", email: "", filingDate: "", experience: "",
});

export const currentEnterprise: EnterprisePostData = {
  id: "ENT-001",
  basic: {
    creditCode: "91310000XXXXXXX123",
    name: "上海某某新材料股份有限公司",
    industry: "化工原料制造（C26）",
    park: "张江高科技园区",
    energyLevel: "重点用能企业（万吨标煤以上）",
    isWanjia: true,
    statName: "刘文彬",
    statPhone: "021-58889999",
    capital: "58000",
    registerDate: "2008-06-15",
    legalRep: "李建国",
    fax: "021-58889988",
    postalCode: "201203",
    district: "浦东新区（上海市）",
    address: "浦东新区张江路 188 号",
    county: "浦东新区",
    group: "某某控股集团",
  },
  energy: {
    leader: {
      name: "王志强", duty: "副总经理", title: "高级工程师",
      phone: "13800138001", email: "wang@example.com",
    },
    owner: {
      name: "张建国", department: "能源管理部", duty: "能源管理负责人",
      title: "高级工程师", major: "能源动力工程", education: "硕士",
      hasCert: true, certDate: "2021-06-12", certNo: "EM-2021-00321",
      phone: "13900139001", email: "zhang@example.com",
      filingDate: "2024-07-12",
      experience: "从事能源管理工作 12 年，主导完成 ISO 50001 体系建设、节能技改 3 项，累计节能 4500 吨标煤。",
    },
    files: [
      { id: "f1", name: "能源管理岗位备案表.pdf", size: "2.3 MB", uploadedAt: "2024-07-12 10:21" },
      { id: "f2", name: "负责人证书扫描件.pdf", size: "0.8 MB", uploadedAt: "2024-07-12 10:23" },
    ],
    staff: [
      { id: "s1", name: "李文博", role: "能源管理员", hireDate: "2024-03-08", techTitle: "工程师", hasCert: true, certNo: "EM-2022-01187", phone: "13800138002" },
      { id: "s2", name: "王晓敏", role: "能源计量员", hireDate: "2024-09-21", techTitle: "助理工程师", hasCert: true, certNo: "EC-2023-00942", phone: "13800138003" },
      { id: "s3", name: "陈思远", role: "能源数据填报员", hireDate: "2024-11-02", techTitle: "助理工程师", hasCert: false, certNo: "—", phone: "13800138004" },
    ],
    updatedAt: "2024-07-12 10:25",
  },
  carbon: {
    leader: emptyLeader(),
    owner: { ...emptyOwner(), certDate: "2025-03-18" },
    files: [
      { id: "c1", name: "碳排放管理岗位备案表 (草稿).pdf", size: "1.1 MB", uploadedAt: "2025-03-15 15:40" },
    ],
    staff: [],
    updatedAt: "2025-03-15 15:40",
  },
};

// 政府侧 - 全部企业列表
export interface EnterpriseListItem {
  id: string;
  name: string;
  county: string;
  industry: string;
  energyStatus: FilingStatus;
  carbonStatus: FilingStatus;
  staffCount: number;
  updatedAt: string;
  expiringCerts: number;
}

export const enterpriseList: EnterpriseListItem[] = [
  { id: "ENT-001", name: "上海某某新材料股份有限公司", county: "浦东新区", industry: "化工原料制造", energyStatus: "complete", carbonStatus: "partial", staffCount: 8, updatedAt: "2024-07-12", expiringCerts: 1 },
  { id: "ENT-002", name: "上海宝山钢铁集团有限公司", county: "宝山区", industry: "黑色金属冶炼", energyStatus: "complete", carbonStatus: "complete", staffCount: 14, updatedAt: "2024-09-08", expiringCerts: 0 },
  { id: "ENT-003", name: "上海金桥纺织印染厂", county: "金山区", industry: "纺织印染", energyStatus: "partial", carbonStatus: "empty", staffCount: 4, updatedAt: "2024-05-21", expiringCerts: 2 },
  { id: "ENT-004", name: "上海临港数据中心", county: "浦东新区", industry: "互联网与数据服务", energyStatus: "complete", carbonStatus: "complete", staffCount: 6, updatedAt: "2024-11-30", expiringCerts: 0 },
  { id: "ENT-005", name: "上海奉贤水泥有限公司", county: "奉贤区", industry: "水泥制造", energyStatus: "empty", carbonStatus: "empty", staffCount: 0, updatedAt: "—", expiringCerts: 0 },
  { id: "ENT-006", name: "上海闵行精密制造有限公司", county: "闵行区", industry: "通用设备制造", energyStatus: "complete", carbonStatus: "partial", staffCount: 5, updatedAt: "2024-08-14", expiringCerts: 1 },
  { id: "ENT-007", name: "上海嘉定汽车配件公司", county: "嘉定区", industry: "汽车零部件", energyStatus: "partial", carbonStatus: "partial", staffCount: 3, updatedAt: "2024-04-02", expiringCerts: 0 },
  { id: "ENT-008", name: "上海松江电子科技股份", county: "松江区", industry: "电子元器件", energyStatus: "complete", carbonStatus: "complete", staffCount: 9, updatedAt: "2024-12-15", expiringCerts: 0 },
];

export const govStats = {
  total: enterpriseList.length,
  complete: enterpriseList.filter(e => e.energyStatus === "complete" && e.carbonStatus === "complete").length,
  partial: enterpriseList.filter(e => (e.energyStatus !== "empty" || e.carbonStatus !== "empty") && !(e.energyStatus === "complete" && e.carbonStatus === "complete")).length,
  empty: enterpriseList.filter(e => e.energyStatus === "empty" && e.carbonStatus === "empty").length,
  expiring: enterpriseList.reduce((sum, e) => sum + e.expiringCerts, 0),
};

export function getEnterpriseById(id: string): EnterprisePostData {
  // mock：所有企业都用同一份详情数据，但替换名称
  const item = enterpriseList.find(e => e.id === id);
  if (!item) return currentEnterprise;
  return {
    ...currentEnterprise,
    id: item.id,
    basic: { ...currentEnterprise.basic, name: item.name, county: item.county, district: `${item.county}（上海市）` },
  };
}
