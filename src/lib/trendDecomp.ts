// 碳排放目标按区分解算法
export type DecompAlgo = "historical" | "gdp" | "intensity" | "composite";

export interface DistrictInput {
  id: string;
  name: string;
  historical2025: number; // 万吨 CO₂
  gdp: number; // 亿元
  energy: number; // 万吨标煤（能耗总量）
  locked?: boolean;
  lockValue?: number; // 万吨（终点年锁定）
}

export interface DecompResult {
  id: string;
  name: string;
  weight: number; // 0~1
  allocation: number; // 万吨
  share: number; // 0~1
  deltaVsHist: number; // 同比 2025 增减（万吨，负数=下降）
  deltaPct: number; // 同比百分比
  locked: boolean;
}

export interface DecompOptions {
  algo: DecompAlgo;
  totalQuota: number; // 可分解总量（已扣除预留）
  intensityDropRate?: number; // 强度递减法用
  alpha?: number; // 历史权重 0~1
  beta?: number; // GDP 权重 0~1
  gamma?: number; // 能耗权重 0~1
}

const safeDiv = (a: number, b: number) => (b > 0 ? a / b : 0);

function rawWeights(rows: DistrictInput[], opts: DecompOptions): number[] {
  const sumH = rows.reduce((s, r) => s + r.historical2025, 0);
  const sumG = rows.reduce((s, r) => s + r.gdp, 0);
  const sumE = rows.reduce((s, r) => s + r.energy, 0);

  switch (opts.algo) {
    case "historical":
      return rows.map((r) => safeDiv(r.historical2025, sumH));
    case "gdp":
      return rows.map((r) => safeDiv(r.gdp, sumG));
    case "intensity": {
      const drop = opts.intensityDropRate ?? 0.12;
      const raw = rows.map((r) => r.historical2025 * (1 - drop));
      const sum = raw.reduce((s, v) => s + v, 0);
      return raw.map((v) => safeDiv(v, sum));
    }
    case "composite": {
      const a = opts.alpha ?? 0.5;
      const b = opts.beta ?? 0.3;
      const g = opts.gamma ?? 0.2;
      const total = a + b + g || 1;
      const na = a / total, nb = b / total, ng = g / total;
      return rows.map((r) =>
        na * safeDiv(r.historical2025, sumH) +
        nb * safeDiv(r.gdp, sumG) +
        ng * safeDiv(r.energy, sumE),
      );
    }
  }
}

export function decompose(rows: DistrictInput[], opts: DecompOptions): DecompResult[] {
  const weights = rawWeights(rows, opts);

  const lockedSum = rows.reduce((s, r) => s + (r.locked ? (r.lockValue ?? 0) : 0), 0);
  const remain = Math.max(0, opts.totalQuota - lockedSum);
  const unlockedWeightSum = rows.reduce(
    (s, r, i) => s + (r.locked ? 0 : weights[i]),
    0,
  );

  const allocs = rows.map((r, i) => {
    if (r.locked) return r.lockValue ?? 0;
    if (unlockedWeightSum <= 0) return 0;
    return remain * (weights[i] / unlockedWeightSum);
  });

  const totalAlloc = allocs.reduce((s, v) => s + v, 0) || 1;

  return rows.map((r, i) => {
    const alloc = allocs[i];
    const delta = alloc - r.historical2025;
    return {
      id: r.id,
      name: r.name,
      weight: weights[i],
      allocation: alloc,
      share: alloc / totalAlloc,
      deltaVsHist: delta,
      deltaPct: safeDiv(delta, r.historical2025),
      locked: !!r.locked,
    };
  });
}

// 逐年分解：对每个年度独立计算分配
// 锁定值视为「终点年锁定」，中间年按 2025 历史 → 终点锁定值线性插值
export interface YearDecomp {
  year: number;
  totalQuota: number; // 该年全市总量目标
  allocatable: number; // 扣除储备后可分解额度
  results: DecompResult[];
}

export function decomposeMultiYear(
  rows: DistrictInput[],
  yearTargets: { year: number; totalQuota: number }[], // 升序
  baseYear: number,
  reservePct: number,
  opts: Omit<DecompOptions, "totalQuota">,
): YearDecomp[] {
  const endYear = yearTargets[yearTargets.length - 1].year;
  const span = Math.max(1, endYear - baseYear);

  return yearTargets.map(({ year, totalQuota }) => {
    const allocatable = Math.max(0, totalQuota * (1 - reservePct));
    // 中间年：将终点锁定值按线性插值
    const yearRows: DistrictInput[] = rows.map((r) => {
      if (!r.locked || r.lockValue == null) return r;
      const t = (year - baseYear) / span;
      const interp = r.historical2025 + (r.lockValue - r.historical2025) * t;
      return { ...r, lockValue: interp };
    });
    const results = decompose(yearRows, { ...opts, totalQuota: allocatable });
    return { year, totalQuota, allocatable, results };
  });
}

export const ALGO_LABEL: Record<DecompAlgo, string> = {
  historical: "历史排放权重法",
  gdp: "GDP 贡献权重法",
  intensity: "强度递减法",
  composite: "多因子综合法",
};

export const ALGO_FORMULA: Record<DecompAlgo, string> = {
  historical: "Aᵢ = Q × (Hᵢ / ΣH)　（Hᵢ：区 i 的 2025 历史排放）",
  gdp: "Aᵢ = Q × (Gᵢ / ΣG)　（Gᵢ：区 i 的 GDP）",
  intensity: "Aᵢ = Q × [Hᵢ(1−r)] / Σ[Hᵢ(1−r)]　（r：统一下降率）",
  composite: "Aᵢ = Q × [α·Hᵢ/ΣH + β·Gᵢ/ΣG + γ·Eᵢ/ΣE]　（E：能耗总量；α+β+γ 自动归一）",
};
