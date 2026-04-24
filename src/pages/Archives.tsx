import { FolderArchive } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Archives() {
  return (
    <PlaceholderPage
      title="节能管理档案"
      subtitle="节能制度、措施、技改项目的全生命周期档案"
      icon={FolderArchive}
      features={[
        "节能管理制度文件库",
        "节能技改项目台账",
        "能源审计报告归档",
        "节能培训与考核记录",
        "能源计量器具档案",
        "支持文件检索与版本管理",
      ]}
    />
  );
}
