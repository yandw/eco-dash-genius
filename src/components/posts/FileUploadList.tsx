import { Upload, FileText, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FilingFile } from "@/mocks/posts";

interface Props {
  files: FilingFile[];
  readOnly?: boolean;
}

export function FileUploadList({ files, readOnly }: Props) {
  return (
    <div className="space-y-3">
      {!readOnly && (
        <label className="block border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-lg p-6 text-center cursor-pointer transition-colors">
          <Upload className="h-7 w-7 text-primary mx-auto mb-2" />
          <div className="text-sm font-medium text-foreground">点击或拖拽文件上传</div>
          <div className="text-xs text-muted-foreground mt-1">
            支持 PDF / Word / 图片，单个文件不超过 20MB
          </div>
          <input type="file" multiple className="hidden" />
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
              <Button variant="ghost" size="sm" className="h-8 px-2 text-primary">
                <Eye className="h-3.5 w-3.5 mr-1" /> 预览
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-primary">
                <Download className="h-3.5 w-3.5" />
              </Button>
              {!readOnly && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
