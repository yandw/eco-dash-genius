import { Boxes } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Assets() {
  return (
    <PlaceholderPage
      side="gov"
      title="固定资产管理"
      subtitle="重点用能设备资产监管与全生命周期追溯"
      icon={Boxes}
      features={[
        "重点用能设备清单监管",
        "设备能效等级核查",
        "高耗能落后设备淘汰追踪",
        "设备维保 / 检修监督",
        "资产调拨与报废备案",
        "设备能效抽检任务派发",
      ]}
    />
  );
}
