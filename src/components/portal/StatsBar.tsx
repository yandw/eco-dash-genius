const stats = [
  { value: "20", unit: "个", label: "市级碳账户" },
  { value: "60", unit: "个", label: "区级碳账户" },
  { value: "80", unit: "个", label: "园区碳账户" },
  { value: "120", unit: "个", label: "集团碳账户" },
  { value: "1200", unit: "个", label: "企业碳账户" },
];

export function StatsBar() {
  return (
    <section className="relative">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* 浮起的白色长条 */}
        <div
          className="relative -mt-12 z-20 bg-card rounded-2xl border border-border/60 px-6 md:px-10 py-6 md:py-7 grid grid-cols-2 md:grid-cols-5 gap-4"
          style={{ boxShadow: "var(--portal-shadow-float)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                "text-center" +
                (i > 0 ? " md:border-l md:border-border/40" : "")
              }
            >
              <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {s.value}
                <span className="text-sm font-medium ml-1 text-muted-foreground">
                  {s.unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
