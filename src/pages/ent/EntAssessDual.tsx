import { ClipboardCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EntAssessDual() {
  return (
    <PlaceholderPage
      side="ent"
      title="双控考核"
      subtitle="本企业能耗 / 碳排双控考核结果与整改"
      icon={ClipboardCheck}
      features={[
        "考核指标完成情况",
        "考核得分与排名",
        "整改任务接收与处理",
        "佐证材料上传",
        "考核结果申诉",
        "历年考核结果归档",
      ]}
    />
  );
}
