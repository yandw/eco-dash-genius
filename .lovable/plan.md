## 调整任务提示与市管企业界面

### 1. 提示位置调整：移到子tab下方
目标：把"任务结束截止"提示从右上角移到子 tab 切换栏的**正下方**（如截图1红框处），位于统计卡片（参与区数 / 完成考核 / …）之上，整行左对齐。

涉及文件（统一移动位置）：
- `src/pages/gov/AssessGoal.tsx`：移除 187–193 行右上角提示；改为在 `<TabsContent value="district">` 与 `<TabsContent value="bq">` 顶部各渲染一行 `<TaskHint>`（按对应 `taskType` 取任务）。区级分支也在统计卡片上方加一行。
- `src/pages/gov/AssessDual.tsx`：移除 160–167 行右上角提示；同样在两个 TabsContent 顶部、以及区级分支统计卡片上方各渲染一行。
- `src/pages/ent/EntAssessGoal.tsx`：操作栏内的 250–253 行提示移除，改为放在 `headerScope` Tabs 下方一行（即 scope 切换 tab 与表单/卡片之间）。
- `src/pages/ent/EntAssessDual.tsx`：区管企业分支保留，提示位置保持在年份选择栏之下、考核结果卡片之上的左侧位置（207 行附近）。市管企业分支按下方第 3 点统一处理。

样式：`mb-3` 单行，`Clock` 图标 + 文案，与现 `TaskCountdownBadge` 一致；不加背景胶囊。

### 2. 「未开始」任务也显示提示
当年/类型存在状态为「未开始」的任务时，提示文案为：

```
🕒 2026年02月28日 任务待开始
```

实现：
- `src/mocks/assessTasks.ts`：新增 `getDisplayTask(year, types)` —— 优先返回「进行中」任务，否则返回「未开始」任务（用于显示提示）。`getInProgressTask` 保留不动。
- `src/components/assess/TaskCountdownBadge.tsx`：新增 prop `status?: AssessTaskStatus`。当 `status === '未开始'`：tone 用 `text-muted-foreground`，文案为「`{cn_date} 任务待开始`」。其它状态保持现有文案规则。
- 所有调用点改为 `getDisplayTask` 并把 `task.status` 传入 badge。

「已结束 / 已归档」仍不显示。

### 3. 市管企业界面增加年份平铺 + 任务提示
当前 `EntAssessDual.tsx` 中 `entType === 'city'`（市管企业）分支无年份选择栏。新增：
- 在 `<EntAssessDualBqBody>` 之前渲染与区管企业一致的"报告年度"面板（参考同文件 167–197 行结构），可切换 `YEARS`。
- 年份切换栏下方一行渲染 `<TaskCountdownBadge>`（按上述 `getDisplayTask`，类型 `"百家"、"千家"、通信业企业能耗考核`）。
- `EntAssessDualBqBody` 暂不与 `year` 联动（mock 仅一份数据），仅作 UI 切换；切换不会破坏现有"双控考核"主体内容。

### 不改动范围
- 任务管理（AssessTasks）、目标分解/双控考核的业务逻辑、表单、表格数据、其他文案与状态判定。
- 年份计算、任务过滤逻辑（沿用 `listActiveYears` / `hasActiveTask`）。
