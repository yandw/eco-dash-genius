import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

interface Series {
  key: string;
  name: string;
  color?: string;
  type?: "bar" | "line";
}

interface Props {
  title: string;
  data: Array<Record<string, number | string>>;
  xKey: string;
  series: Series[];
  yFormatter?: (v: number) => string;
  referenceY?: { value: number; label: string };
  height?: number;
  kind?: "bar" | "line" | "mixed";
}

const palette = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3, var(--primary)))"];

export function TrendChart({
  title,
  data,
  xKey,
  series,
  yFormatter = (v) => `${v}`,
  referenceY,
  height = 280,
  kind = "bar",
}: Props) {
  const isLine = kind === "line";
  const Chart = isLine ? LineChart : BarChart;

  return (
    <Card className="p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <Chart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis
              tickFormatter={yFormatter}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => yFormatter(v)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {referenceY && (
              <ReferenceLine
                y={referenceY.value}
                stroke="hsl(var(--destructive))"
                strokeDasharray="4 4"
                label={{ value: referenceY.label, fill: "hsl(var(--destructive))", fontSize: 11 }}
              />
            )}
            {series.map((s, i) =>
              isLine || s.type === "line" ? (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color || palette[i % palette.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ) : (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  fill={s.color || palette[i % palette.length]}
                  radius={[4, 4, 0, 0]}
                />
              ),
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
