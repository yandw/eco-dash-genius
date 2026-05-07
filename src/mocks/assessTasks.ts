// 考核任务管理 mock store
import { useSyncExternalStore } from "react";

export type AssessTaskType = "目标分解" | "双控考核" | "碳排放考核";
export type AssessTaskStatus = "未开始" | "进行中" | "已结束" | "已归档";

export interface AssessTaskEnterprise {
  name: string;
  creditCode: string;
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

const seed: AssessTask[] = [
  {
    id: "task-001",
    year: 2025,
    type: "目标分解",
    startDate: "2025-01-15",
    endDate: "2025-02-28",
    status: "已结束",
    createdAt: "2025-01-10",
    enterpriseFileName: "2025年目标分解企业名单.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A" },
      { name: "上海华谊新材料有限公司", creditCode: "91310120MA1H7K8L0B" },
      { name: "上海石化股份有限公司", creditCode: "91310116132267588C" },
    ],
  },
  {
    id: "task-002",
    year: 2025,
    type: "双控考核",
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    status: "进行中",
    createdAt: "2025-02-25",
    enterpriseFileName: "2025年双控考核名单.xlsx",
    enterprises: [
      { name: "宝山钢铁股份有限公司", creditCode: "9131000063139428XL" },
      { name: "上海赛科石油化工有限责任公司", creditCode: "913101177322854110" },
    ],
  },
  {
    id: "task-003",
    year: 2025,
    type: "碳排放考核",
    startDate: "2025-05-10",
    endDate: "2025-06-30",
    status: "未开始",
    createdAt: "2025-05-01",
    enterpriseFileName: "碳排放重点单位.xlsx",
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
    type: "目标分解",
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    status: "已归档",
    createdAt: "2024-01-15",
    enterpriseFileName: "2024年目标分解.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A" },
    ],
  },
  {
    id: "task-005",
    year: 2024,
    type: "双控考核",
    startDate: "2024-03-05",
    endDate: "2024-05-10",
    status: "已归档",
    createdAt: "2024-02-28",
    enterpriseFileName: "2024年双控.xlsx",
    enterprises: [
      { name: "宝山钢铁股份有限公司", creditCode: "9131000063139428XL" },
      { name: "上海赛科石油化工有限责任公司", creditCode: "913101177322854110" },
    ],
  },
  {
    id: "task-006",
    year: 2026,
    type: "目标分解",
    startDate: "2026-01-10",
    endDate: "2026-02-28",
    status: "未开始",
    createdAt: "2025-12-20",
    enterpriseFileName: "2026年候选名单.xlsx",
    enterprises: [
      { name: "宏茂微电子（上海）有限公司", creditCode: "91310118MA1K3X4Y2A" },
      { name: "上海华谊新材料有限公司", creditCode: "91310120MA1H7K8L0B" },
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

// 模板定义：不同类型对应不同表头
export const TASK_TEMPLATES: Record<AssessTaskType, { fileName: string; headers: string[] }> = {
  目标分解: {
    fileName: "目标分解-企业名单模板.csv",
    headers: ["企业名称", "统一社会信用代码", "区/集团", "上年综合能耗(tce)", "上年碳排放(tCO2)", "目标降幅(%)"],
  },
  双控考核: {
    fileName: "双控考核-企业名单模板.csv",
    headers: ["企业名称", "统一社会信用代码", "综合能耗(tce)", "单位增加值能耗", "节能目标完成率(%)"],
  },
  碳排放考核: {
    fileName: "碳排放考核-企业名单模板.csv",
    headers: ["企业名称", "统一社会信用代码", "碳排放总量(tCO2)", "碳排放强度(tCO2/万元)", "减排目标(%)"],
  },
};
