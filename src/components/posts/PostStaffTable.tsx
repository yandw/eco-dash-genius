import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { StaffMember } from "@/mocks/posts";

interface Props {
  staff: StaffMember[];
  readOnly?: boolean;
}

export function PostStaffTable({ staff, readOnly }: Props) {
  const [keyword, setKeyword] = useState("");
  const filtered = staff.filter(
    (s) =>
      !keyword ||
      s.name.includes(keyword) ||
      s.certNo.includes(keyword) ||
      s.phone.includes(keyword),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="按姓名 / 证书 / 电话搜索"
            className="pl-8 h-9"
          />
        </div>
        {!readOnly && (
          <Button size="sm" className="h-9 bg-gradient-primary text-primary-foreground border-0 ml-auto">
            <Plus className="h-3.5 w-3.5 mr-1" /> 新增人员
          </Button>
        )}
      </div>

      <div className="rounded-md border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>姓名</TableHead>
              <TableHead>岗位分工</TableHead>
              <TableHead>受聘时间</TableHead>
              <TableHead>技术职称</TableHead>
              <TableHead>是否取证</TableHead>
              <TableHead>证书证号</TableHead>
              <TableHead>联系电话</TableHead>
              {!readOnly && <TableHead className="text-right">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 7 : 8} className="text-center text-xs text-muted-foreground py-8">
                  暂无管理人员
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                      {s.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.hireDate}</TableCell>
                  <TableCell className="text-sm">{s.techTitle}</TableCell>
                  <TableCell>
                    {s.hasCert ? (
                      <span className="inline-flex items-center gap-1 text-success text-xs">
                        <Check className="h-3 w-3" /> 是
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                        <X className="h-3 w-3" /> 否
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.certNo}</TableCell>
                  <TableCell className="font-mono text-xs">{s.phone}</TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
