import { FileBarChart } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function ReportMonthly() {
  return (
    <PlaceholderPage
      side="gov"
      title="节能月度报告"
      subtitle="企业月度节能报告汇总与监管分析"
      icon={FileBarChart}
      features={[
        "全市企业月度能耗汇总",
        "同比 / 环比变化分析",
        "重点用能企业能效追踪",
        "异常用能企业识别",
        "月度节能简报生成",
        "导出 Word / PDF 监管报告",
      ]}
    />
  );
}
