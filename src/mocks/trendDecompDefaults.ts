// 趋势分解 - 默认参数
import type { DistrictInput } from "@/lib/trendDecomp";

// 注：与 assessOrgs.districtData 中的区一一对应
export const DEFAULT_DISTRICT_INPUTS: DistrictInput[] = [
  { id: "d1", name: "黄浦区", historical2025: 480, gdp: 3120, population: 65 },
  { id: "d2", name: "青浦区", historical2025: 720, gdp: 1410, population: 130 },
  { id: "d3", name: "嘉定区", historical2025: 1180, gdp: 2890, population: 185 },
  { id: "d4", name: "虹口区", historical2025: 360, gdp: 1080, population: 75 },
  { id: "d5", name: "长宁区", historical2025: 410, gdp: 1860, population: 70 },
  { id: "d6", name: "徐汇区", historical2025: 920, gdp: 2740, population: 110 },
];

export const DEFAULT_CITY_TOTAL = 8768; // 万吨 CO₂（2025 全市，与碳排测算保持一致）
export const DEFAULT_TARGET_YEAR = 2030;
export const DEFAULT_RESERVE_PCT = 0.03;
export const DEFAULT_INTENSITY_DROP = 0.12;
export const DEFAULT_COMPOSITE = { alpha: 0.5, beta: 0.3, gamma: 0.2 };
