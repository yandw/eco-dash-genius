import { Target } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function AssessGoal() {
  return (
    <PlaceholderPage
      side="gov"
      title="目标分解"
      subtitle="能耗双控 / 碳排双控目标的逐级分解与下达"
      icon={Target}
      features={[
        "市级总目标设定",
        "区县目标分解",
        "重点用能企业目标下达",
        "目标台账与变更记录",
        "分解结果公示与确认",
        "目标执行进度跟踪",
      ]}
    />
  );
}
