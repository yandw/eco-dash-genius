# 市级管理员能碳测算调整

## 1. 侧边栏菜单调整 (`src/components/AppSidebar.tsx`)

在 `考核管理` 的 `isCityAdmin()` 分支中：
- 删除 `{ title: "碳双控测算", url: "/gov/assess/dual-calc", icon: Gauge }`（仅市级管理员看不到，企业侧保留）。等等——查代码，"碳双控测算"实际在 `isCityAdmin()` 外面对所有人显示。需求是"市级管理员的二级菜单去掉"，所以改为：将该项放入非市级管理员的分支显示（区级才显示），市级管理员不显示。
- 将 `碳排测算` 项的 title 由 `"碳排测算"` 改为 `"能碳测算"`。

## 2. AssessTrend 页面调整 (`src/pages/gov/AssessTrend.tsx`)

- 页面标题、subtitle、h1 文案均由"碳排测算"改为"能碳测算"。
- 移除 `dual-calc` Tab 与对应 `TabsContent`（已在菜单里独立入口；同时第1点提到去掉菜单中的碳双控测算——保留 dual-calc 页面路由本身，但本"能碳测算"Tab 列表不再包含它）。
- TabsList 改为 4 列。

## 3. IncrementPanel / IntensityPanel 隐藏图表

需求："4个tab，去掉每个tab的柱状图、趋势图，只保留测算表格，默认保留1行数据"。

仅在市级管理员场景生效。当前这两个组件只在 `AssessTrend`（市级专属页）使用，所以可直接修改组件：
- `src/components/assess/trend/IncrementPanel.tsx`：移除底部 `<TrendChart .../>` 渲染；初始 `rows` 改为 `initial.slice(0, 1)`，重置同理。
- `src/components/assess/trend/IntensityPanel.tsx`：同上。

（不删除 `TrendChart` 导入与 chartData 计算？为简洁起见一并删除未使用导入。）

## 4. 碳双控测算 界面：行业改为下拉选择

修改 `src/components/assess/trend/DualCalcForm.tsx`：
- 当 `withIndustryTabs=true` 时，不再渲染 `Tabs`，改为顶部一个"行业"`<Select>`（使用 `INDUSTRY_LABEL` 4 个选项：化工 / 钢铁 / 电力 / 工业其它），下方根据所选 industry 渲染单个 `<DualCalcPanel industry={selected} />`。
- 默认值 `fossil`。
- 布局：标签"行业"+ Select，约 w-48，右对齐于卡片或顶部条。

此改动同时影响：
- `/gov/assess/dual-calc`（`AssessDualCalc.tsx`，市级管理员 `withIndustryTabs=true`）——符合需求。
- `AssessTrend` 中的 dual-calc tab 已按第2点移除，无影响。

## 技术细节

- `isCityAdmin()` 判断保持。
- `withIndustryTabs` 参数语义保持不变（true=多行业可切；现以 Select 形式呈现）。
- 表格"默认保留1行数据"指页面首次进入时只显示 1 行，用户仍可"新增情景"。
- 不删除 `TrendChart`、`dual-calc` 路由、`AssessTrendDecomp` 等代码。
