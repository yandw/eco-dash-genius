const stats = [
  { value: "10", unit: "个", label: "市级碳账户" },
  { value: "17", unit: "个", label: "区级碳账户" },
  { value: "80", unit: "个", label: "园区碳账户" },
  { value: "130", unit: "个", label: "集团碳账户" },
  { value: "1200", unit: "个", label: "企业碳账户" },
];

export function StatsBar() {
  return (
    <section className="bg-card border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {s.value}
              <span className="text-lg ml-1 text-foreground/80">{s.unit}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
