## 目标
趋势分解只保留"整段（单一终点年）"模式，去掉"逐年（2026–2030）"Tab 与对应子界面/逻辑。

## 改动文件：`src/pages/gov/AssessTrendDecomp.tsx`

1. 删除 `Tabs/TabsList/TabsTrigger` 的 import，删除 `Granularity` 类型与 `granularity / setGranularity` state。
2. 删除逐年模式相关 state：`yearTargets / setYearTargets`、`viewYear / setViewYear`。
3. 删除 `decomposeMultiYear` 调用 (`multiYear` useMemo) 与 import；同样删除 `DEFAULT_YEAR_TARGETS` import。
4. `isYearly` 全部按 false 收敛：
   - `activeResults` = `singleResults`，`activeAllocatable` = `allocatable`
   - `endYearTarget` = `targetYear`，`cityTotalForCompare` = `totalQuotaInput`
   - `trendData` 仅保留整段线性插值分支
   - `overLocked` 用 `allocatable` 比较
5. 顶部"全市目标设置"卡：删除右上角 Tabs 切换器，保留单一终点年 UI（目标年度 / 全市总量目标 / 储备 / 可分解额度），删除逐年 6 列输入区与 "默认按等比下降至 2030 年 −12%" 提示。
6. 副标题改为：`基于权重算法将全市碳排放总量目标按区进行分解`（去掉"支持整段与逐年两种模式"）。
7. "区维度参数表"卡：删除 `isYearly` 条件块（"展示年份分配额度"提示、年份 Select 选择器）。
8. 表头/单元格涉及 `isYearly` 的分支清理：锁定值列说明改回"万吨"，去掉"·终点年"备注；区表标题列 `分配额度` 副行恒为 `(${targetYear} 年)`。
9. `reset()` 函数移除 `setGranularity / setYearTargets / setViewYear` 调用。

## 不动
- `src/lib/trendDecomp.ts`、`src/mocks/trendDecompDefaults.ts` 文件保留 `decomposeMultiYear` / `DEFAULT_YEAR_TARGETS` 等导出（不再被引用，但避免连带影响），仅页面层去引用即可。
- 算法、能耗维度、锁定逻辑、图表等其他部分不变。
