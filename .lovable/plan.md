## 改动一：政府侧详情页移除底部合计条

文件：`src/pages/gov/AssessDualBqDetail.tsx`

- 删除最底部 sticky 的"合计 / 满分 / 企业自评 / 政府考评 / 取消 / 保存"那张 Card（图1红框区域），其它结构不变。顶部工具栏已有"保存"按钮。

## 改动二：退回重填后状态改为"待提交"

数据/类型改动：

- `src/mocks/assess.ts`：`BqEntAssessRow.status` 类型增加 `"待提交"`。
- `src/components/assess/PassBadge.tsx`：把 `"待提交"` 也映射为 `pending`（黄色）样式。
- `src/mocks/bqAssessStore.ts`：`rollbackBqEnt(id)` 把状态改为 `"待提交"`（当前是 `"待考核"`）。

页面改动：

- `src/pages/gov/AssessDualBqDetail.tsx`：保留现有"退回重填"按钮逻辑（已经调用 `rollbackBqEnt`），点击后 toast 文案保持"已退回重填"，列表状态会自动同步成"待提交"。

## 改动三：企业侧"考核结果"加企业类型切换 + 两套界面

### 3.1 新增企业类型 store

新建 `src/mocks/entTypeStore.ts`：

- 类型：`EntType = "district" | "city"`，标签 `区管企业 / 市管企业`。
- 用 `localStorage` 持久化 + `useSyncExternalStore`，导出 `useEntType()` / `getEntType()` / `setEntType(t)`。默认 `district`。

### 3.2 顶部下拉切换

新建 `src/components/assess/EntTypeSwitcher.tsx`：

- 与 `RoleSwitcher` 同一视觉风格（outline 小按钮 + Building2 图标 + 当前类型文字 + ChevronDown）。
- DropdownMenu 两项：区管企业 / 市管企业；选中后 `setEntType` 触发刷新（无需 reload，store 自带订阅）。

`src/components/AppLayout.tsx`：

- 当 `side === "ent"` 时，在 headerExtra 之前自动渲染 `<EntTypeSwitcher />`（位置：消息中心铃铛之前）。仅企业侧显示。

### 3.3 区管企业界面（保留现有）

`src/pages/ent/EntAssessDual.tsx` 的现有界面 = 区管企业视图（即图2），不改逻辑。

### 3.4 市管企业界面（新增，图3 布局）

新建 `src/pages/ent/EntAssessDualBq.tsx`：

- 复用政府侧 `AssessDualBqDetail.tsx` 的结构（顶部"上海市工业百家千家通信业…"基础信息卡 + 三个分组卡片 + 评分项左右双栏「企业自评 / 政府考评」），只读视图：
  - 顶部工具栏精简为：年份选择、`下载附件`、`下载考评报告`（如有）、`导出`。去掉"上传考评报告/退回重填/保存/返回"等政府侧按钮。
  - 政府考评一栏（考评分 + 评分依据）改为只读展示（用与企业自评相同的 readonly 灰底块），不可编辑。
  - 顶部增加状态徽章（待考核 / 考核中 / 已考核 / 待提交）。
  - 数据源：取 `bqEntAssessList` 中第一家（演示），`bqAssessDetail` 评分明细。
- 不动企业侧"考核结果"原有路由本身——直接在 `EntAssessDual.tsx` 内部根据 `useEntType()` 渲染：
  - `district` → 当前界面
  - `city` → 渲染 `<EntAssessDualBq />` 组件内容（不再嵌 AppLayout，提取为内嵌段落组件，或在 `EntAssessDual.tsx` 的 `AppLayout` 子节点里二选一）。

实现方式（简洁版）：把市管企业内容拆成 `EntAssessDualBqBody` 组件（不带 AppLayout），`EntAssessDual.tsx` 在 AppLayout 内部 `if entType === 'city'` 渲染该 body，否则渲染原内容；标题副标题也根据类型切换。

## 涉及文件

- 编辑 `src/pages/gov/AssessDualBqDetail.tsx`（删底部合计条）
- 编辑 `src/mocks/assess.ts`（status 类型扩展）
- 编辑 `src/components/assess/PassBadge.tsx`（"待提交" 样式）
- 编辑 `src/mocks/bqAssessStore.ts`（rollback → "待提交"）
- 新建 `src/mocks/entTypeStore.ts`
- 新建 `src/components/assess/EntTypeSwitcher.tsx`
- 编辑 `src/components/AppLayout.tsx`（企业侧渲染切换器）
- 新建 `src/components/assess/EntAssessDualBqBody.tsx`（市管企业只读视图）
- 编辑 `src/pages/ent/EntAssessDual.tsx`（按类型分支渲染）
