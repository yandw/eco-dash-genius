## 目标

仅 **市级管理员（city_admin）** 账号在「碳双控测算」界面顶部新增行业 Tab 切换：化工 / 钢铁 / 电力 / 工业其它。区级管理员、企业侧仍按当前登录企业所属行业展示单一表单（无 Tab）。

## 改动

### 1. `src/mocks/dualCalcDefaults.ts`
- 将 `INDUSTRY_LABEL.fossil` 由 `"化石"` 改为 `"化工"`（key `fossil` 不变，避免连锁修改）。

### 2. `src/components/assess/trend/DualCalcForm.tsx`
- 新增 prop `withIndustryTabs?: boolean`（默认 `false`）。
- 当 `withIndustryTabs === true`：渲染顶部 `Tabs`，4 个 `TabsTrigger`（化工/钢铁/电力/工业其它），每个 `TabsContent` 渲染对应 `<DualCalcPanel industry=... />`。默认值 `fossil`。
- 当 `false`：维持现状，按 `CURRENT_ENT_INDUSTRY` 渲染单一 `DualCalcPanel`。

### 3. `src/pages/gov/AssessTrend.tsx`（已限定 city_admin）
- `<DualCalcForm />` → `<DualCalcForm withIndustryTabs />`。

### 4. `src/pages/gov/AssessDualCalc.tsx`（市级 + 区级共用页面）
- 用 `isCityAdmin()` 决定是否传 `withIndustryTabs`：
  - city_admin：`<DualCalcForm withIndustryTabs />`
  - 其它：`<DualCalcForm />`（按企业所属行业渲染）

### 5. 企业侧 `EntAssessDualCalc.tsx`
- 不变，仍渲染 `<DualCalcForm />`。

## 视觉

- Tab 样式与 `AssessTrend` 现有 `TabsList grid md:grid-cols-4 w-full md:w-auto` 一致，置于页面顶部 / 当前 "当前行业" 信息卡之上。
- 切换 Tab 时上方"当前行业 · 双控测算"信息卡自动随所选行业刷新（DualCalcPanel 内部已绑定 `industry` prop）。

## 不改动

- `DualCalcPanel`、燃料缺省值、范围一/范围二表单结构。
- 路由、侧边栏菜单、其它角色的渲染逻辑。
