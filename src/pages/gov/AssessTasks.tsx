import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function AssessTasks() {
  return (
    <PlaceholderPage
      title="任务管理"
      subtitle="考核管理 / 任务管理"
      icon={ClipboardList}
      side="gov"
      features={[
        "按年度/批次发起考核任务",
        "任务下发与企业认领跟踪",
        "任务进度看板与超期提醒",
        "任务归档与历史回溯",
      ]}
    />
  );
}
