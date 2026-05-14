// 十五五趋势测算 - 默认情景与基数（来自上传 Excel）

export const ENERGY_BASE_2025 = 3972.46; // 万吨标煤，来源：市统计局
export const CARBON_BASE_2025 = 8768; // 万吨CO2，来源：年报企业汇总

export type IncrementScenario = { id: string; b: number; c: number };
export type IntensityScenario = { id: string; c: number; e: number };

export const energyIncrementDefaults: IncrementScenario[] = [
  { id: "ei-1", b: -0.10, c: 0.0530 },
  { id: "ei-2", b: -0.11, c: 0.0533 },
  { id: "ei-3", b: -0.12, c: 0.0533 },
  { id: "ei-4", b: -0.13, c: 0.0533 },
];

export const carbonIncrementDefaults: IncrementScenario[] = [
  { id: "ci-1", b: -0.150, c: 0.0533 },
  { id: "ci-2", b: -0.160, c: 0.0533 },
  { id: "ci-3", b: -0.170, c: 0.0533 },
  { id: "ci-4", b: -0.175, c: 0.0533 },
];

export const energyIntensityDefaults: IntensityScenario[] = [
  { id: "en-1", c: 0.0533, e: 0.13 },
  { id: "en-2", c: 0.0533, e: 0.14 },
  { id: "en-3", c: 0.0533, e: 0.15 },
  { id: "en-4", c: 0.0533, e: 0.155 },
  { id: "en-5", c: 0.0533, e: 0.16 },
  { id: "en-6", c: 0.0533, e: 0.17 },
];

export const carbonIntensityDefaults: IntensityScenario[] = [
  { id: "cn-1", c: 0.0533, e: 0.03 },
  { id: "cn-2", c: 0.0533, e: 0.04 },
  { id: "cn-3", c: 0.0533, e: 0.05 },
  { id: "cn-4", c: 0.0533, e: 0.06 },
  { id: "cn-5", c: 0.0533, e: 0.07 },
  { id: "cn-6", c: 0.0533, e: 0.075 },
  { id: "cn-7", c: 0.0533, e: 0.08 },
  { id: "cn-8", c: 0.0533, e: 0.09 },
];
