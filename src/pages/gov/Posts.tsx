import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Building2, CheckCircle2, AlertCircle, CircleSlash,
  Search, Eye, Filter,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PostStatusBadge } from "@/components/posts/PostStatusBadge";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import { enterpriseList, govStats, type FilingStatus } from "@/mocks/posts";

const statCards = [
  { key: "total", label: "纳入企业总数", value: govStats.total, Icon: Building2, color: "text-primary bg-primary/10" },
  { key: "complete", label: "已完成备案", value: govStats.complete, Icon: CheckCircle2, color: "text-success bg-success/10" },
  { key: "partial", label: "部分备案", value: govStats.partial, Icon: AlertCircle, color: "text-warning bg-warning/10" },
  { key: "empty", label: "未备案", value: govStats.empty, Icon: CircleSlash, color: "text-muted-foreground bg-muted" },
];

const counties = ["全部", "浦东新区", "宝山区", "金山区", "奉贤区", "闵行区", "嘉定区", "松江区"];
const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "complete", label: "已备案" },
  { value: "partial", label: "待完善" },
  { value: "empty", label: "未备案" },
];

export default function GovPosts() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [county, setCounty] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = enterpriseList.filter((e) => {
    if (keyword && !e.name.includes(keyword) && !e.industry.includes(keyword)) return false;
    if (county !== "全部" && e.county !== county) return false;
    if (statusFilter !== "all") {
      const overall: FilingStatus =
        e.energyStatus === "complete" && e.carbonStatus === "complete"
          ? "complete"
          : e.energyStatus === "empty" && e.carbonStatus === "empty"
          ? "empty"
          : "partial";
      if (overall !== statusFilter) return false;
    }
    return true;
  });

  return (
    <AppLayout
      side="gov"
      title="岗位备案"
      subtitle="全市重点用能单位能源与碳排放管理岗位备案信息查阅"
    >
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {statCards.map((s) => (
          <div key={s.key} className="panel p-4">
            <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <s.Icon className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className="text-2xl font-bold font-mono text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      {/* 列表 */}
      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="按企业名称 / 行业搜索..."
              className="pl-8 h-9"
            />
          </div>
          <Select value={county} onValueChange={setCounty}>
            <SelectTrigger className="h-9 w-[140px]">
              <Filter className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {counties.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>企业名称</TableHead>
                <TableHead>所属区县</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>能源岗位</TableHead>
                <TableHead>碳排岗位</TableHead>
                <TableHead className="text-center">人员数</TableHead>
                
                <TableHead>最近更新</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginate(filtered, page, pageSize).map((e) => (
                <TableRow
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/gov/posts/${e.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{e.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.county}</TableCell>
                  <TableCell className="text-sm">{e.industry}</TableCell>
                  <TableCell><PostStatusBadge status={e.energyStatus} /></TableCell>
                  <TableCell><PostStatusBadge status={e.carbonStatus} /></TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {e.staffCount}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-primary h-8">
                      <Eye className="h-3.5 w-3.5 mr-1" /> 查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-12">
                    没有匹配的企业
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ListPagination
            total={filtered.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </AppLayout>
  );
}
