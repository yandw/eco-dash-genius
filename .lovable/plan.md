## 调整方案

### 1. 区/集团管理 — 列名改为"区名称"
- 文件：`src/pages/gov/AssessOrgs.tsx`
- 当前 Tab 切换时表格列「集团 / 区」共用变量 `groupColLabel = "集团"`，导致区管理单位 Tab 也显示"集团"。
- 改为按 Tab 动态：`tab === "district" ? "区名称" : "集团"`，应用到表头、新增/编辑弹窗中的字段标签 (Label) 与校验提示。

### 2. 任务管理 — 去掉外层白框 + 与"双控考核"页边距一致
- 文件：`src/pages/gov/AssessTasks.tsx`
- 「双控考核」页直接将内容渲染在 `AppLayout` 内（仅依赖 `AppLayout` 自带的 `p-6`），无外层 `div className="p-6"` 包裹。
- 当前任务管理外层是 `<div className="p-6 space-y-4">`，再加上年份筛选行用了 `<Card className="p-4">`，导致出现一个白色边框/背景容器。
- 调整：
  - 移除外层 `<div className="p-6 ...">`，改为 `<div className="space-y-4">`，复用 AppLayout 默认 `p-6` 边距。
  - 顶部「年份 + 新建任务」一行去掉 `<Card>` 包裹，直接 `<div className="flex items-center justify-between">`，无边框无背景。
  - 表格仍保留 `<Card>` 包裹（与图1中表格卡片一致）。

### 3. 新建任务弹窗
- 文件：`src/components/assess/AssessTaskFormDialog.tsx`
- 标题文案由「新建考核任务」→「新建任务」（编辑态保持「编辑任务」）。
- 年份从 `Select` 下拉改为「年份选择器」：复用现有 `AssessYearPicker` 组件，年份范围 `[currentYear-1, currentYear, currentYear+1, currentYear+2]`。
- 状态下拉项移除「已归档」，仅保留：未开始 / 进行中 / 已结束。
- 模板表头与企业名单列一致：
  - 文件：`src/mocks/assessTasks.ts` 中 `TASK_TEMPLATES`
  - 含区组（区下属单位碳排放目标分解、"百家""千家"通信业企业碳排放目标分解、区下属单位能耗考核）：
    `["区名称", "统一社会信用代码", "企业名称"]`
  - 不含区组（"百家""千家"通信业企业能耗考核）：
    `["统一社会信用代码", "企业名称"]`
  - 文件名按类型命名保持不变（.csv）。

### 4. 兼容性
- 类型 `AssessTaskStatus` 保留 4 项以兼容已有 seed 中的「已归档」记录的展示；仅在新建/编辑弹窗下拉中隐藏「已归档」选项。
- 仅前端改动，无后端变更。
