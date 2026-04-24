import { CalendarRange } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function ReportYearly() {
  return (
    <PlaceholderPage
      title="节能年度报告"
      subtitle="年度节能降碳综合报告与目标完成度分析"
      icon={CalendarRange}
      features={[
        "年度能耗与碳排放总账",
        "万元产值综合能耗趋势",
        "节能技改项目年度盘点",
        "双碳目标完成度",
        "对标行业先进水平",
        "支持监管部门报送格式",
      ]}
    />
  );
}
