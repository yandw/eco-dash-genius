import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DualCalcPanel } from "./DualCalcPanel";
import { INDUSTRY_LABEL, type IndustryKey } from "@/mocks/dualCalcDefaults";

// TODO: 从「企业设置」读取当前登录企业的行业类型
// 目前默认 fossil，后续接入企业档案后改为动态获取
const CURRENT_ENT_INDUSTRY: IndustryKey = "fossil";

const INDUSTRIES: IndustryKey[] = ["fossil", "steel", "power", "other"];

interface Props {
  /** 是否显示行业 Tab 切换（仅市级管理员） */
  withIndustryTabs?: boolean;
}

export function DualCalcForm({ withIndustryTabs = false }: Props) {
  if (!withIndustryTabs) {
    return <DualCalcPanel industry={CURRENT_ENT_INDUSTRY} />;
  }

  return (
    <Tabs defaultValue="fossil" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
        {INDUSTRIES.map((k) => (
          <TabsTrigger key={k} value={k}>
            {INDUSTRY_LABEL[k]}
          </TabsTrigger>
        ))}
      </TabsList>
      {INDUSTRIES.map((k) => (
        <TabsContent key={k} value={k} className="mt-4">
          <DualCalcPanel industry={k} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
