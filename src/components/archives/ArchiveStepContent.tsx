import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArchiveField, ArchiveSection } from "./ArchiveField";
import { FieldAnnotationList } from "./FieldAnnotation";
import {
  ArchiveDetail,
  AuditKind,
  AuditRow,
  FieldAnnotationItem,
  ProjectRow,
  StepKey,
} from "@/mocks/archives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimplePagination, paginate } from "@/components/ui/simple-pagination";
import { toast } from "sonner";
import {
  RefreshCw,
  Users,
  Plus,
  Upload,
  Download,
  ExternalLink,
  Info,
  Pencil,
  Trash2,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface Props {
  step: StepKey;
  detail: ArchiveDetail;
  annotations: FieldAnnotationItem[];
  readOnly?: boolean;
  onAnnotate?: (field: string) => void; // 政府侧批注
}

interface StepProps {
  detail: ArchiveDetail;
  annotations: FieldAnnotationItem[];
  readOnly?: boolean;
  onAnnotate?: (field: string) => void;
}

const annFor = (field: string, list: FieldAnnotationItem[]) =>
  list.filter((a) => a.field === field);

export function ArchiveStepContent({
  step,
  detail,
  annotations,
  readOnly,
  onAnnotate,
}: Props) {
  if (step === "basic") return <BasicInfo detail={detail} annotations={annotations} readOnly={readOnly} onAnnotate={onAnnotate} />;
  if (step === "products") return <Products detail={detail} annotations={annotations} readOnly={readOnly} onAnnotate={onAnnotate} />;
  if (step === "equipments") return <Equipments detail={detail} readOnly={readOnly} />;
  if (step === "audits") return <Audits detail={detail} readOnly={readOnly} />;
  return <Projects detail={detail} readOnly={readOnly} />;
}

/* ───────────────────── 基本信息 ───────────────────── */
function BasicInfo({ detail, annotations, readOnly, onAnnotate }: StepProps) {
  const b = detail.basic;
  return (
    <div className="space-y-8">
      <ArchiveSection
        title="重点用能单位基本情况"
        description="企业主体信息将与「企业管理」模块同步，建议提交前点击右侧按钮刷新"
        action={
          !readOnly && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                同步企业信息
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Users className="h-3.5 w-3.5 mr-1" />
                同步岗位负责人
              </Button>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <ArchiveField label="企业名称" required value={b.enterpriseName} readOnly>
            <Input defaultValue={b.enterpriseName} />
          </ArchiveField>
          <ArchiveField label="统一社会信用代码" required value={b.creditCode} readOnly>
            <Input defaultValue={b.creditCode} />
          </ArchiveField>
          <ArchiveField label="省份" value={b.province} readOnly={readOnly}>
            <Input defaultValue={b.province} />
          </ArchiveField>
          <ArchiveField label="行业分类" value={b.industry} readOnly={readOnly}>
            <Input defaultValue={b.industry} />
          </ArchiveField>
          <ArchiveField label="节能管理编码" required value={b.code} readOnly={readOnly}>
            <Input defaultValue={b.code} />
          </ArchiveField>
          <ArchiveField label="所在地" required value={b.location} readOnly={readOnly}>
            <Input defaultValue={b.location} />
          </ArchiveField>
          <ArchiveField
            label="能源管理岗位人员及联系方式"
            required
            hint="同步自岗位备案模块"
            value={b.contact}
            readOnly={readOnly}
            className="md:col-span-2"
          >
            <Input defaultValue={b.contact} />
          </ArchiveField>
        </div>
        <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <div>
            岗位负责人信息由「档案管理 / 岗位备案」模块统一维护。如需修改，请前往
            <Button variant="link" className="px-1 h-auto text-[11px]">
              岗位备案
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </Button>
            页面更新后再「同步岗位负责人」。
          </div>
        </div>
      </ArchiveSection>

      <ArchiveSection title="能源消费情况" description="单位见字段提示，绿电与绿证购买量请如实填报">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <ArchiveField label="年能源消费量" hint="万吨标准煤，等价值" required value={b.annualEnergy} readOnly={readOnly}>
            <Input defaultValue={b.annualEnergy} />
          </ArchiveField>
          <ArchiveField label="煤炭消费量" hint="万吨" value={b.coal} readOnly={readOnly}>
            <Input defaultValue={b.coal} />
          </ArchiveField>
          <ArchiveField label="原料用能" hint="万吨标准煤等价值" value={b.rawEnergy} readOnly={readOnly}>
            <Input defaultValue={b.rawEnergy} />
          </ArchiveField>
          <ArchiveField label="电力消费量" hint="万千瓦时" required value={b.electricity} readOnly={readOnly}>
            <Input defaultValue={b.electricity} />
          </ArchiveField>
          <ArchiveField label="绿电消费及绿证购买量" hint="万千瓦时" value={b.greenPower} readOnly={readOnly}>
            <Input defaultValue={b.greenPower} />
          </ArchiveField>
          <ArchiveField label="产值" hint="亿元" required value={b.output} readOnly={readOnly}>
            <Input defaultValue={b.output} />
          </ArchiveField>
          <ArchiveField label="增加值" hint="亿元" value={b.addedValue} readOnly={readOnly}>
            <Input defaultValue={b.addedValue} />
          </ArchiveField>
        </div>
      </ArchiveSection>
    </div>
  );
}

/* ───────────────────── 主要产品 ───────────────────── */
function Products({ detail, annotations, readOnly }: StepProps) {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const list = detail.products;
  const pageRows = paginate(list, page, PAGE_SIZE);
  return (
    <ArchiveSection
      title="主要产品情况"
      description="数据来源于年报和限额报告"
    >
      {list.length === 0 ? (
        <EmptyHint text="暂无产品数据" />
      ) : (
        <div className="rounded-lg border border-border/70 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>产品名称</TableHead>
                <TableHead>产能</TableHead>
                <TableHead>产量</TableHead>
                <TableHead>单耗指标单位</TableHead>
                <TableHead>单位产品综合能耗</TableHead>
                <TableHead>对标限额标准</TableHead>
                <TableHead>能效等级</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.capacity}</TableCell>
                  <TableCell className="text-muted-foreground">{p.output}</TableCell>
                  <TableCell className="font-mono text-xs">{p.energyUnit}</TableCell>
                  <TableCell className="font-mono text-xs">{p.energyValue}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.benchmark}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.level === "领跑"
                          ? "border-success/40 text-success bg-success/10"
                          : p.level === "标杆"
                            ? "border-primary/40 text-primary bg-primary/10"
                            : p.level === "未达标"
                              ? "border-destructive/40 text-destructive bg-destructive/10"
                              : "border-warning/40 text-warning bg-warning/10"
                      }
                    >
                      {p.level}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <SimplePagination
            total={list.length}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </ArchiveSection>
  );
}

/* ───────────────────── 用能设备 ───────────────────── */
function Equipments({ detail, readOnly }: { detail: ArchiveDetail; readOnly?: boolean }) {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const list = detail.equipments;
  const pageRows = paginate(list, page, PAGE_SIZE);
  return (
    <ArchiveSection
      title="主要用能设备情况"
      description="数据来源于「设备对标管理」，如需修改请前往源模块"
      action={
        <Button variant="outline" size="sm" className="h-8">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          前往设备对标
        </Button>
      }
    >
      <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary flex items-start gap-2">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        根据《关于开展工业和通信业企业重点用能设备能效对标及更新改造的通知》（沪经信节〔2024〕387号），系统自动同步，无需重复填报。
      </div>
      <div className="mt-4 rounded-lg border border-border/70 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>设备名称</TableHead>
              <TableHead>型号</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>使用年限</TableHead>
              <TableHead>能效水平</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((e) => (
              <TableRow key={e.name}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="font-mono text-xs">{e.model}</TableCell>
                <TableCell>{e.qty}</TableCell>
                <TableCell>{e.years} 年</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      e.level === "一级"
                        ? "border-success/40 text-success bg-success/10"
                        : e.level === "二级"
                          ? "border-primary/40 text-primary bg-primary/10"
                          : e.level === "三级"
                            ? "border-warning/40 text-warning bg-warning/10"
                            : "border-border text-muted-foreground"
                    }
                  >
                    {e.level}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length > 0 && (
          <SimplePagination
            total={list.length}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>
    </ArchiveSection>
  );
}

/* ───────────────────── 能源审计 / 能效诊断 ───────────────────── */
function Audits({ detail, readOnly }: { detail: ArchiveDetail; readOnly?: boolean }) {
  const [rows, setRows] = useState<AuditRow[]>(detail.audits);

  const upsert = (row: AuditRow) => {
    setRows((rs) => {
      const idx = rs.findIndex((r) => r.id === row.id);
      if (idx >= 0) {
        const next = [...rs];
        next[idx] = row;
        return next;
      }
      return [row, ...rs];
    });
  };

  const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

  return (
    <div className="space-y-8">
      <AuditTable
        kind="audit"
        title="实施能源审计情况"
        description="填写已实施的能源审计记录，并上传审计报告"
        rows={rows.filter((r) => r.kind === "audit")}
        readOnly={readOnly}
        onSave={upsert}
        onDelete={remove}
      />
      <AuditTable
        kind="diagnose"
        title="实施能效诊断情况"
        description="填写已实施的能效诊断记录，并上传诊断报告"
        rows={rows.filter((r) => r.kind === "diagnose")}
        readOnly={readOnly}
        onSave={upsert}
        onDelete={remove}
      />
    </div>
  );
}

interface AuditTableProps {
  kind: AuditKind;
  title: string;
  description: string;
  rows: AuditRow[];
  readOnly?: boolean;
  onSave: (row: AuditRow) => void;
  onDelete: (id: string) => void;
}

function AuditTable({ kind, title, description, rows, readOnly, onSave, onDelete }: AuditTableProps) {
  const labelPrefix = kind === "audit" ? "审计" : "诊断";
  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AuditRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const pageRows = paginate(rows, page, PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (row: AuditRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  return (
    <ArchiveSection
      title={title}
      description={description}
      action={
        !readOnly && (
          <Button
            size="sm"
            className="h-8 bg-gradient-primary text-primary-foreground border-0"
            onClick={openCreate}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            新建
          </Button>
        )
      }
    >
      {rows.length === 0 ? (
        <EmptyHint text={`暂无${labelPrefix}记录，请新增`} />
      ) : (
        <div className="rounded-lg border border-border/70 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                {!readOnly && (
                  <TableHead className="w-10">
                    <Checkbox />
                  </TableHead>
                )}
                <TableHead>{labelPrefix}时间</TableHead>
                <TableHead>{labelPrefix}内容</TableHead>
                <TableHead>{labelPrefix}建议</TableHead>
                <TableHead>{labelPrefix}文件</TableHead>
                {!readOnly && <TableHead className="text-right">操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id}>
                  {!readOnly && (
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  )}
                  <TableCell className="font-mono text-xs whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="text-sm max-w-[260px]">
                    <div className="line-clamp-2">{r.content}</div>
                  </TableCell>
                  <TableCell className="text-sm max-w-[260px]">
                    <div className="line-clamp-2">{r.suggestion}</div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                      onClick={() => toast.success(`开始下载 ${r.fileName}`)}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      下载文件
                    </Button>
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary"
                        title="编辑"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        title="删除"
                        onClick={() => setDeletingId(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length > 0 && (
            <SimplePagination
              total={rows.length}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <AuditFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        kind={kind}
        editing={editing}
        onSubmit={(row) => {
          onSave(row);
          setDialogOpen(false);
          toast.success(editing ? "已更新记录" : "已新增记录");
        }}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该条{labelPrefix}记录？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法恢复，请确认操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletingId) {
                  onDelete(deletingId);
                  toast.success("已删除");
                }
                setDeletingId(null);
              }}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ArchiveSection>
  );
}

interface AuditFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: AuditKind;
  editing: AuditRow | null;
  onSubmit: (row: AuditRow) => void;
}

function AuditFormDialog({ open, onOpenChange, kind, editing, onSubmit }: AuditFormDialogProps) {
  const labelPrefix = kind === "audit" ? "审计" : "诊断";
  const titlePrefix = kind === "audit" ? "实施能源审计情况" : "实施能效诊断情况";

  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [fileName, setFileName] = useState("");

  // Reset form when dialog opens / editing changes
  useEffect(() => {
    if (open) {
      setDate(editing?.date ?? "");
      setContent(editing?.content ?? "");
      setSuggestion(editing?.suggestion ?? "");
      setFileName(editing?.fileName ?? "");
    }
  }, [open, editing]);

  const valid = date && content.trim() && suggestion.trim() && fileName.trim();

  const handleSubmit = () => {
    if (!valid) {
      toast.error("请完整填写必填项并上传文件");
      return;
    }
    onSubmit({
      id: editing?.id ?? `${kind}-${Date.now()}`,
      kind,
      date,
      content: content.trim(),
      suggestion: suggestion.trim(),
      fileName: fileName.trim(),
    });
  };

  const handlePickFile = () => {
    // mock 上传
    const mock = `${titlePrefix.replace(/情况$/, "")}报告_${Date.now()}.pdf`;
    setFileName(mock);
    toast.success("文件已上传");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {titlePrefix}（{editing ? "编辑" : "新增"}）
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              <span className="text-destructive">*</span> {labelPrefix}时间
            </Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{labelPrefix}文件 <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9"
                onClick={handlePickFile}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                上传文件
              </Button>
              <span className="text-xs text-muted-foreground truncate">
                {fileName || "未选择文件"}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">文件类型：Pdf | Word</div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">
              <span className="text-destructive">*</span> {labelPrefix}内容
            </Label>
            <Textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`请描述${labelPrefix}内容`}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">
              <span className="text-destructive">*</span> {labelPrefix}建议
            </Label>
            <Textarea
              rows={3}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder={`请填写${labelPrefix}建议`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            disabled={!valid}
            className="bg-gradient-primary text-primary-foreground border-0"
            onClick={handleSubmit}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


/* ───────────────────── 改造计划 ───────────────────── */
function Projects({ detail, readOnly }: { detail: ArchiveDetail; readOnly?: boolean }) {
  return (
    <ArchiveSection
      title="节能降碳改造和用能设备更新项目计划"
      description="仅填报正在实施和计划实施项目"
      action={
        !readOnly && (
          <Button size="sm" className="h-8 bg-gradient-primary text-primary-foreground border-0">
            <Plus className="h-3.5 w-3.5 mr-1" />
            新增项目
          </Button>
        )
      }
    >
      {detail.projects.length === 0 ? (
        <EmptyHint text="暂无改造计划项目" />
      ) : (
        <div className="space-y-3">
          {detail.projects.map((p, i) => (
            <div key={i} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{p.name}</span>
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
                      {p.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-3 text-xs">
                    <Meta label="实施单位" value={p.unit} />
                    <Meta label="建设地点" value={p.location} />
                    <Meta label="总投资（亿元）" value={p.invest} />
                    <Meta label="建设起止时间" value={p.duration} />
                    <Meta label="立项信息" value={p.approval} />
                    <Meta label="能评批复" value={p.energyApproval} />
                    <Meta label="环评批复" value={p.envApproval} />
                    <Meta label="用地" value={p.land} />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground/70">更新改造内容：</span>
                    {p.content}
                  </div>
                </div>
                {!readOnly && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 text-primary">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ArchiveSection>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground/70">{label}</div>
      <div className="font-medium text-foreground mt-0.5 truncate">{value || "—"}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border py-12 text-center">
      <AlertTriangle className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  );
}
