import { FileBarChart } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function ReportMonthly() {
  return (
    <PlaceholderPage
      title="节能月度报告"
      subtitle="自动生成月度节能与能耗分析报告"
      icon={FileBarChart}
      features={[
        "月度能耗汇总（电/水/气/汽/煤）",
        "同比 / 环比变化分析",
        "重点用能设备能效追踪",
        "节能措施成效评估",
        "异常用能事件回顾",
        "导出 Word / PDF 报告",
      ]}
    />
  );
}
