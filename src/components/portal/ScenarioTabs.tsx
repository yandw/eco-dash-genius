import { useRef } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, ArrowRight } from "lucide-react";
import finance from "@/assets/portal/scene-finance.jpg";
import auto from "@/assets/portal/scene-auto.jpg";
import alu from "@/assets/portal/scene-aluminum.jpg";
import realestate from "@/assets/portal/scene-realestate.jpg";

const scenes = [
  { key: "finance", label: "普惠金融", image: finance },
  { key: "auto", label: "汽车制造", image: auto },
  { key: "alu", label: "铝型材", image: alu },
  { key: "realestate", label: "房地产", image: realestate },
];

export function ScenarioTabs() {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">场景招商</h2>
            <p className="text-sm text-muted-foreground mt-1">
              聚焦行业绿色低碳转型典型场景
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="h-9 w-9 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition"
              aria-label="上一组"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="h-9 w-9 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition"
              aria-label="下一组"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="mt-6 flex gap-5 overflow-x-auto pb-2 no-scrollbar snap-x"
        >
          {scenes.map((s) => (
            <div
              key={s.key}
              className="snap-start shrink-0 w-[280px] md:w-[320px] rounded-xl overflow-hidden bg-card border border-border/60 group cursor-pointer transition hover:-translate-y-1"
              style={{ boxShadow: "var(--portal-shadow-card)" }}
            >
              <div className="relative h-[260px] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 h-7 w-7 rounded-md bg-white/90 backdrop-blur flex items-center justify-center">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
              <div className="px-5 py-4">
                <h3 className="text-base font-semibold text-foreground">{s.label}</h3>
                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  了解此行业 <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
