import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { PieChart as PieIcon, RotateCcw, Download, Save, Lock, Unlock, AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isCityAdmin } from "@/mocks/currentUser";
import {
  ALGO_FORMULA,
  ALGO_LABEL,
  decompose,
  type DecompAlgo,
  type DistrictInput,
} from "@/lib/trendDecomp";
import {
  DEFAULT_BASE_YEAR,
  DEFAULT_CITY_TOTAL,
  DEFAULT_COMPOSITE,
  DEFAULT_DISTRICT_INPUTS,
  DEFAULT_INTENSITY_DROP,
  DEFAULT_RESERVE_PCT,
  DEFAULT_TARGET_YEAR,
} from "@/mocks/trendDecompDefaults";
import { toast } from "sonner";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--accent))",
  "hsl(var(--info, var(--primary)))",
  "hsl(var(--destructive))",
];

const TARGET_YEARS = [2026, 2027, 2028, 2029, 2030];

const fmt = (n: number, d = 1) =>
  n.toLocaleString("zh-CN", { maximumFractionDigits: d, minimumFractionDigits: d });
const fmtPct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;

export default function AssessTrendDecomp() {
  if (!isCityAdmin()) return <Navigate to="/gov/assess/goal" replace />;

  const [targetYear, setTargetYear] = useState<number>(DEFAULT_TARGET_YEAR);
  const [totalQuotaInput, setTotalQuotaInput] = useState<number>(DEFAULT_CITY_TOTAL * 0.88);

  const [reservePct, setReservePct] = useState<number>(DEFAULT_RESERVE_PCT);
  const [algo, setAlgo] = useState<DecompAlgo>("historical");
  const [intensityDrop, setIntensityDrop] = useState<number>(DEFAULT_INTENSITY_DROP);
  const [alpha, setAlpha] = useState<number>(DEFAULT_COMPOSITE.alpha);
  const [beta, setBeta] = useState<number>(DEFAULT_COMPOSITE.beta);
  const [gamma, setGamma] = useState<number>(DEFAULT_COMPOSITE.gamma);
  const [districts, setDistricts] = useState<DistrictInput[]>(DEFAULT_DISTRICT_INPUTS);

  const allocatable = useMemo(
    () => Math.max(0, totalQuotaInput * (1 - reservePct)),
    [totalQuotaInput, reservePct],
  );
  const activeResults = useMemo(
    () =>
      decompose(districts, {
        algo,
        totalQuota: allocatable,
        intensityDropRate: intensityDrop,
        alpha, beta, gamma,
      }),
    [districts, algo, allocatable, intensityDrop, alpha, beta, gamma],
  );

  const activeAllocatable = allocatable;
  const totalAlloc = activeResults.reduce((s, r) => s + r.allocation, 0);
  const lockedSum = districts.reduce((s, r) => s + (r.locked ? r.lockValue ?? 0 : 0), 0);
  const overLocked = lockedSum > allocatable;
  const histTotal = districts.reduce((s, r) => s + r.historical2025, 0);

  // 趋势数据 - 整段线性插值
  const trendData = useMemo(() => {
    const span = Math.max(1, targetYear - DEFAULT_BASE_YEAR);
    const years: number[] = [];
    for (let y = DEFAULT_BASE_YEAR; y <= targetYear; y++) years.push(y);
    return years.map((y) => {
      const t = (y - DEFAULT_BASE_YEAR) / span;
      const row: Record<string, number | string> = { year: `${y}年` };
      activeResults.forEach((r, i) => {
        const start = districts[i].historical2025;
        row[r.name] = +(start + (r.allocation - start) * t).toFixed(1);
      });
      return row;
    });
  }, [activeResults, districts, targetYear]);

  const updateDistrict = (id: string, patch: Partial<DistrictInput>) => {
    setDistricts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const reset = () => {
    setTargetYear(DEFAULT_TARGET_YEAR);
    setTotalQuotaInput(DEFAULT_CITY_TOTAL * 0.88);
    setReservePct(DEFAULT_RESERVE_PCT);
    setAlgo("historical");
    setIntensityDrop(DEFAULT_INTENSITY_DROP);
    setAlpha(DEFAULT_COMPOSITE.alpha);
    setBeta(DEFAULT_COMPOSITE.beta);
    setGamma(DEFAULT_COMPOSITE.gamma);
    setDistricts(DEFAULT_DISTRICT_INPUTS);
    toast.success("已重置为默认参数");
  };

  return (
    <AppLayout title="趋势分解" subtitle={"考核管理 / 趋势分解"}>
      <TooltipProvider delayDuration={150}>
        <div className="p-6 space-y-4">
          {/* 页头 */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">趋势分解</h1>
                <p className="text-sm text-muted-foreground">
                  基于权重算法将全市碳排放总量目标按区进行分解，支持整段与逐年两种模式
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" />重置默认
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("导出功能开发中")}>
                <Download className="h-3.5 w-3.5 mr-1" />导出 Excel
              </Button>
              <Button size="sm" onClick={() => toast.success("方案已保存（占位）")}>
                <Save className="h-3.5 w-3.5 mr-1" />保存方案
              </Button>
            </div>
          </div>

          {/* ① 全市目标设置 */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
              <h2 className="font-medium">全市目标设置</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">目标年度</Label>
                <Select value={String(targetYear)} onValueChange={(v) => setTargetYear(+v)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TARGET_YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y} 年</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">全市总量目标（万吨 CO₂）</Label>
                <Input
                  type="number"
                  className="h-9 text-primary font-medium"
                  value={totalQuotaInput}
                  onChange={(e) => setTotalQuotaInput(+e.target.value || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  预留储备额度：{fmtPct(reservePct, 0)}
                </Label>
                <Slider
                  value={[reservePct * 100]}
                  min={0} max={20} step={1}
                  onValueChange={(v) => setReservePct(v[0] / 100)}
                  className="py-2.5"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">可分解额度（自动）</Label>
                <div className="h-9 px-3 rounded-md bg-muted/50 flex items-center text-sm font-semibold">
                  {fmt(allocatable)} 万吨
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              较 2025 全市基数（{fmt(DEFAULT_CITY_TOTAL, 0)} 万吨）
              <span className={totalQuotaInput < DEFAULT_CITY_TOTAL ? "text-success ml-1" : "text-destructive ml-1"}>
                {totalQuotaInput < DEFAULT_CITY_TOTAL ? "下降" : "上升"} {fmt(Math.abs((totalQuotaInput - DEFAULT_CITY_TOTAL) / DEFAULT_CITY_TOTAL) * 100, 1)}%
              </span>
              （目标年 {targetYear}）
            </div>
          </Card>

          {/* ② 分解算法 */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
              <h2 className="font-medium">分解算法</h2>
            </div>
            <RadioGroup
              value={algo}
              onValueChange={(v) => setAlgo(v as DecompAlgo)}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {(Object.keys(ALGO_LABEL) as DecompAlgo[]).map((k) => (
                <Label
                  key={k}
                  htmlFor={`algo-${k}`}
                  className={`cursor-pointer rounded-lg border p-3 transition hover:border-primary/60 ${
                    algo === k ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value={k} id={`algo-${k}`} className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{ALGO_LABEL[k]}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {k === "historical" && "按区 2025 排放占比"}
                        {k === "gdp" && "按区 GDP 占比"}
                        {k === "intensity" && "按统一下降率折减"}
                        {k === "composite" && "历史 + GDP + 能耗加权"}
                      </div>
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs font-mono text-foreground">
              <span className="text-muted-foreground mr-2">公式：</span>{ALGO_FORMULA[algo]}
            </div>

            {algo === "intensity" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    统一下降率：{fmtPct(intensityDrop, 0)}
                  </Label>
                  <Slider
                    value={[intensityDrop * 100]}
                    min={0} max={40} step={1}
                    onValueChange={(v) => setIntensityDrop(v[0] / 100)}
                    className="py-2.5"
                  />
                </div>
              </div>
            )}

            {algo === "composite" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {[
                  { label: "历史 α", val: alpha, set: setAlpha },
                  { label: "GDP β", val: beta, set: setBeta },
                  { label: "能耗 γ", val: gamma, set: setGamma },
                ].map((it) => (
                  <div key={it.label} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      {it.label}：{it.val.toFixed(2)}（归一后 {((it.val / (alpha + beta + gamma || 1)) * 100).toFixed(0)}%）
                    </Label>
                    <Slider
                      value={[it.val * 100]}
                      min={0} max={100} step={5}
                      onValueChange={(v) => it.set(v[0] / 100)}
                      className="py-2.5"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ③ 区维度参数表 */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
                <h2 className="font-medium">区维度参数表</h2>
                {isYearly && (
                  <span className="text-xs text-muted-foreground ml-2">
                    展示年份分配额度
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isYearly && (
                  <Select value={String(viewYear)} onValueChange={(v) => setViewYear(+v)}>
                    <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {yearTargets.map((y) => (
                        <SelectItem key={y.year} value={String(y.year)}>{y.year} 年</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {overLocked && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    锁定值合计 {fmt(lockedSum)} 已超出可分解额度
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">区</TableHead>
                    <TableHead className="text-right">2025 历史排放<br/><span className="text-[10px] text-muted-foreground">（万吨）</span></TableHead>
                    <TableHead className="text-right">GDP<br/><span className="text-[10px] text-muted-foreground">（亿元）</span></TableHead>
                    <TableHead className="text-right">能耗总量<br/><span className="text-[10px] text-muted-foreground">（万吨标煤）</span></TableHead>
                    <TableHead className="text-center w-[180px]">
                      锁定值<br/>
                      <span className="text-[10px] text-muted-foreground">
                        （万吨{isYearly ? "·终点年" : ""}）
                      </span>
                    </TableHead>
                    <TableHead className="text-right">权重</TableHead>
                    <TableHead className="text-right">
                      分配额度<br/>
                      <span className="text-[10px] text-muted-foreground">
                        （{isYearly ? `${viewYear} 年` : "万吨"}）
                      </span>
                    </TableHead>
                    <TableHead className="text-right">同比 2025</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districts.map((d, i) => {
                    const r = activeResults[i];
                    const deltaCls = r.deltaVsHist < 0 ? "text-success" : r.deltaVsHist > 0 ? "text-destructive" : "text-muted-foreground";
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-right">
                          <Input type="number" className="h-8 text-right text-primary"
                            value={d.historical2025}
                            onChange={(e) => updateDistrict(d.id, { historical2025: +e.target.value || 0 })} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input type="number" className="h-8 text-right text-primary"
                            value={d.gdp}
                            onChange={(e) => updateDistrict(d.id, { gdp: +e.target.value || 0 })} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input type="number" className="h-8 text-right text-primary"
                            value={d.energy}
                            onChange={(e) => updateDistrict(d.id, { energy: +e.target.value || 0 })} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"
                                  onClick={() => updateDistrict(d.id, { locked: !d.locked, lockValue: d.lockValue ?? +r.allocation.toFixed(0) })}>
                                  {d.locked ? <Lock className="h-3.5 w-3.5 text-warning" /> : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{d.locked ? "已锁定，点击解锁" : "点击锁定为指定值"}</TooltipContent>
                            </UITooltip>
                            <Input type="number" disabled={!d.locked}
                              className="h-8 text-right text-primary disabled:opacity-50"
                              value={d.lockValue ?? ""}
                              onChange={(e) => updateDistrict(d.id, { lockValue: +e.target.value || 0 })}
                              placeholder="—" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{fmtPct(r.weight, 1)}</TableCell>
                        <TableCell className="text-right font-semibold">{fmt(r.allocation)}</TableCell>
                        <TableCell className={`text-right ${deltaCls}`}>
                          {r.deltaVsHist >= 0 ? "+" : ""}{fmt(r.deltaVsHist)}
                          <span className="text-[10px] ml-1">({fmtPct(r.deltaPct, 1)})</span>
                        </TableCell>
                        <TableCell className="text-right">{fmtPct(r.share, 1)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/40 font-medium">
                    <TableCell>合计</TableCell>
                    <TableCell className="text-right">{fmt(histTotal)}</TableCell>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                    <TableCell className={`text-right ${Math.abs(totalAlloc - activeAllocatable) > 0.5 ? "text-destructive" : ""}`}>
                      {fmt(totalAlloc)} / {fmt(activeAllocatable)}
                    </TableCell>
                    <TableCell className="text-right">{fmt(totalAlloc - histTotal)}</TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* ④ 可视化 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
                <h2 className="font-medium">
                  各区分配额度对比{isYearly ? `（${viewYear} 年）` : ""}
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activeResults} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={56} />
                  <Tooltip formatter={(v: number) => [`${fmt(v)} 万吨`, "分配额度"]} />
                  <Bar dataKey="allocation" radius={[0, 4, 4, 0]}>
                    {activeResults.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
                <h2 className="font-medium">各区占比{isYearly ? `（${viewYear} 年）` : ""}</h2>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={activeResults} dataKey="allocation" nameKey="name"
                    innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {activeResults.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, n: string) => [`${fmt(v)} 万吨`, n]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block h-4 w-1 rounded-sm bg-primary" />
              <h2 className="font-medium">
                {isYearly
                  ? `${DEFAULT_BASE_YEAR} → ${endYearTarget} 各区逐年分配趋势`
                  : `${DEFAULT_BASE_YEAR} → ${targetYear} 各区趋势（线性插值）`}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ left: 8, right: 16, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {districts.map((d, i) => (
                  <Line key={d.id} type="monotone" dataKey={d.name}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
