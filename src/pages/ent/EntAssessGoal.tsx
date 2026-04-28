import { Target } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EntAssessGoal() {
  return (
    <PlaceholderPage
      side="ent"
      title="目标分解"
      subtitle="查看本企业承接的双控目标与年度分解情况"
      icon={Target}
      features={[
        "本企业目标查看",
        "年度 / 季度目标拆分",
        "目标确认与反馈",
        "执行进度自查",
        "调整申请提交",
        "历史目标台账",
      ]}
    />
  );
}
