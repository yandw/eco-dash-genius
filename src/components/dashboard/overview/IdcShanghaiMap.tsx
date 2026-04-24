import { useMemo, useState } from "react";
import { Search, MapPin, Maximize2 } from "lucide-react";
import { DISTRICTS } from "./ShanghaiMap";
import type { IdcInfo } from "./IdcPortraitDialog";

export interface IdcDot extends IdcInfo {
  x: number;
  y: number;
  /** PUE 段位颜色 */
  band: "1.0~1.3" | "1.3~1.5" | "1.5~1.7" | ">1.7";
  district: string;
}

const bandColor: Record<IdcDot["band"], string> = {
  "1.0~1.3": "hsl(152 65% 50%)",
  "1.3~1.5": "hsl(217 91% 56%)",
  "1.5~1.7": "hsl(40 95% 55%)",
  ">1.7": "hsl(0 75% 60%)",
};

const NAMED: IdcDot[] = [
  { id: "i1", name: "上海悦科观工数据中心", x: 555, y: 470, band: "1.3~1.5", district: "浦东新区", pue: 1.42, energy: 58012.35, rack: 4500 },
  { id: "i2", name: "中国移动上海国际数据中心", x: 590, y: 510, band: "1.3~1.5", district: "浦东新区", pue: 1.45, energy: 55206.87, rack: 5200 },
  { id: "i3", name: "上海万国新发展数据中心", x: 510, y: 430, band: "1.5~1.7", district: "浦东新区", pue: 1.62, energy: 48214.67, rack: 4100 },
  { id: "i4", name: "宝信宝之云四期3号楼", x: 410, y: 240, band: "1.0~1.3", district: "宝山区", pue: 1.21, energy: 46944.1, rack: 3800 },
  { id: "i5", name: "华京路四号数据中心", x: 460, y: 410, band: "1.3~1.5", district: "黄浦区", pue: 1.38, energy: 44850.4, rack: 3500 },
  { id: "i6", name: "安晓数据中心", x: 530, y: 380, band: "1.0~1.3", district: "杨浦区", pue: 1.193, energy: 32100, rack: 2800 },
  { id: "i7", name: "浦江数据中心", x: 540, y: 600, band: "1.0~1.3", district: "浦东新区", pue: 1.222, energy: 28500, rack: 2500 },
  { id: "i8", name: "上海颛桥云基地", x: 380, y: 600, band: "1.3~1.5", district: "闵行区", pue: 1.41, energy: 30200, rack: 10093 },
  { id: "i9", name: "上海万国D9数据中心", x: 580, y: 540, band: "1.0~1.3", district: "浦东新区", pue: 1.242, energy: 35100, rack: 3200 },
  { id: "i10", name: "宝信宝之云四期2号楼", x: 415, y: 270, band: "1.0~1.3", district: "宝山区", pue: 1.232, energy: 36000, rack: 3700 },
];

// 自动填充更多散点
const districts = DISTRICTS.filter((d) => !["chongming"].includes(d.id));
const RAND: IdcDot[] = [];
let seed = 7;
const rand = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const bands: IdcDot["band"][] = ["1.0~1.3", "1.3~1.5", "1.5~1.7", ">1.7"];
for (let i = 0; i < 35; i++) {
  const d = districts[Math.floor(rand() * districts.length)];
  const r = rand();
  const band: IdcDot["band"] = r < 0.05 ? ">1.7" : r < 0.25 ? "1.5~1.7" : r < 0.6 ? "1.3~1.5" : "1.0~1.3";
  RAND.push({
    id: `r${i}`,
    name: `${d.name}IDC ${i + 1}`,
    x: d.cx + (rand() - 0.5) * 80,
    y: d.cy + (rand() - 0.5) * 60,
    band,
    district: d.name,
    pue: +(1.0 + bands.indexOf(band) * 0.2 + rand() * 0.18).toFixed(2),
    energy: Math.round(5000 + rand() * 30000),
    rack: Math.round(500 + rand() * 4000),
  });
}

export const ALL_IDCS: IdcDot[] = [...NAMED, ...RAND];

interface Props {
  onIdcClick: (i: IdcDot) => void;
}

