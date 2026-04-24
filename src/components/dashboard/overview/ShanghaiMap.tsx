import { useMemo } from "react";
import { MapPin } from "lucide-react";

export interface District {
  id: string;
  name: string;
  /** SVG path */
  d: string;
  /** label position */
  cx: number;
  cy: number;
}

// 极简上海 16 区示意轮廓（非真实地理精度）
// viewBox 0 0 800 800
export const DISTRICTS: District[] = [
  { id: "jiading", name: "嘉定区", d: "M180 200 L320 180 L340 280 L260 320 L180 290 Z", cx: 250, cy: 250 },
  { id: "baoshan", name: "宝山区", d: "M340 180 L470 200 L460 290 L340 280 Z", cx: 405, cy: 230 },
  { id: "qingpu", name: "青浦区", d: "M120 320 L260 320 L280 440 L130 460 Z", cx: 195, cy: 390 },
  { id: "putuo", name: "普陀区", d: "M280 320 L360 310 L370 380 L290 390 Z", cx: 325, cy: 350 },
  { id: "jingan", name: "静安区", d: "M370 310 L420 305 L425 365 L375 375 Z", cx: 397, cy: 340 },
  { id: "hongkou", name: "虹口区", d: "M425 305 L475 300 L478 360 L430 365 Z", cx: 450, cy: 332 },
  { id: "yangpu", name: "杨浦区", d: "M478 290 L555 295 L548 370 L483 365 Z", cx: 515, cy: 330 },
  { id: "changning", name: "长宁区", d: "M280 390 L375 380 L370 440 L290 450 Z", cx: 327, cy: 412 },
  { id: "huangpu", name: "黄浦区", d: "M375 380 L478 365 L478 425 L380 435 Z", cx: 425, cy: 402 },
  { id: "xuhui", name: "徐汇区", d: "M280 450 L385 440 L395 540 L290 555 Z", cx: 335, cy: 495 },
  { id: "pudong", name: "浦东新区", d: "M478 360 L640 360 L680 530 L600 660 L460 640 L478 480 Z", cx: 560, cy: 500 },
  { id: "minhang", name: "闵行区", d: "M280 555 L450 545 L460 660 L290 670 Z", cx: 365, cy: 605 },
  { id: "songjiang", name: "松江区", d: "M130 470 L280 460 L290 670 L150 680 Z", cx: 210, cy: 570 },
  { id: "fengxian", name: "奉贤区", d: "M150 690 L460 680 L470 740 L160 750 Z", cx: 305, cy: 715 },
  { id: "jinshan", name: "金山区", d: "M150 760 L380 750 L370 800 L160 800 Z", cx: 260, cy: 778 },
  { id: "chongming", name: "崇明区", d: "M180 60 L460 80 L520 140 L380 170 L180 150 Z", cx: 340, cy: 115 },
];

// 散点（企业分布）
const dots = [
  { x: 320, y: 250, color: "green" },
  { x: 270, y: 380, color: "green" },
  { x: 350, y: 360, color: "green" },
  { x: 410, y: 340, color: "orange" },
  { x: 440, y: 410, color: "green" },
  { x: 380, y: 430, color: "green" },
  { x: 510, y: 320, color: "green" },
  { x: 535, y: 380, color: "red" },
  { x: 580, y: 460, color: "green" },
  { x: 620, y: 440, color: "green" },
  { x: 590, y: 520, color: "orange" },
  { x: 540, y: 580, color: "green" },
  { x: 350, y: 590, color: "green" },
  { x: 400, y: 620, color: "red" },
  { x: 220, y: 540, color: "green" },
  { x: 250, y: 700, color: "green" },
  { x: 380, y: 720, color: "orange" },
  { x: 420, y: 560, color: "green" },
  { x: 450, y: 400, color: "green" },
  { x: 320, y: 460, color: "green" },
  { x: 280, y: 280, color: "green" },
  { x: 200, y: 600, color: "green" },
] as const;

const colorMap: Record<string, string> = {
  green: "hsl(152 65% 50%)",
  orange: "hsl(40 95% 55%)",
  red: "hsl(0 75% 60%)",
};

interface Props {
  onDistrictClick: (d: District) => void;
}

export function ShanghaiMap({ onDistrictClick }: Props) {
  const memoDots = useMemo(() => dots, []);

  return (
    <div className="panel p-4 h-full relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />

      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 relative z-10">
        <span className="h-1 w-1 rounded-full bg-primary" />
        上海市重点用能企业分布
        <span className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground font-normal">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: colorMap.green }} />正常</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: colorMap.orange }} />预警</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: colorMap.red }} />重点排放</span>
        </span>
      </h3>

      <div className="relative w-full h-[calc(100%-32px)] min-h-[420px]">
        <svg viewBox="0 0 800 800" className="w-full h-full">
          <defs>
            <linearGradient id="districtFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150 55% 55% / 0.15)" />
              <stop offset="100%" stopColor="hsl(200 90% 60% / 0.05)" />
            </linearGradient>
            <linearGradient id="districtHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150 60% 45% / 0.4)" />
              <stop offset="100%" stopColor="hsl(155 55% 28% / 0.2)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 区县 */}
          {DISTRICTS.map((d) => (
            <g key={d.id} className="district-group cursor-pointer">
              <path
                d={d.d}
                fill="url(#districtFill)"
                stroke="hsl(155 55% 28%)"
                strokeWidth={1.2}
                strokeOpacity={0.7}
                onClick={() => onDistrictClick(d)}
                className="transition-all hover:fill-[url(#districtHover)] hover:stroke-[hsl(var(--primary))]"
                style={{ pointerEvents: "all" }}
              />
              <text
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill="hsl(var(--foreground) / 0.7)"
                className="pointer-events-none select-none font-medium"
              >
                {d.name}
              </text>
            </g>
          ))}

          {/* 散点 */}
          {memoDots.map((p, i) => (
            <g key={i} className="pointer-events-none">
              <circle cx={p.x} cy={p.y} r={3.5} fill={colorMap[p.color]} filter="url(#glow)" />
              {p.color === "red" && (
                <circle cx={p.x} cy={p.y} r={6} fill="none" stroke={colorMap.red} strokeOpacity={0.5}>
                  <animate attributeName="r" from="3" to="10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* 中心地标 */}
          <g transform="translate(425, 415)" className="pointer-events-none">
            <circle r={16} fill="hsl(var(--primary) / 0.15)">
              <animate attributeName="r" from="14" to="28" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r={9} fill="hsl(var(--primary))" />
            <circle r={4} fill="white" />
          </g>
        </svg>

        {/* 中心定位卡 */}
        <div className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-[140%] pointer-events-none">
          <div className="bg-card border border-primary/40 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-card flex items-center gap-1 whitespace-nowrap">
            <MapPin className="h-3 w-3 text-primary" />
            上海市节能中心
          </div>
        </div>
      </div>
    </div>
  );
}
