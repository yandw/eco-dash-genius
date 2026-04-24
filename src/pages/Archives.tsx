import { FolderArchive } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Archives() {
  return (
    <PlaceholderPage
      side="gov"
      title="节能管理档案"
      subtitle="全市企业节能档案归集、查阅与监管"
      features={[
        "全市企业节能档案统一归集",
        "节能技改项目监管台账",
        "能源审计报告查阅",
        "重点用能企业培训记录",
        "执法检查与整改档案",
        "档案版本与权限管理",
      ]}
      icon={FolderArchive}
    />
  );
}
