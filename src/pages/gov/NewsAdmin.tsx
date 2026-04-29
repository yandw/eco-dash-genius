import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Newspaper,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Pin,
  EyeOff,
  Trash2,
  Calendar,
  CheckCircle2,
  FileEdit,
  ShieldAlert,
} from "lucide-react";
import {
  newsArticles as initialArticles,
  CATEGORY_LABELS,
  NewsArticle,
  NewsCategory,
  NewsStatus,
  getSourceLabel,
} from "@/mocks/news";
import { NewsCategoryBadge } from "@/components/news/NewsCategoryBadge";
import { NewsStatusBadge } from "@/components/news/NewsStatusBadge";
import { isCityAdmin } from "@/mocks/currentUser";
import { toast } from "sonner";

export default function NewsAdmin() {
  const navigate = useNavigate();
  const [list, setList] = useState<NewsArticle[]>(initialArticles);
  const [category, setCategory] = useState<"all" | NewsCategory>("all");
  const [status, setStatus] = useState<"all" | NewsStatus>("all");
  const [source, setSource] = useState<string>("all");
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allowed = isCityAdmin();

  const filtered = useMemo(() => {
    return list.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (status !== "all" && n.status !== status) return false;
      if (source !== "all" && n.source !== source) return false;
      if (keyword && !n.title.includes(keyword)) return false;
      return true;
    });
  }, [list, category, status, source, keyword]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return {
      total: list.length,
      monthly: list.filter((n) => n.publishAt.startsWith(thisMonth)).length,
      published: list.filter((n) => n.status === "published").length,
      draft: list.filter((n) => n.status === "draft").length,
    };
  }, [list]);

  const togglePin = (id: string) => {
    setList((arr) => arr.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
    toast.success("操作成功");
  };

  const toggleOffline = (id: string) => {
    setList((arr) =>
      arr.map((n) =>
        n.id === id
          ? { ...n, status: n.status === "offline" ? "published" : "offline" }
          : n,
      ),
    );
    toast.success("操作成功");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setList((arr) => arr.filter((n) => n.id !== deleteId));
    toast.success("已删除");
    setDeleteId(null);
  };

  if (!allowed) {
    return (
      <AppLayout side="gov" title="新闻发布" subtitle="系统管理 / 新闻发布 (仅市级总账号可用)">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShieldAlert className="h-14 w-14 text-amber-500 mb-4" />
          <div className="text-lg font-semibold text-foreground mb-2">无访问权限</div>
          <p className="text-sm text-muted-foreground max-w-md">
            新闻发布模块仅限"市级总账号"使用，请联系管理员开通权限。
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout side="gov" title="新闻发布" subtitle="系统管理 / 新闻发布 (仅市级总账号可用)">
      <div className="space-y-5">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiTile icon={Newspaper} label="新闻总数" value={stats.total} tone="primary" />
          <KpiTile icon={Calendar} label="本月新增" value={stats.monthly} tone="blue" />
          <KpiTile icon={CheckCircle2} label="已发布" value={stats.published} tone="emerald" />
          <KpiTile icon={FileEdit} label="草稿" value={stats.draft} tone="slate" />
        </div>

        {/* 工具栏 */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="hot">热点动态</TabsTrigger>
                <TabsTrigger value="enterprise">企业发布</TabsTrigger>
                <TabsTrigger value="notice">通知公告</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索标题"
                  className="pl-8 w-56"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="offline">已下架</SelectItem>
                </SelectContent>
              </Select>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  <SelectItem value="上海市节能中心">节能中心</SelectItem>
                  <SelectItem value="上海市经信委">上海经信委</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => navigate("/gov/news/new")}>
                <Plus className="h-4 w-4 mr-1" /> 发布新闻
              </Button>
            </div>
          </div>
        </Card>

        {/* 列表 */}
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">封面</TableHead>
                <TableHead>标题</TableHead>
                <TableHead className="w-24">类别</TableHead>
                <TableHead className="w-32">来源公众号</TableHead>
                <TableHead className="w-28">发布时间</TableHead>
                <TableHead className="w-24">状态</TableHead>
                <TableHead className="w-20 text-right">浏览量</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id} className="group">
                  <TableCell>
                    <div className="h-12 w-16 rounded overflow-hidden bg-muted">
                      <img src={n.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {n.pinned && <Pin className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />}
                      <div>
                        <div className="text-sm font-medium text-foreground line-clamp-1">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {n.summary}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><NewsCategoryBadge category={n.category} /></TableCell>
                  <TableCell className="text-sm">{getSourceLabel(n)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{n.publishAt}</TableCell>
                  <TableCell><NewsStatusBadge status={n.status} /></TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{n.views}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/gov/news/${n.id}/edit`)}>
                          <Pencil className="h-4 w-4 mr-2" /> 编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/portal/news/${n.id}`, "_blank")}>
                          <Eye className="h-4 w-4 mr-2" /> 预览
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePin(n.id)}>
                          <Pin className="h-4 w-4 mr-2" /> {n.pinned ? "取消置顶" : "置顶"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleOffline(n.id)}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          {n.status === "offline" ? "恢复上架" : "下架"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(n.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> 删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                    暂无符合条件的新闻
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该新闻？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法在门户中查看，且不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

const TONE: Record<string, string> = {
  primary: "from-primary/15 to-primary/5 text-primary",
  blue: "from-blue-500/15 to-blue-500/5 text-blue-600",
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
  slate: "from-slate-500/15 to-slate-500/5 text-slate-600",
};

function KpiTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card className={`p-4 bg-gradient-to-br ${TONE[tone]} border`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1">{label}</div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
        </div>
        <Icon className="h-7 w-7 opacity-60" />
      </div>
    </Card>
  );
}
