import { Users, Plus, Search, FileText } from "lucide-react";
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

const stats = [
  { label: "在岗能源管理人员", value: 6, color: "text-primary bg-primary/10" },
  { label: "已备案", value: 5, color: "text-success bg-success/10" },
  { label: "待备案", value: 1, color: "text-warning bg-warning/10" },
  { label: "证书到期提醒", value: 2, color: "text-destructive bg-destructive/10" },
];

const records = [
  { name: "张建国", post: "能源管理负责人", cert: "高级能源管理师", certNo: "EM-2021-00321", status: "已备案", date: "2023-06-12" },
  { name: "李文博", post: "能源管理员", cert: "中级能源管理师", certNo: "EM-2022-01187", status: "已备案", date: "2024-03-08" },
  { name: "王晓敏", post: "能源计量员", cert: "能源计量员（一级）", certNo: "EC-2023-00942", status: "已备案", date: "2024-09-21" },
  { name: "陈思远", post: "能源管理员", cert: "中级能源管理师", certNo: "EM-2024-02013", status: "待备案", date: "—" },
  { name: "赵海涛", post: "能源审计员", cert: "注册能源审计师", certNo: "EA-2020-00456", status: "证书将到期", date: "2022-11-05" },
];

const statusColor: Record<string, string> = {
  已备案: "bg-success/15 text-success border-success/30",
  待备案: "bg-warning/15 text-warning border-warning/30",
  证书将到期: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function EntPosts() {
  return (
    <AppLayout side="ent" title="岗位备案" subtitle="企业能源管理岗位人员的任职、备案与证书管理">
      {/* 统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="panel p-4">
            <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className="text-2xl font-bold font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="按姓名 / 证书编号搜索..." className="pl-8 h-9" />
          </div>
          <Button variant="outline" className="h-9">导出名册</Button>
          <Button className="bg-gradient-primary text-primary-foreground border-0 h-9 ml-auto">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            新增备案
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>岗位</TableHead>
              <TableHead>资格证书</TableHead>
              <TableHead>证书编号</TableHead>
              <TableHead>备案日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.certNo}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{r.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    {r.post}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{r.cert}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.certNo}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.date}</TableCell>
                <TableCell>
                  <Badge className={`${statusColor[r.status]} border`}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-primary">查看</Button>
                  <Button variant="ghost" size="sm" className="text-primary">变更</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
