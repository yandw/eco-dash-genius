import { Gauge } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EnergyQuota() {
  return (
    <PlaceholderPage
      side="gov"
      title="能源限额报告"
      subtitle="对企业单位产品能耗限额执行情况监管审核"
      icon={Gauge}
      features={[
        "限额指标制定与下发",
        "企业限额执行情况监测",
        "超限企业预警与督办",
        "单位产品综合能耗对比",
        "区县 / 行业限额完成度排名",
        "历史限额执行档案",
      ]}
    />
  );
}
