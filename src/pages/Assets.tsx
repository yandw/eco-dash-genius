import { Boxes } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Assets() {
  return (
    <PlaceholderPage
      title="固定资产管理"
      subtitle="用能设备资产台账与全生命周期管理"
      icon={Boxes}
      features={[
        "资产卡片与分类台账",
        "设备能效等级标识",
        "维保 / 检修记录",
        "折旧与残值管理",
        "设备调拨与报废流程",
        "二维码资产盘点",
      ]}
    />
  );
}
