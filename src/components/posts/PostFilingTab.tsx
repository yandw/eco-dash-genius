import { useState } from "react";
import { Download, Upload, Save, RefreshCw, Edit2, X, UserCog, User, FileBox, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArchiveSection } from "@/components/archives/ArchiveField";
import { FileUploadList } from "./FileUploadList";
import { PostStaffTable } from "./PostStaffTable";
import type { PostFiling, LeaderInfo, OwnerInfo } from "@/mocks/posts";

interface Props {
  data: PostFiling;
  type: "energy" | "carbon";
  readOnly?: boolean;
}

const leaderFields: { key: keyof LeaderInfo; label: string; required?: boolean; mono?: boolean }[] = [
  { key: "name", label: "主管领导姓名", required: true },
  { key: "duty", label: "主管领导职务", required: true },
  { key: "title", label: "主管领导职称" },
  { key: "phone", label: "主管领导电话", mono: true },
  { key: "email", label: "主管领导邮箱" },
];

function ownerFields(type: "energy" | "carbon"): { key: keyof OwnerInfo; label: string; required?: boolean; mono?: boolean; type?: "bool" | "date" | "text" }[] {
  const certLabel = type === "energy" ? "是否取得能源管理岗位证书" : "是否取得碳排放管理岗位证书";
  return [
    { key: "name", label: "负责人姓名", required: true },
    { key: "department", label: "所在部门", required: true },
    { key: "duty", label: "职务" },
    { key: "title", label: "职称" },
    { key: "major", label: "专业" },
    { key: "education", label: "文化程度" },
    { key: "hasCert", label: certLabel, type: "bool" },
    { key: "certDate", label: "获证日期", type: "date", mono: true },
    { key: "certNo", label: "证书证号", mono: true },
    { key: "phone", label: "联系电话", mono: true },
    { key: "email", label: "邮箱" },
    { key: "filingDate", label: "备案日期", type: "date", mono: true },
  ];
}

export function PostFilingTab({ data, type, readOnly }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(data);
  const isEdit = !readOnly && editing;

  const renderField = (
    obj: any,
    setObj: (v: any) => void,
    f: { key: string; label: string; required?: boolean; mono?: boolean; type?: string },
  ) => {
    const value = obj[f.key];
    let display: string;
    if (f.type === "bool") display = value ? "是" : "否";
    else display = value || "—";

    return (
      <div key={f.key} className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          {f.required && <span className="text-destructive">*</span>}
          {f.label}
        </Label>
        {isEdit ? (
          f.type === "bool" ? (
            <select
              value={value ? "1" : "0"}
              onChange={(e) => setObj({ ...obj, [f.key]: e.target.value === "1" })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="1">是</option>
              <option value="0">否</option>
            </select>
          ) : (
            <Input
              defaultValue={String(value || "")}
              onChange={(e) => setObj({ ...obj, [f.key]: e.target.value })}
              type={f.type === "date" ? "date" : "text"}
              className={f.mono ? "font-mono text-sm" : "text-sm"}
            />
          )
        ) : (
          <div className={`text-sm font-medium text-foreground border-b border-border/60 pb-1.5 min-h-[28px] ${f.mono ? "font-mono" : ""}`}>
            {display}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作 */}
      <div className="flex flex-wrap items-center gap-2 justify-between bg-muted/30 rounded-lg p-3 border border-border/40">
        <div className="text-xs text-muted-foreground">
          最近更新：<span className="font-mono text-foreground">{data.updatedAt}</span>
        </div>
        <div className="flex gap-2">
          {!readOnly && (
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> 同步企业设置
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3.5 w-3.5 mr-1" /> 导出
          </Button>
          {!readOnly && (
            <Button variant="outline" size="sm" className="h-8">
              <Upload className="h-3.5 w-3.5 mr-1" /> 上传备案表
            </Button>
          )}
          {!readOnly && (
            isEdit ? (
              <>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => setEditing(false)}>
                  <X className="h-3.5 w-3.5 mr-1" /> 取消
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-gradient-primary text-primary-foreground border-0"
                  onClick={() => setEditing(false)}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> 保存
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="h-8 bg-gradient-primary text-primary-foreground border-0"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" /> 编辑领导与负责人信息
              </Button>
            )
          )}
        </div>
      </div>

      {/* 主管领导 */}
      <ArchiveSection
        title="主管领导信息"
        description="企业分管能源 / 碳排工作的主管领导"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {leaderFields.map((f) =>
            renderField(form.leader, (v) => setForm((s) => ({ ...s, leader: v })), f),
          )}
        </div>
      </ArchiveSection>

      {/* 负责人信息 */}
      <ArchiveSection
        title="负责人信息"
        description={`${type === "energy" ? "能源管理" : "碳排放管理"}岗位负责人详细资料`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {ownerFields(type).map((f) =>
            renderField(form.owner, (v) => setForm((s) => ({ ...s, owner: v })), f),
          )}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">工作经验</Label>
            {isEdit ? (
              <Textarea
                rows={4}
                defaultValue={form.owner.experience}
                onChange={(e) =>
                  setForm((s) => ({ ...s, owner: { ...s.owner, experience: e.target.value } }))
                }
              />
            ) : (
              <div className="text-sm text-foreground/90 border border-border/40 rounded-md bg-muted/20 p-3 min-h-[80px] leading-relaxed">
                {form.owner.experience || <span className="text-muted-foreground">—</span>}
              </div>
            )}
          </div>
        </div>
      </ArchiveSection>

      {/* 备案文件 */}
      <ArchiveSection
        title="备案文件"
        description="岗位备案表、证书扫描件等支撑材料"
      >
        <FileUploadList files={data.files} readOnly={readOnly} />
      </ArchiveSection>

      {/* 管理人员 */}
      <ArchiveSection
        title="管理人员名册"
        description={`从事${type === "energy" ? "能源" : "碳排放"}管理的全体岗位人员`}
      >
        <PostStaffTable staff={data.staff} readOnly={readOnly} />
      </ArchiveSection>
    </div>
  );
}
