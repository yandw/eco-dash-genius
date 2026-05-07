// 考核任务管理 mock store
import { useSyncExternalStore } from "react";

export type AssessTaskType =
  | "区下属单位碳排放目标分解"
  | "\"百家\"、\"千家\"、通信业企业碳排放目标分解"
  | "区下属单位能耗考核"
  | "\"百家\"、\"千家\"、通信业企业能耗考核";

export type AssessTaskStatus = "未开始" | "进行中" | "已结束" | "已归档";

export interface AssessTaskEnterprise {
  name: string;
  creditCode: string;
  district?: string;
}

export interface AssessTask {
  id: string;
  year: number;
  type: AssessTaskType;
  startDate: string;
  endDate: string;
  status: AssessTaskStatus;
  createdAt: string;
  enterprises: AssessTaskEnterprise[];
  enterpriseFileName?: string;
}

/** 该类型的企业名单是否包含「区名称」列 */
export function taskHasDistrictColumn(t: AssessTaskType): boolean {
  return t !== "\"百家\"、\"千家\"、通信业企业能耗考核";
}

const DISTRICTS = [
  "浦东新区", "徐汇区", "黄浦区", "静安区", "长宁区",
  "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区",
  "嘉定区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区",
];

function pickDistrict(i: number) {
  return DISTRICTS[i % DISTRICTS.length];
}

const seed: AssessTask[] = [
  {
    id: "task-001",
    year: 2025,
    type: "区下属单位碳排放目标分解",
    startDate: "2025-01-15",
    endDate: "2025-02-28",
    status: "已结束",
    createdAt: "2025-01-10",
    enterpriseFileName: "2025年区下属单位碳排放目标分解.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A", district: "浦东新区" },
      { name: "上海华谊新材料有限公司", creditCode: "91310120MA1H7K8L0B", district: "金山区" },
      { name: "上海石化股份有限公司", creditCode: "91310116132267588C", district: "金山区" },
    ],
  },
  {
    id: "task-002",
    year: 2025,
    type: "\"百家\"、\"千家\"、通信业企业碳排放目标分解",
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    status: "进行中",
    createdAt: "2025-02-25",
    enterpriseFileName: "2025年百千通碳排放目标.xlsx",
    enterprises: [
      { name: "宝山钢铁股份有限公司", creditCode: "9131000063139428XL", district: "宝山区" },
      { name: "上海赛科石油化工有限责任公司", creditCode: "913101177322854110", district: "奉贤区" },
    ],
  },
  {
    id: "task-003",
    year: 2025,
    type: "\"百家\"、\"千家\"、通信业企业能耗考核",
    startDate: "2025-05-10",
    endDate: "2025-06-30",
    status: "未开始",
    createdAt: "2025-05-01",
    enterpriseFileName: "2025年百千通能耗考核.xlsx",
    enterprises: [
      { name: "上海华谊新材料有限公司", creditCode: "91310120MA1H7K8L0B" },
      { name: "上海石化股份有限公司", creditCode: "91310116132267588C" },
      { name: "中芯国际集成电路制造（上海）有限公司", creditCode: "91310120631696294K" },
      { name: "上海大众汽车有限公司", creditCode: "91310000132200821J" },
    ],
  },
  {
    id: "task-004",
    year: 2024,
    type: "区下属单位碳排放目标分解",
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    status: "已归档",
    createdAt: "2024-01-15",
    enterpriseFileName: "2024年区下属单位碳排放目标分解.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A", district: "浦东新区" },
    ],
  },
  {
    id: "task-005",
    year: 2024,
    type: "区下属单位能耗考核",
    startDate: "2024-03-05",
    endDate: "2024-05-10",
    status: "已归档",
    createdAt: "2024-02-28",
    enterpriseFileName: "2024年区下属单位能耗考核.xlsx",
    enterprises: [
      { name: "宝山钢铁股份有限公司", creditCode: "9131000063139428XL", district: "宝山区" },
      { name: "上海赛科石油化工有限责任公司", creditCode: "913101177322854110", district: "奉贤区" },
    ],
  },
  {
    id: "task-006",
    year: 2026,
    type: "区下属单位能耗考核",
    startDate: "2026-01-10",
    endDate: "2026-02-28",
    status: "未开始",
    createdAt: "2025-12-20",
    enterpriseFileName: "2026年区下属单位能耗考核.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A", district: "浦东新区" },
      { name: "上海华谊新材料有限公司", creditCode: "91310120MA1H7K8L0B", district: "金山区" },
    ],
  },
];

let data: AssessTask[] = [...seed];
let snapshot: AssessTask[] = [...data];
const listeners = new Set<() => void>();

function emit() {
  snapshot = [...data];
  listeners.forEach((l) => l());
}

export function useAssessTasksStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
    () => snapshot,
  );
}

export function listTasks(): AssessTask[] {
  return snapshot;
}

export function createTask(t: Omit<AssessTask, "id" | "createdAt">) {
  const id = `task-${String(Date.now()).slice(-6)}`;
  data = [
    { ...t, id, createdAt: new Date().toISOString().slice(0, 10) },
    ...data,
  ];
  emit();
}

export function updateTask(id: string, patch: Partial<AssessTask>) {
  data = data.map((x) => (x.id === id ? { ...x, ...patch } : x));
  emit();
}

export function deleteTask(id: string) {
  data = data.filter((x) => x.id !== id);
  emit();
}

/** 模拟生成示例企业名单（按类型决定是否带区名称） */
export function buildMockEnterprises(type: AssessTaskType, count: number): AssessTaskEnterprise[] {
  const withDistrict = taskHasDistrictColumn(type);
  return Array.from({ length: count }).map((_, i) => ({
    name: `示例企业 ${i + 1}`,
    creditCode: `91310000${String(100000000 + i).slice(0, 9)}X`,
    ...(withDistrict ? { district: pickDistrict(i) } : {}),
  }));
}

// 模板定义：不同类型对应不同表头
export const TASK_TEMPLATES: Record<AssessTaskType, { fileName: string; headers: string[] }> = {
  "区下属单位碳排放目标分解": {
    fileName: "区下属单位碳排放目标分解-企业名单模板.csv",
    headers: ["区名称", "统一社会信用代码", "企业名称", "上年碳排放(tCO2)", "目标降幅(%)"],
  },
  "\"百家\"、\"千家\"、通信业企业碳排放目标分解": {
    fileName: "百家千家通信业-碳排放目标分解-企业名单模板.csv",
    headers: ["区名称", "统一社会信用代码", "企业名称", "上年碳排放(tCO2)", "目标降幅(%)"],
  },
  "区下属单位能耗考核": {
    fileName: "区下属单位能耗考核-企业名单模板.csv",
    headers: ["区名称", "统一社会信用代码", "企业名称", "综合能耗(tce)", "节能目标完成率(%)"],
  },
  "\"百家\"、\"千家\"、通信业企业能耗考核": {
    fileName: "百家千家通信业-能耗考核-企业名单模板.csv",
    headers: ["统一社会信用代码", "企业名称", "综合能耗(tce)", "节能目标完成率(%)"],
  },
};
