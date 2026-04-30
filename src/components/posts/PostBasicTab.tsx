import { useState } from "react";
import { Edit2, Save, X, Building2, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArchiveSection } from "@/components/archives/ArchiveField";
import type { BasicInfo } from "@/mocks/posts";

interface Props {
  data: BasicInfo;
  readOnly?: boolean;
}

const FIELDS = {
  base: [
    { key: "creditCode", label: "统一社会信用代码", required: true, mono: true },
    { key: "name", label: "企业名称", required: true },
    { key: "industry", label: "行业分类", required: true },
    { key: "park", label: "工业园区" },
    { key: "energyLevel", label: "能耗级别" },
    { key: "isWanjia", label: "是否万家企业" },
  ],
  reg: [
    { key: "capital", label: "注册资本（万元）", mono: true },
    { key: "registerDate", label: "注册日期", mono: true },
    { key: "legalRep", label: "法人代表" },
    { key: "group", label: "所属集团" },
  ],
  contact: [
    { key: "statName", label: "统计员姓名" },
    { key: "statPhone", label: "统计员电话", mono: true },
    { key: "fax", label: "传真", mono: true },
    { key: "postalCode", label: "邮编", mono: true },
  ],
  loc: [
    { key: "district", label: "企业所在区" },
    { key: "county", label: "所属区县" },
    { key: "address", label: "详细地址", colSpan: true },
    { key: "group", label: "所属集团", colSpan: true },
  ],
} as const;

export function PostBasicTab({ data, readOnly }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(data);
  const isEdit = !readOnly && editing;

  const renderField = (
    f: { key: string; label: string; required?: boolean; mono?: boolean; colSpan?: boolean },
  ) => {
    const value = (form as any)[f.key];
    const display = typeof value === "boolean" ? (value ? "是" : "否") : value || "—";
    return (
      <div key={f.key} className={`space-y-1.5 ${f.colSpan ? "md:col-span-2" : ""}`}>
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          {f.required && <span className="text-destructive">*</span>}
          {f.label}
        </Label>
        {isEdit ? (
          <Input
            defaultValue={String(value)}
            onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
            className={f.mono ? "font-mono text-sm" : "text-sm"}
          />
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
      {!readOnly && (
        <div className="flex justify-end gap-2">
          {isEdit ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="h-3.5 w-3.5 mr-1" /> 取消
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground border-0"
                onClick={() => setEditing(false)}
              >
                <Save className="h-3.5 w-3.5 mr-1" /> 保存
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> 编辑
            </Button>
          )}
        </div>
      )}

      <ArchiveSection title="基础资料" description="企业身份与行业归属">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {FIELDS.base.map(renderField)}
        </div>
      </ArchiveSection>

      <ArchiveSection title="注册信息" description="工商登记与归属信息">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {FIELDS.reg.map(renderField)}
        </div>
      </ArchiveSection>

      <ArchiveSection title="联系方式" description="日常沟通与统计员信息">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {FIELDS.contact.map(renderField)}
        </div>
      </ArchiveSection>

      <ArchiveSection title="地址信息" description="企业经营地址">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {FIELDS.loc.map(renderField)}
        </div>
      </ArchiveSection>
    </div>
  );
}
