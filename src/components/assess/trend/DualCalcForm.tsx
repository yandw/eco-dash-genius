import { DualCalcPanel } from "./DualCalcPanel";
import type { IndustryKey } from "@/mocks/dualCalcDefaults";

// TODO: 从「企业设置」读取当前登录企业的行业类型
// 目前默认 fossil，后续接入企业档案后改为动态获取
const CURRENT_ENT_INDUSTRY: IndustryKey = "fossil";

export function DualCalcForm() {
  return <DualCalcPanel industry={CURRENT_ENT_INDUSTRY} />;
}
