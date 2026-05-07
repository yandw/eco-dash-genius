import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Pencil, Trash2, Users } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  deleteTask, taskHasDistrictColumn, useAssessTasksStore,
} from "@/mocks/assessTasks";

const TYPE_OPTIONS: AssessTaskType[] = [
  "区下属单位碳排放目标分解",
  "\"百家\"、\"千家\"、通信业企业碳排放目标分解",
  "区下属单位能耗考核",
  "\"百家\"、\"千家\"、通信业企业能耗考核",
];
import { AssessTaskFormDialog } from "@/components/assess/AssessTaskFormDialog";
import { toast } from "sonner";

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
  const isCarbon = t.includes("碳排放");
  const cls = isCarbon
    ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
    : "border-sky-500/40 text-sky-600 dark:text-sky-400";
  return <Badge variant="outline" className={cls}>{t}</Badge>;
}

export default function AssessTasks() {
  const tasks = useAssessTasksStore();
  const cityAdmin = isCityAdmin();

  const [year, setYear] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AssessTask | null>(null);
  const [delTarget, setDelTarget] = useState<AssessTask | null>(null);
  const [entView, setEntView] = useState<AssessTask | null>(null);
  const [entPage, setEntPage] = useState(1);
  const [entPageSize, setEntPageSize] = useState(10);

  useEffect(() => {
    setEntPage(1);
  }, [entView?.id]);

  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== "已归档"), [tasks]);

  const yearOptions = useMemo(
    () => Array.from(new Set(activeTasks.map((t) => t.year))).sort((a, b) => b - a),
    [activeTasks],
  );

  const filtered = useMemo(() => {
    return activeTasks.filter((t) => {
      if (year !== "all" && String(t.year) !== year) return false;
      return true;
    });
  }, [activeTasks, year]);

  const pageItems = paginate(filtered, page, pageSize);
  const showDistrict = entView ? taskHasDistrictColumn(entView.type) : false;
  const entPageItems = entView ? paginate(entView.enterprises, entPage, entPageSize) : [];

  if (!cityAdmin) {
    return (
      <AppLayout title="任务管理" subtitle="考核管理 / 任务管理" side="gov">
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
    <AppLayout title="任务管理" subtitle="考核管理 / 任务管理" side="gov">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">年份</span>
            <Select value={year} onValueChange={(v) => { setYear(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-1.5">
            <Plus className="h-4 w-4" />新建任务
          </Button>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">序号</TableHead>
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
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                    暂无任务
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((t, idx) => (
                  <TableRow key={t.id}>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {(page - 1) * pageSize + idx + 1}
                    </TableCell>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              企业名单 · {entView?.year} {entView?.type}（共 {entView?.enterprises.length} 家）
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">序号</TableHead>
                  {showDistrict && <TableHead className="w-28">区名称</TableHead>}
                  <TableHead>统一社会信用代码</TableHead>
                  <TableHead>企业名称</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entPageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showDistrict ? 4 : 3} className="text-center text-sm text-muted-foreground py-8">
                      暂无企业
                    </TableCell>
                  </TableRow>
                ) : (
                  entPageItems.map((e, i) => (
                    <TableRow key={`${e.creditCode}-${i}`}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {(entPage - 1) * entPageSize + i + 1}
                      </TableCell>
                      {showDistrict && <TableCell>{e.district ?? "—"}</TableCell>}
                      <TableCell className="font-mono text-xs">{e.creditCode}</TableCell>
                      <TableCell>{e.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {entView && (
            <ListPagination
              total={entView.enterprises.length}
              page={entPage}
              pageSize={entPageSize}
              onPageChange={setEntPage}
              onPageSizeChange={setEntPageSize}
            />
          )}
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
