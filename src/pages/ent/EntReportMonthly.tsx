import { FileBarChart } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EntReportMonthly() {
  return (
    <PlaceholderPage
      side="ent"
      title="月度报告填报"
      subtitle="企业月度能耗与节能数据填报"
      icon={FileBarChart}
      features={[
        "月度能源消耗数据录入",
        "分品种能源用量填报",
        "重点用能设备运行情况",
        "节能措施与成效说明",
        "异常用能原因填写",
        "提交后生成月度填报记录",
      ]}
    />
  );
}
