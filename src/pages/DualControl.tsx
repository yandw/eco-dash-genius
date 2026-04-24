import { ClipboardCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function DualControl() {
  return (
    <PlaceholderPage
      title="双控考核管理"
      subtitle="能耗总量与强度双控考核全流程管理"
      icon={ClipboardCheck}
      features={[
        "双控目标分解与下达",
        "能耗强度实时监测",
        "总量预算执行进度",
        "考核打分与排名",
        "整改任务派发与追踪",
        "考核结果归档",
      ]}
    />
  );
}
