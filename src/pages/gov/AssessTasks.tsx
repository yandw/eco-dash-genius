import { useMemo, useState } from "react";
import { ClipboardList, Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ListPagination, paginate } from "@/components/ui/list-pagination";
import { isCityAdmin } from "@/mocks/currentUser";
import {
  AssessTask, AssessTaskStatus, AssessTaskType,
  deleteTask, useAssessTasksStore,
} from "@/mocks/assessTasks";
import { AssessTaskFormDialog } from "@/components/assess/AssessTaskFormDialog";
import { toast } from "sonner";

const TYPE_OPTIONS: AssessTaskType[] = ["目标分解", "双控考核", "碳排放考核"];
const STATUS_OPTIONS: AssessTaskStatus[] = ["未开始", "进行中", "已结束", "已归档"];

function StatusBadge({ s }: { s: AssessTaskStatus }) {
  const map: Record<AssessTaskStatus, string> = {
    未开始: "bg-secondary text-secondary-foreground",
    进行中: "bg-primary/15 text-primary border border-primary/30",
    已结束: "bg-muted text-muted-foreground",
    已归档: "bg-muted/60 text-muted-foreground",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${map[s]}`}>{s}</span>;
}

function TypeBadge({ t }: { t: AssessTaskType }) {
  const map: Record<AssessTaskType, string> = {
    目标分解: "border-sky-500/40 text-sky-600 dark:text-sky-400",
    双控考核: "border-violet-500/40 text-violet-600 dark:text-violet-400",
    碳排放考核: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  };
  return <Badge variant="outline" className={map[t]}>{t}</Badge>;
}

export default function AssessTasks() {
  const tasks = useAssessTasksStore();
  const cityAdmin = isCityAdmin();

  const [year, setYear] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [kw, setKw] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AssessTask | null>(null);
  const [delTarget, setDelTarget] = useState<AssessTask | null>(null);
  const [entView, setEntView] = useState<AssessTask | null>(null);

  const yearOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.year))).sort((a, b) => b - a),
    [tasks],
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (year !== "all" && String(t.year) !== year) return false;
      if (type !== "all" && t.type !== type) return false;
      if (status !== "all" && t.status !== status) return false;
      if (kw && !`${t.year}${t.type}${t.enterpriseFileName ?? ""}`.includes(kw)) return false;
      return true;
    });
  }, [tasks, year, type, status, kw]);

  const pageItems = paginate(filtered, page, pageSize);

  if (!cityAdmin) {
    return (
      <AppLayout side="gov">
        <div className="p-6">
          <Card className="p-10 text-center">
            <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-lg font-semibold mb-1">无权限访问</h2>
            <p className="text-sm text-muted-foreground">任务管理仅市级管理员可见。</p>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout side="gov">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">考核管理 / 任务管理</div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              任务管理
            </h1>
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-1.5">
            <Plus className="h-4 w-4" />新建任务
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">年份</span>
              <Select value={year} onValueChange={(v) => { setYear(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">类型</span>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">状态</span>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={kw}
                onChange={(e) => { setKw(e.target.value); setPage(1); }}
                placeholder="搜索年份/类型/文件名"
                className="h-9 pl-8 w-[240px]"
              />
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年份</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>开始时间</TableHead>
                <TableHead>结束时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>企业名单</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                    暂无任务
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="tabular-nums">{t.year}</TableCell>
                    <TableCell><TypeBadge t={t.type} /></TableCell>
                    <TableCell className="tabular-nums">{t.startDate}</TableCell>
                    <TableCell className="tabular-nums">{t.endDate}</TableCell>
                    <TableCell><StatusBadge s={t.status} /></TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{t.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 gap-1"
                        onClick={() => setEntView(t)}
                      >
                        <Users className="h-3.5 w-3.5" />
                        共 {t.enterprises.length} 家
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setEditing(t); setFormOpen(true); }}
                        className="gap-1"
                      >
                        <Pencil className="h-3.5 w-3.5" />编辑
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDelTarget(t)}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
        </Card>
      </div>

      <AssessTaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editing} />

      {/* 企业名单查看 */}
      <Dialog open={!!entView} onOpenChange={(v) => !v && setEntView(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              企业名单 · {entView?.year} {entView?.type}（共 {entView?.enterprises.length} 家）
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>企业名称</TableHead>
                  <TableHead>统一社会信用代码</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entView?.enterprises.map((e, i) => (
                  <TableRow key={`${e.creditCode}-${i}`}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell className="font-mono text-xs">{e.creditCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={!!delTarget} onOpenChange={(v) => !v && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该任务？</AlertDialogTitle>
            <AlertDialogDescription>
              {delTarget && `${delTarget.year} 年「${delTarget.type}」任务将被永久删除，且无法恢复。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (delTarget) {
                  deleteTask(delTarget.id);
                  toast.success("已删除");
                }
                setDelTarget(null);
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
