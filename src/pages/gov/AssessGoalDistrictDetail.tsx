import { ArrowLeft, ChevronRight, Download } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { CarbonGoalTable } from "@/components/assess/CarbonGoalTable";
import { carbonGoals, districts } from "@/mocks/assess";
import { toast } from "sonner";

export default function AssessGoalDistrictDetail() {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();
  const district = districts.find((d) => d.id === districtId);
  const districtName = district?.name ?? "未知区";
  const rows = carbonGoals.filter((r) => r.districtId === districtId);

  return (
    <AppLayout side="gov" title="目标分解" subtitle={`${districtName} 下属企业碳排放目标分解`}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
        <Link to="/gov/assess/goal" className="hover:text-primary">目标分解</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/gov/assess/goal" className="hover:text-primary">区下属单位碳排放目标分解</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{districtName} 下属企业碳排放目标分解</span>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/gov/assess/goal")}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />返回列表
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("已导出 Excel")}>
          <Download className="h-3.5 w-3.5 mr-1" />导出
        </Button>
      </div>

      {rows.length > 0 ? (
        <CarbonGoalTable rows={rows} mode="city-view" />
      ) : (
        <div className="rounded-md border border-border bg-card py-16 text-center text-sm text-muted-foreground">
          演示数据仅包含青浦区，其它区显示样式相同。
        </div>
      )}
    </AppLayout>
  );
}
