// 趋势分解 - 默认参数
import type { DistrictInput } from "@/lib/trendDecomp";

// 注：与 assessOrgs.districtData 中的区一一对应
export const DEFAULT_DISTRICT_INPUTS: DistrictInput[] = [
  { id: "d1", name: "黄浦区", historical2025: 480, gdp: 3120, energy: 210 },
  { id: "d2", name: "青浦区", historical2025: 720, gdp: 1410, energy: 320 },
  { id: "d3", name: "嘉定区", historical2025: 1180, gdp: 2890, energy: 530 },
  { id: "d4", name: "虹口区", historical2025: 360, gdp: 1080, energy: 160 },
  { id: "d5", name: "长宁区", historical2025: 410, gdp: 1860, energy: 180 },
  { id: "d6", name: "徐汇区", historical2025: 920, gdp: 2740, energy: 410 },
];

export const DEFAULT_CITY_TOTAL = 8768; // 万吨 CO₂（2025 全市基数）
export const DEFAULT_BASE_YEAR = 2025;
export const DEFAULT_TARGET_YEAR = 2030;
export const DEFAULT_RESERVE_PCT = 0.03;
export const DEFAULT_INTENSITY_DROP = 0.12;
export const DEFAULT_COMPOSITE = { alpha: 0.5, beta: 0.3, gamma: 0.2 };

// 逐年模式：默认 2026-2030 等比下降到 2030 年 -12%
export const DEFAULT_YEAR_TARGETS: { year: number; totalQuota: number }[] = (() => {
  const endRate = 0.88;
  const years = [2026, 2027, 2028, 2029, 2030];
  return years.map((y, i) => {
    const t = (i + 1) / years.length;
    const factor = 1 + (endRate - 1) * t;
    return { year: y, totalQuota: +(DEFAULT_CITY_TOTAL * factor).toFixed(0) };
  });
})();
