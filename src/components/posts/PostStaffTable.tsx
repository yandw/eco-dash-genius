import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Check, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { StaffMember } from "@/mocks/posts";

interface Props {
  staff: StaffMember[];
  readOnly?: boolean;
}

const NEW_ID = "__new__";

function emptyDraft(): StaffMember {
  return { id: NEW_ID, name: "", role: "", hireDate: "", techTitle: "", hasCert: false, certNo: "", phone: "" };
}

export function PostStaffTable({ staff: initial, readOnly }: Props) {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<StaffMember[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StaffMember | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StaffMember | null>(null);
  const { toast } = useToast();

  const filtered = rows.filter(
    (s) =>
      !keyword ||
      s.name.includes(keyword) ||
      s.certNo.includes(keyword) ||
      s.phone.includes(keyword),
  );

  const validate = (d: StaffMember): string | null => {
    if (!d.name.trim()) return "请填写姓名";
    if (!d.role.trim()) return "请填写岗位分工";
    if (!d.phone.trim()) return "请填写联系电话";
    if (!/^1\d{10}$/.test(d.phone)) return "联系电话格式不正确（11 位手机号）";
    if (d.hasCert && !d.certNo.trim()) return "已取证时必须填写证书证号";
    return null;
  };

  const startAdd = () => {
    setDraft(emptyDraft());
    setEditingId(NEW_ID);
  };
  const startEdit = (s: StaffMember) => {
    setDraft({ ...s });
    setEditingId(s.id);
  };
  const cancelEdit = () => {
    setDraft(null);
    setEditingId(null);
  };
  const save = () => {
    if (!draft) return;
    const err = validate(draft);
    if (err) {
      toast({ title: "校验失败", description: err, variant: "destructive" });
      return;
    }
    if (editingId === NEW_ID) {
      const newRow = { ...draft, id: `s-${Date.now()}` };
      setRows((p) => [newRow, ...p]);
      toast({ title: "新增成功", description: draft.name });
    } else {
      setRows((p) => p.map((r) => (r.id === editingId ? { ...draft } : r)));
      toast({ title: "保存成功", description: draft.name });
    }
    cancelEdit();
  };
  const confirmDelete = () => {
    if (!pendingDelete) return;
    setRows((p) => p.filter((r) => r.id !== pendingDelete.id));
    toast({ title: "已删除", description: pendingDelete.name });
    setPendingDelete(null);
  };

  const renderEditCells = () => {
    if (!draft) return null;
    return (
      <>
        <TableCell><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="姓名" className="h-8" /></TableCell>
        <TableCell><Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="岗位分工" className="h-8" /></TableCell>
        <TableCell><Input type="date" value={draft.hireDate} onChange={(e) => setDraft({ ...draft, hireDate: e.target.value })} className="h-8 font-mono" /></TableCell>
        <TableCell><Input value={draft.techTitle} onChange={(e) => setDraft({ ...draft, techTitle: e.target.value })} placeholder="技术职称" className="h-8" /></TableCell>
        <TableCell>
          <select
            value={draft.hasCert ? "1" : "0"}
            onChange={(e) => setDraft({ ...draft, hasCert: e.target.value === "1" })}
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="1">是</option>
            <option value="0">否</option>
          </select>
        </TableCell>
        <TableCell><Input value={draft.certNo} onChange={(e) => setDraft({ ...draft, certNo: e.target.value })} placeholder="证书证号" className="h-8 font-mono text-xs" /></TableCell>
        <TableCell><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="11 位手机号" className="h-8 font-mono text-xs" /></TableCell>
        <TableCell className="text-right whitespace-nowrap">
          <Button variant="ghost" size="sm" className="text-success h-8 px-2" onClick={save}>
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2" onClick={cancelEdit}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </TableCell>
      </>
    );
  };

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
          <Button
            size="sm"
            className="h-9 bg-gradient-primary text-primary-foreground border-0 ml-auto"
            onClick={startAdd}
            disabled={editingId !== null}
          >
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
            {editingId === NEW_ID && (
              <TableRow className="bg-primary/5">{renderEditCells()}</TableRow>
            )}
            {filtered.length === 0 && editingId !== NEW_ID ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 7 : 8} className="text-center text-xs text-muted-foreground py-8">
                  暂无管理人员
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) =>
                editingId === s.id ? (
                  <TableRow key={s.id} className="bg-primary/5">{renderEditCells()}</TableRow>
                ) : (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {s.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.hireDate || "—"}</TableCell>
                    <TableCell className="text-sm">{s.techTitle || "—"}</TableCell>
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
                    <TableCell className="font-mono text-xs">{s.certNo || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{s.phone}</TableCell>
                    {!readOnly && (
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" className="text-primary h-8 px-2" onClick={() => startEdit(s)} disabled={editingId !== null}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => setPendingDelete(s)} disabled={editingId !== null}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该人员？</AlertDialogTitle>
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
