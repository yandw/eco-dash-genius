import { useMemo, useState } from "react";
import { Search, MapPin, Maximize2 } from "lucide-react";
import { DISTRICTS } from "./ShanghaiMap";

export interface EnterpriseDot {
  id: string;
  name: string;
  x: number;
  y: number;
  /** 重点企业标识 */
  level: "万家" | "千家" | "百家" | "排放";
  district: string;
  industry: string;
  energyLevel: string;
}

const levelColor: Record<EnterpriseDot["level"], string> = {
  万家: "hsl(152 65% 50%)",
  千家: "hsl(155 55% 28%)",
  百家: "hsl(40 95% 55%)",
  排放: "hsl(0 75% 60%)",
};

// Mock 60+ 企业散点（按现有地图坐标范围）
const ENTERPRISES: EnterpriseDot[] = [
  { id: "e1", name: "上海国际旅游度假区新能源有限公司", x: 555, y: 470, level: "万家", district: "浦东新区", industry: "电力、热力生产和供应业", energyLevel: "温室气体1.3万吨及以上" },
  { id: "e2", name: "赫比（上海）金属工业有限公司", x: 510, y: 435, level: "万家", district: "浦东新区", industry: "其他制造业", energyLevel: "5000吨~50万吨" },
  { id: "e3", name: "宝山钢铁股份有限公司", x: 410, y: 250, level: "排放", district: "宝山区", industry: "黑色金属冶炼", energyLevel: "50万吨以上" },
  { id: "e4", name: "上海石化股份有限公司", x: 260, y: 770, level: "排放", district: "金山区", industry: "石油加工", energyLevel: "50万吨以上" },
  { id: "e5", name: "上汽大众汽车有限公司", x: 360, y: 600, level: "千家", district: "闵行区", industry: "汽车制造", energyLevel: "5000吨~50万吨" },
  { id: "e6", name: "华谊集团吴泾化工", x: 380, y: 580, level: "千家", district: "闵行区", industry: "化学原料", energyLevel: "5000吨~50万吨" },
  { id: "e7", name: "上海电气临港重装", x: 600, y: 590, level: "百家", district: "浦东新区", industry: "通用设备", energyLevel: "1000吨~5000吨" },
  { id: "e8", name: "中国商飞总装制造中心", x: 580, y: 530, level: "千家", district: "浦东新区", industry: "航空航天", energyLevel: "5000吨~50万吨" },
  { id: "e9", name: "上海三菱电梯", x: 320, y: 460, level: "百家", district: "徐汇区", industry: "通用设备", energyLevel: "1000吨~5000吨" },
  { id: "e10", name: "中芯国际(上海)集成电路", x: 530, y: 480, level: "万家", district: "浦东新区", industry: "电子制造", energyLevel: "5000吨~50万吨" },
];

// 自动填充更多散点（万家为主）
const RAND_DOTS: EnterpriseDot[] = [];
const districts = DISTRICTS.filter((d) => !["chongming"].includes(d.id));
let seed = 1;
const rand = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
for (let i = 0; i < 80; i++) {
  const d = districts[Math.floor(rand() * districts.length)];
  RAND_DOTS.push({
    id: `r${i}`,
    name: `${d.name}重点用能企业 #${i + 1}`,
    x: d.cx + (rand() - 0.5) * 90,
    y: d.cy + (rand() - 0.5) * 70,
    level: rand() < 0.05 ? "排放" : rand() < 0.15 ? "百家" : rand() < 0.3 ? "千家" : "万家",
    district: d.name,
    industry: ["其他制造业", "汽车制造", "电子制造", "化学原料", "金属加工"][i % 5],
    energyLevel: "5000吨~50万吨",
  });
}

const ALL_DOTS = [...ENTERPRISES, ...RAND_DOTS];

interface Props {
  onEnterpriseClick: (e: EnterpriseDot) => void;
}

const FILTERS: { key: EnterpriseDot["level"] | "全部"; label: string }[] = [
  { key: "全部", label: "全部" },
  { key: "万家", label: "万家" },
  { key: "千家", label: "千家" },
  { key: "百家", label: "百家" },
  { key: "排放", label: "排放" },
];

export function DecadeShanghaiMap({ onEnterpriseClick }: Props) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("全部");

  const dots = useMemo(() => {
    return ALL_DOTS.filter((d) => {
      if (filter !== "全部" && d.level !== filter) return false;
      if (keyword && !d.name.includes(keyword) && !d.district.includes(keyword)) return false;
      return true;
    });
  }, [keyword, filter]);

  return (
    <div className="panel p-4 h-full relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* 顶部工具条 */}
      <div className="relative z-10 flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-[320px]">
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
          onChange={(e) => setFilter(e.target.value as never)}
          className="h-8 px-2.5 text-xs rounded border border-border/60 bg-card focus:outline-none focus:border-primary"
        >
          {FILTERS.map((f) => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
        <button className="ml-auto h-8 w-8 rounded border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 图例 */}
      <div className="relative z-10 flex flex-col gap-1 mb-3 text-[11px] absolute-none">
        <div className="text-muted-foreground mb-0.5">重点企业标识</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {(Object.keys(levelColor) as EnterpriseDot["level"][]).map((l) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: levelColor[l] }} />
              <span className="text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[420px]">
        <svg viewBox="0 0 800 800" className="w-full h-full">
          <defs>
            <linearGradient id="dFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150 55% 55% / 0.12)" />
              <stop offset="100%" stopColor="hsl(200 90% 60% / 0.04)" />
            </linearGradient>
            <filter id="dotGlow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 区县轮廓 (装饰，无点击) */}
          {DISTRICTS.map((d) => (
            <g key={d.id}>
              <path
                d={d.d}
                fill="url(#dFill)"
                stroke="hsl(155 55% 28%)"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
              <text
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="hsl(var(--muted-foreground))"
                className="pointer-events-none select-none"
              >
                {d.name}
              </text>
            </g>
          ))}

          {/* 企业散点 */}
          {dots.map((p) => (
            <g key={p.id} className="cursor-pointer" onClick={() => onEnterpriseClick(p)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.level === "排放" ? 5 : 4}
                fill={levelColor[p.level]}
                filter="url(#dotGlow)"
                className="hover:opacity-90"
              />
              {p.level === "排放" && (
                <circle cx={p.x} cy={p.y} r={6} fill="none" stroke={levelColor["排放"]} strokeOpacity={0.5} pointerEvents="none">
                  <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* 中心地标 */}
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
