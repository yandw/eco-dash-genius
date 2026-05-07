import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  AssessTask,
  AssessTaskStatus,
  AssessTaskType,
  TASK_TEMPLATES,
  buildMockEnterprises,
  createTask,
  updateTask,
} from "@/mocks/assessTasks";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task?: AssessTask | null;
}

const TYPES: AssessTaskType[] = [
  "区下属单位碳排放目标分解",
  "\"百家\"、\"千家\"、通信业企业碳排放目标分解",
  "区下属单位能耗考核",
  "\"百家\"、\"千家\"、通信业企业能耗考核",
];
const STATUSES: AssessTaskStatus[] = ["未开始", "进行中", "已结束"];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

function downloadCsv(fileName: string, headers: string[]) {
  const csv = "\uFEFF" + headers.join(",") + "\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AssessTaskFormDialog({ open, onOpenChange, task }: Props) {
  const isEdit = !!task;
  const [year, setYear] = useState<number>(currentYear);
  const [type, setType] = useState<AssessTaskType>(TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<AssessTaskStatus>("未开始");
  const [fileName, setFileName] = useState<string | undefined>();
  const [entCount, setEntCount] = useState<number>(0);

  useEffect(() => {
    if (open) {
      if (task) {
        setYear(task.year);
        setType(task.type);
        setStartDate(task.startDate);
        setEndDate(task.endDate);
        setStatus(task.status);
        setFileName(task.enterpriseFileName);
        setEntCount(task.enterprises.length);
      } else {
        setYear(currentYear);
        setType(TYPES[0]);
        setStartDate("");
        setEndDate("");
        setStatus("未开始");
        setFileName(undefined);
        setEntCount(0);
      }
    }
  }, [open, task]);

  const template = TASK_TEMPLATES[type];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setEntCount(Math.floor(Math.random() * 13) + 3);
    toast.success(`已上传：${f.name}`);
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast.error("请填写开始时间与结束时间");
      return;
    }
    if (endDate < startDate) {
      toast.error("结束时间不能早于开始时间");
      return;
    }
    if (!fileName && !isEdit) {
      toast.error("请上传企业名单");
      return;
    }

    if (isEdit && task) {
      updateTask(task.id, {
        year,
        type,
        startDate,
        endDate,
        status,
        enterpriseFileName: fileName,
        enterprises:
          task.enterprises.length === entCount && task.type === type
            ? task.enterprises
            : buildMockEnterprises(type, entCount),
      });
      toast.success("任务已更新");
    } else {
      createTask({
        year,
        type,
        startDate,
        endDate,
        status,
        enterpriseFileName: fileName,
        enterprises: buildMockEnterprises(type, entCount),
      });
      toast.success("任务已创建");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑任务" : "新建任务"}</DialogTitle>
          <DialogDescription>
            填写任务基本信息并上传参与考核的企业名单。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>年份 <span className="text-destructive">*</span></Label>
            <AssessYearPicker year={year} onChange={setYear} years={YEARS} />
          </div>

          <div className="space-y-1.5">
            <Label>类型 <span className="text-destructive">*</span></Label>
            <Select value={type} onValueChange={(v) => setType(v as AssessTaskType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>开始时间 <span className="text-destructive">*</span></Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>结束时间 <span className="text-destructive">*</span></Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>状态</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AssessTaskStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>企业名单 <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFile}
                />
                <span className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm cursor-pointer hover:bg-accent/40">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {fileName ? fileName : "点击选择文件 (.xlsx/.xls/.csv)"}
                  </span>
                  {entCount > 0 && (
                    <span className="ml-auto text-xs text-primary">共 {entCount} 家</span>
                  )}
                </span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => downloadCsv(template.fileName, template.headers)}
              >
                <Download className="h-4 w-4" />
                下载模板
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              当前类型对应模板：{template.fileName}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>{isEdit ? "保存" : "创建任务"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
