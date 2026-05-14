## 目标

1. 将现有 `/gov/assess/trend` 页面下的"双控测算" Tab 改名为"**碳双控测算**"。
2. 在**区级管理员（gov 侧）**和**企业侧**的"考核管理"二级菜单中，分别增加"**碳双控测算**"入口，复用同一份表单（DualCalcForm）。

## 改动清单

### 1. 文案重命名

- `src/pages/gov/AssessTrend.tsx`
  - `<TabsTrigger value="dual-calc">双控测算</TabsTrigger>` → `碳双控测算`

### 2. 新增独立页面（gov 侧 - 区级管理员可见）

- 新建 `src/pages/gov/AssessDualCalc.tsx`
  - 使用 `AppLayout`，标题"碳双控测算"，副标题"考核管理 / 碳双控测算"
  - 内容直接渲染 `<DualCalcForm />`
  - 不限制角色（city_admin 与 district_admin 都能进；enterprise 不会走 gov 路由）

- `src/App.tsx` 注册路由：`/gov/assess/dual-calc` → `AssessDualCalc`

- `src/components/AppSidebar.tsx` 在 `govItems` 的"考核管理"子菜单中追加：
  - `{ title: "碳双控测算", url: "/gov/assess/dual-calc", icon: Gauge }`
  - 该项**对所有 gov 角色显示**（不再包在 `isCityAdmin()` 里），从而满足"区级管理员账号下也能看到"

### 3. 新增独立页面（企业侧）

- 新建 `src/pages/ent/EntAssessDualCalc.tsx`
  - 使用企业侧 `AppLayout`（`side="ent"`），标题"碳双控测算"
  - 内容渲染 `<DualCalcForm />`（DualCalcForm 内部已根据 `CURRENT_ENT_INDUSTRY` 渲染对应行业表单，企业侧逻辑天然契合）

- `src/App.tsx` 注册路由：`/ent/assess/dual-calc` → `EntAssessDualCalc`

- `src/components/AppSidebar.tsx` 在 `entItems` 的"考核管理"子菜单中追加：
  - `{ title: "碳双控测算", url: "/ent/assess/dual-calc", icon: Gauge }`

### 4. 关于 `/gov/assess/trend` 内的那个 Tab

- 保留（仅市级管理员可见，便于内部对照测算），仅做改名为"碳双控测算"。
- 如不希望保留可在确认后再删除该 Tab。

## 不改动

- `DualCalcForm` / `DualCalcPanel` / `dualCalcDefaults.ts` 内部逻辑与表单结构均不变，三处入口共用同一组件。
- 其他考核管理子菜单顺序与权限。

## 待确认

- `/gov/assess/trend` 内的"碳双控测算" Tab 是否需要**同时移除**（因为已抽出独立菜单）？默认**保留**并仅改名，如需移除请在批准计划时说明。
