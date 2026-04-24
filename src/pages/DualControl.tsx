import { ClipboardCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function DualControl() {
  return (
    <PlaceholderPage
      side="gov"
      title="双控考核管理"
      subtitle="对各区 / 重点用能企业能耗双控考核全流程管理"
      icon={ClipboardCheck}
      features={[
        "双控目标分解与下达",
        "区县 / 企业能耗强度监测",
        "总量预算执行进度",
        "考核打分与排名公示",
        "整改任务派发与督办",
        "考核结果归档与上报",
      ]}
    />
  );
}
