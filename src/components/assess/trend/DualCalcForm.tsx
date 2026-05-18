import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DualCalcPanel } from "./DualCalcPanel";
import { INDUSTRY_LABEL, type IndustryKey } from "@/mocks/dualCalcDefaults";

// TODO: 从「企业设置」读取当前登录企业的行业类型
const CURRENT_ENT_INDUSTRY: IndustryKey = "fossil";

const INDUSTRIES: IndustryKey[] = ["fossil", "steel", "power", "other"];

interface Props {
  /** 是否显示行业选择（仅市级管理员） */
  withIndustryTabs?: boolean;
}

export function DualCalcForm({ withIndustryTabs = false }: Props) {
  const [industry, setIndustry] = useState<IndustryKey>("fossil");

  if (!withIndustryTabs) {
    return <DualCalcPanel industry={CURRENT_ENT_INDUSTRY} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">行业</span>
        <Select value={industry} onValueChange={(v) => setIndustry(v as IndustryKey)}>
          <SelectTrigger className="h-9 w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((k) => (
              <SelectItem key={k} value={k}>
                {INDUSTRY_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DualCalcPanel key={industry} industry={industry} />
    </div>
  );
}
