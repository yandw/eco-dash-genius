// 双控测算 - 行业默认值占位
// TODO: 排放因子与缺省值待从档案/字典模块同步

export type IndustryKey = "fossil" | "steel" | "power" | "other";

export const INDUSTRY_LABEL: Record<IndustryKey, string> = {
  fossil: "化工",
  steel: "钢铁",
  power: "电力",
  other: "工业其它",
};

export interface FuelOption {
  value: string;
  label: string;
  unit: string; // 默认计量单位，如 t / 万Nm³
  // 缺省值（待同步）
  ncv?: number; // 低位发热量
  cc?: number; // 单位热值含碳量 tC/GJ
  ox?: number; // 碳氧化率 %
}

// 各行业燃料候选（先空，待接入）
export const FUEL_OPTIONS_BY_INDUSTRY: Record<IndustryKey, FuelOption[]> = {
  fossil: [],
  steel: [],
  power: [],
  other: [],
};

export interface ElecHeatOption {
  value: string;
  label: string;
  unit: string;
  factor?: number; // CO₂ 排放因子
}

// 范围二 候选（电力/热力）
export const HEAT_ELEC_OPTIONS: ElecHeatOption[] = [
  { value: "electricity", label: "电力", unit: "MWh" },
  { value: "heat", label: "热力", unit: "GJ" },
];

export type DataSource = "default" | "measured";

export const DATA_SOURCE_LABEL: Record<DataSource, string> = {
  default: "缺省值",
  measured: "自测值",
};
