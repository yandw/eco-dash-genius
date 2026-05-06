import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface StampedDocFile {
  name: string;
  size: number;
  type: string;
  url: string; // object URL for real download
  uploadedAt: string;
  uploadedBy: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: number;
  initialFile?: StampedDocFile;
  onConfirm: (file: StampedDocFile) => void;
}

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function StampedDocDialog({ open, onOpenChange, year, initialFile, onConfirm }: Props) {
  const [staged, setStaged] = useState<StampedDocFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      // Cleanup transient state when closed
      if (timerRef.current) window.clearInterval(timerRef.current);
      setStaged(null);
      setProgress(0);
      setUploading(false);
      setDragOver(false);
    }
  }, [open]);

  const startUpload = (file: File) => {
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      toast.error("仅支持 PDF / JPG / PNG 格式");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("文件大小不能超过 10MB");
      return;
    }
    setUploading(true);
    setProgress(0);
    setStaged(null);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 6;
        if (next >= 100) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          const url = URL.createObjectURL(file);
          setStaged({
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            url,
            uploadedAt: new Date().toLocaleString("zh-CN"),
            uploadedBy: "区级管理员（青浦区）",
          });
          setUploading(false);
          return 100;
        }
        return next;
      });
    }, 180);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) startUpload(f);
  };

  const removeStaged = () => {
    if (staged) URL.revokeObjectURL(staged.url);
    setStaged(null);
    setProgress(0);
  };

  const confirm = () => {
    if (!staged) {
      toast.warning("请先上传文件");
      return;
    }
    onConfirm(staged);
    onOpenChange(false);
    toast.success("盖章证明已保存");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>上传盖章证明 · {year}年</DialogTitle>
          <DialogDescription>
            请上传带有公章的目标分解确认文件，支持 PDF / JPG / PNG，大小不超过 10MB。
          </DialogDescription>
        </DialogHeader>

        {initialFile && !staged && !uploading && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
            <div className="text-muted-foreground mb-1">当前已上传：</div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium truncate">{initialFile.name}</span>
              <span className="text-muted-foreground">({formatSize(initialFile.size)})</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {initialFile.uploadedBy} · {initialFile.uploadedAt}
            </div>
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "rounded-md border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-accent/30",
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={onPick} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <div className="text-sm text-foreground">
            点击或拖拽文件到此处上传
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            支持 PDF / JPG / PNG，单文件 ≤ 10MB
          </div>
        </div>

        {(uploading || staged) && (
          <div className="rounded-md border border-border p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium truncate flex-1">
                {staged?.name ?? "正在上传..."}
              </span>
              {staged && (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={removeStaged}
                    title="移除"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
            <Progress value={progress} className="h-1.5" />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{staged ? formatSize(staged.size) : "上传中..."}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={confirm} disabled={!staged || uploading}>确认提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
