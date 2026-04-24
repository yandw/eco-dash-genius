import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Enterprise() {
  return (
    <PlaceholderPage
      title="企业管理"
      subtitle="企业组织架构 / 厂区 / 部门信息维护"
      icon={Building2}
      features={[
        "企业基础信息维护",
        "组织架构与部门管理",
        "厂区 / 车间 / 工序建模",
        "产品与产能信息",
        "用能边界划分",
        "联系人与责任人管理",
      ]}
    />
  );
}
