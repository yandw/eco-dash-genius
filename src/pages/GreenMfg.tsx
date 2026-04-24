import { Leaf } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function GreenMfg() {
  return (
    <PlaceholderPage
      side="gov"
      title="绿色制造管理"
      subtitle="绿色工厂 / 绿色产品 / 绿色供应链申报与评审"
      icon={Leaf}
      features={[
        "绿色制造申报受理",
        "评审专家分配与打分",
        "现场核查任务派发",
        "绿色工厂名录公示",
        "复评与动态管理",
        "示范单位经验推广",
      ]}
    />
  );
}
