import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function GovPosts() {
  return (
    <PlaceholderPage
      side="gov"
      title="岗位备案"
      subtitle="全市重点用能单位能源管理岗位人员备案与变更管理"
      features={[
        "能源管理负责人/能源管理员备案登记",
        "岗位人员任职资格与培训记录核验",
        "岗位变更、离任流程线上办理",
        "备案信息统计分析与到期提醒",
        "备案档案归集与执法核查留痕",
        "与企业账户、组织机构联动",
      ]}
      icon={Users}
    />
  );
}
