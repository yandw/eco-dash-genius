import { Crosshair } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Benchmark() {
  return (
    <PlaceholderPage
      side="gov"
      title="设备对标管理"
      subtitle="行业重点用能设备能效对标与监管"
      icon={Crosshair}
      features={[
        "行业设备能效对标库",
        "同类设备能效排名分析",
        "落后设备识别与公示",
        "节能改造潜力评估",
        "对标整改任务下发",
        "对标成效跟踪复盘",
      ]}
    />
  );
}
