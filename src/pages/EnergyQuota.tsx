import { Gauge } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EnergyQuota() {
  return (
    <PlaceholderPage
      title="能源限额报告"
      subtitle="按工序 / 产品 / 部门的能源限额管理"
      icon={Gauge}
      features={[
        "限额指标制定与下发",
        "实时限额执行进度",
        "超限预警与责任归属",
        "单位产品综合能耗对比",
        "限额完成度排名",
        "历史限额执行档案",
      ]}
    />
  );
}
