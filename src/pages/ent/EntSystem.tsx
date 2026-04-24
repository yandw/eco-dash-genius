import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function EntSystem() {
  return (
    <PlaceholderPage
      side="ent"
      title="系统管理"
      subtitle="账户、子账号、消息通知与个人偏好设置"
      icon={Settings}
      features={[
        "账户信息与密码修改",
        "子账号 / 填报员管理",
        "审核退回消息通知设置",
        "操作日志查询",
        "数据导出权限配置",
        "界面主题与语言偏好",
      ]}
    />
  );
}
