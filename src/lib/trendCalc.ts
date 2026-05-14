// 十五五趋势测算公式（与 Excel 一致）
// B = 单位工业增加值能耗/碳排下降率（预设，负值）
// C = 工业增加值同比（预设）
// D = 工业增加值5年累计 = (1+C)^5 - 1
// E = 5年能耗/碳排增长率
// F = 2025基数；G = 2030预测值；H = 增加量

export const accumulate5y = (c: number) => Math.pow(1 + c, 5) - 1;
export const annualize5y = (e: number) => Math.pow(1 + e, 1 / 5) - 1;

// 增量测算：已知 B、C、F，算 D、E、G、H
export function calcIncrement(b: number, c: number, f: number) {
  const d = accumulate5y(c);
  const e = (1 + b) * (1 + d) - 1;
  const g = f * (1 + e);
  const h = g - f;
  return { d, e, g, h };
}

// 能耗强度测算：已知 C、E，算 D、F(年均增速)、G(5年单位增加值能耗下降率)
export function calcEnergyIntensity(c: number, e: number) {
  const d = accumulate5y(c);
  const fAnnual = annualize5y(e);
  const g = (1 + e) / (1 + d) - 1;
  return { d, fAnnual, g };
}

// 碳排放强度测算：已知 C、E，算 D、F(5年碳排强度下降率)
export function calcCarbonIntensity(c: number, e: number) {
  const d = accumulate5y(c);
  const f = (1 + e) / (1 + d) - 1;
  return { d, f };
}

// 25→30 年逐年推演（按复合年增速）
export function projectYearly(base: number, total5yGrowth: number) {
  const annual = annualize5y(total5yGrowth);
  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  return years.map((y, i) => ({ year: y, value: base * Math.pow(1 + annual, i) }));
}
