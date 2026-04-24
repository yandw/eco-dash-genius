import { Crosshair } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Benchmark() {
  return (
    <PlaceholderPage
      title="设备对标管理"
      subtitle="重点用能设备对标行业先进 / 同类设备"
      icon={Crosshair}
      features={[
        "设备能效对标库",
        "同类设备能效排名",
        "对标差距分析",
        "节能改造潜力评估",
        "对标行动计划跟踪",
        "对标成效复盘",
      ]}
    />
  );
}
