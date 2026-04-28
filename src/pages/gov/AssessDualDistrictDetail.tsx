import { ArrowLeft, ChevronRight, Download } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { DistrictAssessTable } from "@/components/assess/DistrictAssessTable";
import { districts, energyAssess } from "@/mocks/assess";
import { toast } from "sonner";

export default function AssessDualDistrictDetail() {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();
  const district = districts.find((d) => d.id === districtId);
  const districtName = district?.name ?? "未知区";
  const isQingpu = districtId === "qingpu";

  return (
    <AppLayout side="gov" title="双控考核" subtitle={`${districtName} 下属企业能耗目标考评`}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
        <Link to="/gov/assess/dual" className="hover:text-primary">双控考核</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/gov/assess/dual" className="hover:text-primary">区下属单位能耗目标考核</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{districtName} 下属企业能耗目标考评</span>
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/gov/assess/dual")}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />返回列表
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("已导出")}>
          <Download className="h-3.5 w-3.5 mr-1" />导出
        </Button>
      </div>

      <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground mb-3">
        考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有1项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。
      </div>

      {isQingpu ? (
        <DistrictAssessTable rows={energyAssess} mode="city-view" />
      ) : (
        <div className="rounded-md border border-border bg-card py-16 text-center text-sm text-muted-foreground">
          演示数据仅包含青浦区，其它区显示样式相同。
        </div>
      )}
    </AppLayout>
  );
}
