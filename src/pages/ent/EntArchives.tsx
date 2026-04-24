import { FolderArchive, Upload, Search, FileText } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categories = [
  { name: "节能管理制度", count: 12, color: "text-primary bg-primary/10" },
  { name: "节能技改项目", count: 8, color: "text-success bg-success/10" },
  { name: "能源审计报告", count: 5, color: "text-secondary bg-secondary/10" },
  { name: "培训与考核记录", count: 23, color: "text-warning bg-warning/10" },
  { name: "计量器具档案", count: 47, color: "text-primary bg-primary/10" },
  { name: "其他文件", count: 16, color: "text-muted-foreground bg-muted" },
];

const files = [
  { name: "2024年度能源审计报告.pdf", type: "审计报告", size: "4.2 MB", date: "2025-01-12", status: "已归档" },
  { name: "节能技改项目-余热回收装置可研报告.docx", type: "技改项目", size: "1.8 MB", date: "2024-12-08", status: "已归档" },
  { name: "能源管理体系内审记录.pdf", type: "管理制度", size: "860 KB", date: "2024-11-25", status: "已归档" },
  { name: "重点用能设备能效检测报告.pdf", type: "计量器具", size: "2.1 MB", date: "2024-11-10", status: "已归档" },
  { name: "节能法规培训记录-2024Q4.xlsx", type: "培训记录", size: "320 KB", date: "2024-10-20", status: "已归档" },
];

export default function EntArchives() {
  return (
    <AppLayout side="ent" title="节能档案" subtitle="企业内部节能管理文件的统一归档与检索">
      {/* 分类卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {categories.map((c) => (
          <div key={c.name} className="panel p-4 hover:border-primary/40 cursor-pointer transition-all">
            <div className={`h-9 w-9 rounded-lg ${c.color} flex items-center justify-center mb-2`}>
              <FolderArchive className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{c.name}</div>
            <div className="text-xl font-bold font-mono">{c.count}</div>
          </div>
        ))}
      </div>

      {/* 工具栏 + 列表 */}
      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="按文件名 / 编号搜索..." className="pl-8 h-9" />
          </div>
          <Button variant="outline" className="h-9">高级筛选</Button>
          <Button className="bg-gradient-primary text-primary-foreground border-0 h-9 ml-auto">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            上传档案
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文件名</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>归档日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((f) => (
              <TableRow key={f.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{f.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    {f.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{f.size}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{f.date}</TableCell>
                <TableCell>
                  <Badge className="bg-success/15 text-success border-success/30 border">
                    {f.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary">预览</Button>
                  <Button variant="ghost" size="sm" className="text-primary">下载</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
