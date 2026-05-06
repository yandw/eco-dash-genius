import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Download, Search } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarbonGoalTable } from "@/components/assess/CarbonGoalTable";
import { carbonGoals, districts } from "@/mocks/assess";
import { toast } from "sonner";

type ModifiedFilter = "all" | "modified" | "unmodified";

export default function AssessGoalDistrictDetail() {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();
  const district = districts.find((d) => d.id === districtId);
  const districtName = district?.name ?? "未知区";

  const [keyword, setKeyword] = useState("");
  const [modifiedFilter, setModifiedFilter] = useState<ModifiedFilter>("all");

  const allRows = useMemo(
    () => carbonGoals.filter((r) => r.districtId === districtId),
    [districtId],
  );

  const rows = useMemo(() => {
    return allRows.filter((r) => {
      if (modifiedFilter === "modified" && r.status !== "modified") return false;
      if (modifiedFilter === "unmodified" && r.status === "modified") return false;
      if (keyword.trim()) {
        const k = keyword.trim().toLowerCase();
        if (!r.entName.toLowerCase().includes(k) && !r.creditCode.toLowerCase().includes(k)) {
          return false;
        }
      }
      return true;
    });
  }, [allRows, keyword, modifiedFilter]);

  const modifiedCount = allRows.filter((r) => r.status === "modified").length;

  const reset = () => {
    setKeyword("");
    setModifiedFilter("all");
  };

  return (
    <AppLayout side="gov" title="目标分解" subtitle={`${districtName} 下属企业碳排放目标分解`}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
        <Link to="/gov/assess/goal" className="hover:text-primary">目标分解</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/gov/assess/goal" className="hover:text-primary">区下属单位碳排放目标分解</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{districtName} 下属企业碳排放目标分解</span>
      </div>

      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/gov/assess/goal")}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />返回列表
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="panel p-3"><div className="text-[11px] text-muted-foreground">企业总数</div><div className="text-lg font-semibold">{stats.count}</div></div>
        <div className="panel p-3"><div className="text-[11px] text-muted-foreground">已完成</div><div className="text-lg font-semibold text-success">{stats.completed}</div></div>
        <div className="panel p-3"><div className="text-[11px] text-muted-foreground">已修改</div><div className="text-lg font-semibold text-warning">{stats.modified}</div></div>
        <div className="panel p-3"><div className="text-[11px] text-muted-foreground">总量目标（万吨CO₂）</div><div className="text-lg font-semibold text-primary">{stats.total.toLocaleString()}</div></div>
        <div className="panel p-3"><div className="text-[11px] text-muted-foreground">平均强度</div><div className="text-lg font-semibold">{stats.avgIntensity}</div></div>
      </div>

      {/* 筛选区 */}
      <div className="panel p-4 mb-4 flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <Label className="text-xs text-muted-foreground mb-1 inline-block">企业名称 / 信用代码</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入企业名称或统一信用代码"
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>
        <div className="w-[200px]">
          <Label className="text-xs text-muted-foreground mb-1 inline-block">是否已修改</Label>
          <Select value={modifiedFilter} onValueChange={(v) => setModifiedFilter(v as ModifiedFilter)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="modified">已修改（{modifiedCount}）</SelectItem>
              <SelectItem value="unmodified">未修改</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={reset}>重置</Button>
        <Button variant="outline" size="sm" className="h-9 ml-auto" onClick={() => toast.success("已导出 Excel")}>
          <Download className="h-3.5 w-3.5 mr-1" />导出
        </Button>
      </div>

      {allRows.length > 0 ? (
        <CarbonGoalTable rows={rows} mode="city-view" />
      ) : (
        <div className="rounded-md border border-border bg-card py-16 text-center text-sm text-muted-foreground">
          演示数据仅包含青浦区，其它区显示样式相同。
        </div>
      )}
    </AppLayout>
  );
}
