## 目标

在政府侧（仅市级管理员可见）"考核管理"一级菜单下新增两个二级菜单：
1. **任务管理** —— 本轮先建占位页
2. **区/集团管理** —— 实现完整 CRUD 界面（参照图1/2/3）

## 一、菜单与路由

### `src/components/AppSidebar.tsx`
在 `govItems` 的"考核管理"子菜单中追加：
- `{ title: "任务管理", url: "/gov/assess/tasks", icon: ClipboardList }`
- `{ title: "区/集团管理", url: "/gov/assess/orgs", icon: Building2 }`

仅当 `isCityAdmin()` 为 true 时显示这两项（按现有 children 过滤模式）。

### `src/App.tsx`
新增路由：
- `/gov/assess/tasks` → `AssessTasks`（占位页，使用 `PlaceholderPage`）
- `/gov/assess/orgs` → `AssessOrgs`

## 二、区/集团管理页 `src/pages/gov/AssessOrgs.tsx`

### 布局
- 复用现有 gov 页面框架（`AppLayout` + 面包屑"考核管理 / 区/集团管理"）
- 顶部 Tabs：`区管理单位` | `企业集团`
- 右上角"新增"按钮
- 下方表格：序号 / 集团 / 单位全称 / 单位负责人(姓名+电话) / 地址 / 中心对口人 / 状态(正常/关闭 Badge) / 操作(编辑/删除)

> 表头按答复将"区/集团"列改为"集团"。

### 新增/编辑弹窗（Dialog）
字段（与图3一致）：
- 集团（文本）
- 单位类型（Select：区 / 集团）—— 区管理单位 Tab 默认"区"，企业集团 Tab 默认"集团"
- 状态（Toggle：正常 / 关闭）
- *单位全称（必填）
- *单位负责人（必填）
- 联系方式（手机号）
- 联系地址
- 中心对口人（Select：李雯/陈玲凯/蒋伊莹/刘鑫/贾连海/李婕…取自现有 mock 列表）

提交时校验：
- 必填项非空
- 手机号格式（11位数字，可选）
- **去重**：在当前 Tab 内，"单位全称"不可与其他记录重复（编辑时排除自身），重复时表单错误提示"该单位已存在"

### 删除
点击删除 → `AlertDialog` 二次确认 → 从 mock store 移除 → toast 成功提示。

### Mock 数据 `src/mocks/assessOrgs.ts`
两个数组 + 简易 store（参考 `bqAssessStore.ts` 的 `useSyncExternalStore` 模式）：
- `districtOrgs`（区管理单位）：黄浦/青浦/嘉定/虹口/长宁/徐汇 等 ~6 条
- `groupOrgs`（企业集团）：华谊/建材/高桥石化/上海石化/华虹 等 ~5 条

每条字段：`{ id, group, unitType: "区"|"集团", status: "正常"|"关闭", unitName, ownerName, ownerPhone, address, centerContact }`

Store 暴露：`useDistrictOrgs / useGroupOrgs / addOrg / updateOrg / removeOrg`，新增/更新内部做单位全称去重并返回 boolean。

## 三、任务管理占位页 `src/pages/gov/AssessTasks.tsx`

复用 `PlaceholderPage` 组件，文案"任务管理 · 建设中"。

## 四、文件清单

新增：
- `src/pages/gov/AssessOrgs.tsx`
- `src/pages/gov/AssessTasks.tsx`
- `src/mocks/assessOrgs.ts`

修改：
- `src/components/AppSidebar.tsx`（考核管理 children + 市级权限过滤）
- `src/App.tsx`（两条路由）

## 技术细节

- 全部使用 shadcn 组件：`Tabs/Dialog/AlertDialog/Table/Input/Select/Button/Badge/Switch`
- 颜色用语义 token（`bg-primary`、`text-success` 等），不写自定义颜色
- 状态 Badge：正常 → `bg-success/10 text-success`；关闭 → `bg-muted text-muted-foreground`
- 表单使用受控 state + zod 校验（与项目其他表单一致即可，简单场景手写校验亦可）
