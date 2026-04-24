import { CalendarRange } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function ReportYearly() {
  return (
    <PlaceholderPage
      side="gov"
      title="节能年度报告"
      subtitle="企业年度节能报告审核与全市汇总分析"
      icon={CalendarRange}
      features={[
        "企业年度报告审核流转",
        "全市年度能耗与碳排放总账",
        "万元产值综合能耗趋势",
        "节能技改项目年度盘点",
        "双碳目标完成度评估",
        "对标行业先进水平",
      ]}
    />
  );
}
