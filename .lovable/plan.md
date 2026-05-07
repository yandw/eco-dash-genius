## 调整任务结束倒计时提示

### 1. 文案与样式
统一为轻量提示行（参考截图"关键提示"样式）：
- `🕒 距 2026年02月28日 任务结束截止还剩 15 天`
- 当日截止：`🕒 2026年02月28日 任务今日截止`
- 已过期：`🕒 2026年02月28日 任务已截止 N 天`

样式：`Clock` 图标 + `text-warning` 文案（≤7 天 / 当日），>7 天用 `text-primary`，已过期 `text-muted-foreground`；日期与天数加粗（`font-semibold`）。无胶囊背景。

### 2. 仅"进行中"任务才显示
新增 `getInProgressTask(year, types)`（在 `getActiveTask` 基础上加 `status === '进行中'`）。  
未开始 / 已结束 / 已归档：不渲染倒计时。

### 3. 改造 `TaskCountdownBadge`
文件：`src/components/assess/TaskCountdownBadge.tsx`
- 重写为轻量行布局（`inline-flex` + 图标 + 文字）。
- 新增中文日期格式化 `formatCnDate(YYYY-MM-DD) → YYYY年MM月DD日`。
- 文案按上述规则拼接。

### 4. 接入点改为 `getInProgressTask`
仅替换调用，不动布局：
- `src/pages/gov/AssessGoal.tsx`
- `src/pages/gov/AssessDual.tsx`
- `src/pages/ent/EntAssessGoal.tsx`
- `src/pages/ent/EntAssessDual.tsx`

### 不改动范围
任务管理列表/详情/模板/企业名单弹窗、业务校验逻辑、其他文案均不变。