export function IdcShanghaiMap({ onIdcClick }: Props) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<string>("全部");

  const dots = useMemo(() => {
    return ALL_IDCS.filter((d) => {
      if (keyword && !d.name.includes(keyword) && !d.district.includes(keyword)) return false;
      if (filter !== "全部" && d.district !== filter) return false;
      return true;
    });
  }, [keyword, filter]);

  return (
    <div className="panel p-4 h-full relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* 顶部 KPI 横条 */}
      <div className="relative z-10 grid grid-cols-5 gap-2 mb-3">
        {[
          { v: "106", u: "个", l: "IDC接入数", extra: "16个新增" },
          { v: "216,364", u: "个", l: "实际安装机柜数" },
          { v: "1,128,168.2", u: "tce", l: "IT设备综合能耗" },
          { v: "1.55", u: "", l: "能源利用率PUE" },
          { v: "30,400", u: "万千瓦时", l: "可再生能源利用总量" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg p-2 bg-gradient-to-br from-primary/8 to-transparent border border-primary/15 text-center">
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-base font-bold text-primary tabular-nums">{k.v}</span>
              <span className="text-[9px] text-muted-foreground">{k.u}</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{k.l}</div>
            {k.extra && <div className="text-[9px] text-emerald-500 mt-0.5">{k.extra}</div>}
          </div>
        ))}
      </div>

      {/* 工具条 */}
      <div className="relative z-10 flex items-center gap-2 mb-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入关键字模糊筛选"
            className="w-full h-8 pl-8 pr-3 text-xs rounded border border-border/60 bg-card focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 px-2.5 text-xs rounded border border-border/60 bg-card focus:outline-none focus:border-primary min-w-[100px]"
        >
          <option>全部</option>
          {DISTRICTS.map((d) => <option key={d.id}>{d.name}</option>)}
        </select>
        <button className="ml-auto h-8 w-8 rounded border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 图例 */}
      <div className="relative z-10 mb-2">
        <div className="text-[10px] text-muted-foreground mb-1">PUE热力分布</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
          {(Object.keys(bandColor) as IdcDot["band"][]).map((b) => (
            <div key={b} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: bandColor[b] }} />
              <span className="text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[400px]">
        <svg viewBox="0 0 800 800" className="w-full h-full">
          <defs>
            <linearGradient id="idcDFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150 55% 55% / 0.12)" />
              <stop offset="100%" stopColor="hsl(200 90% 60% / 0.04)" />
            </linearGradient>
            <filter id="idcDotGlow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {DISTRICTS.map((d) => (
            <g key={d.id}>
              <path d={d.d} fill="url(#idcDFill)" stroke="hsl(155 55% 28%)" strokeWidth={1} strokeOpacity={0.5} />
              <text x={d.cx} y={d.cy} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="hsl(var(--muted-foreground))" className="pointer-events-none select-none">
                {d.name}
              </text>
            </g>
          ))}

          {dots.map((p) => (
            <g key={p.id} className="cursor-pointer" onClick={() => onIdcClick(p)}>
              <circle cx={p.x} cy={p.y} r={6} fill={bandColor[p.band]} fillOpacity={0.25} />
              <circle cx={p.x} cy={p.y} r={4} fill={bandColor[p.band]} filter="url(#idcDotGlow)" />
              {p.band === ">1.7" && (
                <circle cx={p.x} cy={p.y} r={6} fill="none" stroke={bandColor[">1.7"]} strokeOpacity={0.6} pointerEvents="none">
                  <animate attributeName="r" from="4" to="14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          <g transform="translate(425, 415)" className="pointer-events-none">
            <circle r={14} fill="hsl(var(--primary) / 0.15)">
              <animate attributeName="r" from="12" to="24" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r={7} fill="hsl(var(--primary))" />
            <circle r={3} fill="white" />
          </g>
        </svg>

        <div className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-[150%] pointer-events-none">
          <div className="bg-card border border-primary/40 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-card flex items-center gap-1 whitespace-nowrap">
            <MapPin className="h-3 w-3 text-primary" />
            上海市节能中心
          </div>
        </div>
      </div>
    </div>
  );
}
