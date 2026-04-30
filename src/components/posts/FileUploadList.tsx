import { useRef, useState } from "react";
import { Upload, FileText, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { FilingFile } from "@/mocks/posts";

interface Props {
  files: FilingFile[];
  readOnly?: boolean;
  enterpriseName?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function downloadSample(name: string) {
  const a = document.createElement("a");
  a.href = "/exports/" + encodeURIComponent("三井高科技（上海）有限公司.pdf");
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function FileUploadList({ files: initial, readOnly, enterpriseName = "" }: Props) {
  const [files, setFiles] = useState<FilingFile[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<FilingFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const oversized: string[] = [];
    const added: FilingFile[] = [];
    Array.from(list).forEach((f) => {
      if (f.size > 20 * 1024 * 1024) {
        oversized.push(f.name);
        return;
      }
      added.push({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        size: formatSize(f.size),
        uploadedAt: ts,
      });
    });
    if (added.length > 0) {
      setFiles((prev) => [...added, ...prev]);
      toast({ title: "上传成功", description: `已添加 ${added.length} 个文件` });
    }
    if (oversized.length > 0) {
      toast({ title: "部分文件超过 20MB", description: oversized.join("、"), variant: "destructive" });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setFiles((prev) => prev.filter((x) => x.id !== pendingDelete.id));
    toast({ title: "已删除", description: pendingDelete.name });
    setPendingDelete(null);
  };

  return (
    <div className="space-y-3">
      {!readOnly && (
        <label className="block border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-lg p-6 text-center cursor-pointer transition-colors">
          <Upload className="h-7 w-7 text-primary mx-auto mb-2" />
          <div className="text-sm font-medium text-foreground">点击或拖拽文件上传</div>
          <div className="text-xs text-muted-foreground mt-1">
            支持 PDF / Word / 图片，单个文件不超过 20MB
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
      )}

      {files.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border/40 rounded-md">
          暂未上传备案文件
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 rounded-md border border-border/60 bg-card/50 hover:bg-accent/30 transition-colors"
            >
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">{f.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {f.size} · {f.uploadedAt}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-primary"
                onClick={() => downloadSample(f.name)}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> 预览
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-primary"
                onClick={() => downloadSample(f.name)}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive"
                  onClick={() => setPendingDelete(f)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除文件？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除 <span className="font-medium text-foreground">{pendingDelete?.name}</span>，此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
