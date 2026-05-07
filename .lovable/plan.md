## 实施方案：任务管理筛选 + 倒计时 + 新增任务

### 1. 任务管理 · 增加"类型"筛选
文件：`src/pages/gov/AssessTasks.tsx`
- 在年份筛选 `Select` 后追加一个"类型" `Select`（宽度 ~260px）。
- 选项：全部 / 区下属单位碳排放目标分解 / "百家"、"千家"、通信业企业碳排放目标分解 / 区下属单位能耗考核 / "百家"、"千家"、通信业企业能耗考核。
- 新增 `type` state（默认 `all`），与 `year` 一起参与 `filtered` 过滤；切换时重置到第 1 页。

### 2. 任务结束倒计时
新增工具 `src/mocks/assessTasks.ts`：
- `daysUntil(endDate: string): number`：从今天到 `endDate` 的剩余天数（同日 = 0，已过期为负数）。
- `getActiveTask(year, types)`：返回该年第一条匹配的非归档任务（用于取 `endDate`）。

新增展示组件 `src/components/assess/TaskCountdownBadge.tsx`：
- 入参 `endDate`、可选 `label`（默认"距任务结束"）。
- 展示样式：胶囊徽标，`Clock` 图标 + `距任务结束 X 天`；
  - X > 7：`bg-primary/10 text-primary border border-primary/30`
  - 1 ≤ X ≤ 7：`bg-warning/10 text-warning border border-warning/30`
  - X = 0：显示"今日截止"，warning 配色
  - X < 0：显示"已截止 N 天"，`bg-muted text-muted-foreground`
- 同时显示 `截止 YYYY-MM-DD` 小字（hover tooltip / 同行展示均可）。

接入位置（仅 UI 层添加，业务逻辑不动；位置统一放在每页"报告年度"面板右侧或 Tab 内右上）：
- 政府侧 · 市级
  - `src/pages/gov/AssessGoal.tsx`：每个 Tab 内容右上角根据 Tab 类型显示对应任务的倒计时。
  - `src/pages/gov/AssessDual.tsx`：同上。
- 政府侧 · 区级
  - `AssessGoal.tsx` 区级分支：显示"区下属单位碳排放目标分解"当年任务倒计时。
  - `AssessDual.tsx` 区级分支：显示"区下属单位能耗考核"当年任务倒计时（放在操作栏左侧）。
- 企业侧
  - `src/pages/ent/EntAssessGoal.tsx`：根据 `scope` 取对应任务（区管→区下属单位…，市管→百千通…）的倒计时，放在"填报状态"右侧或独立一行。
  - `src/pages/ent/EntAssessDual.tsx`：根据 `entType` 取对应能耗考核任务的倒计时；区管视图放在"系统判定提示"行；市管视图传入 `EntAssessDualBqBody` 顶部（该组件内顶部新增插槽或在外层包一层 div 显示）。

最简实现：在每个调用点用 `getActiveTask(year, [对应type])` 拿到任务，存在则渲染 `<TaskCountdownBadge endDate={task.endDate} />`。

### 3. 任务管理 · seed 新增 2 条任务
文件：`src/mocks/assessTasks.ts`，在 `seed` 数组末尾追加：

| 字段 | 任务 A | 任务 B |
|---|---|---|
| id | task-007 | task-008 |
| year | 2025 | 2026 |
| type | 区下属单位能耗考核 | "百家"、"千家"、通信业企业碳排放目标分解 |
| startDate | 2025-06-01 | 2026-02-01 |
| endDate | 2025-09-30 | 2026-04-30 |
| status | 进行中 | 未开始 |
| createdAt | 2025-05-20 | 2026-01-15 |
| enterpriseFileName | 2025年区下属单位能耗考核.xlsx | 2026年百千通碳排放目标.xlsx |
| enterprises | 复用 task-005 的 2 家（带区名称） | 复用 task-002 的 2 家（带区名称） |

新增后，因为 `AssessGoal/AssessDual` 已基于 `listActiveYears` + `hasActiveTask` 动态渲染：
- 双控考核 2025 年自动出现"区下属单位能耗目标考核" Tab；
- 目标分解 2026 年自动出现"百千通碳排放目标分解" Tab；
- 企业侧对应 scope/entType 也自动解锁。无需改其他业务文件。

### 4. 不改动范围
- 不修改任务详情、模板、企业名单弹窗。
- 不修改后端、不引入新依赖。
- 倒计时仅 UI 层提示，不影响任何提交/校验逻辑。
