import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AssessOrg, OrgTab, CENTER_CONTACTS,
  useDistrictOrgs, useGroupOrgs, addOrg, updateOrg, removeOrg,
} from "@/mocks/assessOrgs";

type FormState = Omit<AssessOrg, "id">;

const emptyForm = (tab: OrgTab): FormState => ({
  group: "",
  unitType: tab === "district" ? "区" : "集团",
  status: "正常",
  unitName: "",
  ownerName: "",
  ownerPhone: "",
  address: "",
  centerContact: CENTER_CONTACTS[0],
});

export default function AssessOrgs() {
  const [tab, setTab] = useState<OrgTab>("district");
  const districts = useDistrictOrgs();
  const groups = useGroupOrgs();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AssessOrg | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm("district"));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [confirmDelete, setConfirmDelete] = useState<AssessOrg | null>(null);

  const list = tab === "district" ? districts : groups;
  const groupColLabel = "集团";

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm(tab));
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (row: AssessOrg) => {
    setEditing(row);
    const { id, ...rest } = row;
    setForm(rest);
    setErrors({});
    setDialogOpen(true);
  };

  const validate = (f: FormState) => {
    const e: Record<string, string> = {};
    if (!f.unitName.trim()) e.unitName = "请输入单位全称";
    if (!f.ownerName.trim()) e.ownerName = "请输入单位负责人";
    if (!f.group.trim()) e.group = "请输入" + groupColLabel;
    if (f.ownerPhone && !/^\d{7,11}$/.test(f.ownerPhone.trim())) e.ownerPhone = "联系方式格式不正确";
    return e;
  };

  const submit = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    const result = editing
      ? updateOrg(tab, editing.id, form)
      : addOrg(tab, form);
    if (!result.ok) {
      setErrors({ unitName: result.reason || "校验失败" });
      return;
    }
    toast.success(editing ? "已更新" : "已新增");
    setDialogOpen(false);
  };

  const doDelete = () => {
    if (!confirmDelete) return;
    removeOrg(tab, confirmDelete.id);
    toast.success("已删除");
    setConfirmDelete(null);
  };

  return (
    <AppLayout title="区/集团管理" subtitle="考核管理 / 区/集团管理" side="gov">
      <div className="panel p-5">
        <Tabs value={tab} onValueChange={(v) => setTab(v as OrgTab)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="district">区管理单位</TabsTrigger>
              <TabsTrigger value="group">企业集团</TabsTrigger>
            </TabsList>
            <Button onClick={openAdd} className="gap-1.5">
              <Plus className="h-4 w-4" /> 新增
            </Button>
          </div>

          <TabsContent value={tab} className="mt-0">
            <div className="rounded-md border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">序号</TableHead>
                    <TableHead>{groupColLabel}</TableHead>
                    <TableHead>单位全称</TableHead>
                    <TableHead>单位负责人</TableHead>
                    <TableHead>地址</TableHead>
                    <TableHead>中心对口人</TableHead>
                    <TableHead className="w-20">状态</TableHead>
                    <TableHead className="w-32">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.group}</TableCell>
                      <TableCell>{r.unitName}</TableCell>
                      <TableCell>
                        <div className="text-sm">{r.ownerName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{r.ownerPhone}</div>
                      </TableCell>
                      <TableCell className="max-w-[220px] text-xs">{r.address}</TableCell>
                      <TableCell>{r.centerContact}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-0",
                            r.status === "正常"
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-primary" onClick={() => openEdit(r)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> 编辑
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => setConfirmDelete(r)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> 删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 新增/编辑 弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{tab === "district" ? "区管理单位" : "企业集团"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <Field label={groupColLabel} required error={errors.group}>
              <Input value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} />
            </Field>

            <Field label="单位类型">
              <Select value={form.unitType} onValueChange={(v) => setForm({ ...form, unitType: v as "区" | "集团" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="区">区</SelectItem>
                  <SelectItem value="集团">集团</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="状态">
              <div className="inline-flex rounded-md border border-input p-0.5">
                {(["正常", "关闭"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={cn(
                      "px-4 h-7 text-xs rounded-sm transition-colors",
                      form.status === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="单位全称" required error={errors.unitName}>
              <Input value={form.unitName} onChange={(e) => setForm({ ...form, unitName: e.target.value })} />
            </Field>

            <Field label="单位负责人" required error={errors.ownerName}>
              <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
            </Field>

            <Field label="联系方式" error={errors.ownerPhone}>
              <Input value={form.ownerPhone} onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })} />
            </Field>

            <Field label="联系地址">
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>

            <Field label="中心对口人">
              <Select value={form.centerContact} onValueChange={(v) => setForm({ ...form, centerContact: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CENTER_CONTACTS.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={submit}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除「{confirmDelete?.unitName}」吗？该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3">
      <Label className="pt-2 text-right text-sm">
        {required && <span className="text-destructive mr-0.5">*</span>}
        {label}
      </Label>
      <div>
        {children}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    </div>
  );
}
