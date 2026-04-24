import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Enterprise() {
  return (
    <PlaceholderPage
      side="gov"
      title="企业管理"
      subtitle="纳入监管的重点用能企业名录与档案管理"
      icon={Building2}
      features={[
        "重点用能企业名录维护",
        "企业基础信息核查",
        "用能边界 / 厂区登记",
        "产品产能信息备案",
        "企业账户与联系人管理",
        "企业等级 / 标签分类",
      ]}
    />
  );
}
