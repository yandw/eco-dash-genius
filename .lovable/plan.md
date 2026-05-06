## 修改范围
仅企业侧 `src/pages/ent/EntAssessGoal.tsx`，不影响政府侧 `gov/AssessGoal.tsx`。

## 1. 文案 + 切换位置改造

将原 Tabs 两项的文案变更：
- "区下属单位碳排放目标分解" → **"区管企业"**
- "百家、千家、通信业企业碳排放目标分解" → **"市管企业"**

并把这个切换从内容区中部的 `TabsList` 移到**顶部栏**（与年度选择器同行，参考图1中"市级管理员"那种 segmented 样式），用 `Tabs` + 紧凑型 `TabsList`（h-9，rounded-md，与 AssessYearPicker 同高），放在年度选择器右侧或紧邻位置。

> 说明：实际企业侧用户只属于其中一种，这里仍保留两项切换以便演示/Demo 切换查看。

## 2. 表格 → 表单 改造

不再在企业侧使用 `CarbonGoalTable` / `BqGoalTable`（横向多列、需要滚动），改为竖向**详情表单**：左侧标签、右侧值（只读字段灰底，可填字段为输入框），按业务分组成 Section。

### 区管企业（CarbonGoalRow）表单分组

- **企业基础信息**（只读）：所属区、统一信用代码、企业名称
- **2025 年碳排放数据**（只读）：总量（万吨CO₂）、单位产值碳排放
- **推荐值（系统预留）**（只读，主色高亮）：总量推荐值（万吨CO₂）
- **2026 年碳排放目标**（可编辑）：总量目标（万吨CO₂）、强度目标、强度指标、强度单位
- **备注**（可编辑，textarea）

底部保留区级修改提示 `ChangeAlert`。

### 市管企业（BqGoalRow）表单分组

- **企业基础信息**（只读）：所属区、统一信用代码、企业名称
- **2025 年碳排放数据**（只读）：总量（吨CO₂）、单位产值碳排放（吨CO₂/万元）
- **推荐值**（只读高亮）：总量推荐值（万吨CO₂）
- **2026 年碳排放目标**（可编辑）：总量目标值（万吨CO₂）、强度目标值、强度指标、强度单位
- **备注**（可编辑）

### UI 实现细节

- 用 `Card` 包裹每个 Section，标题用左侧色条 + `text-sm font-medium`。
- 字段使用 `grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4` 布局。
- 标签：`text-xs text-muted-foreground`；只读值：`text-sm`；可编辑：`Input`/`Textarea`（shadcn）。
- 顶部右侧仍保留"保存草稿 / 提交"按钮。

## 3. 新建文件

- `src/components/assess/EntCarbonGoalForm.tsx`：渲染区管企业表单（接收 `row` + `onChange`）。
- `src/components/assess/EntBqGoalForm.tsx`：渲染市管企业表单。

## 4. 修改文件

- `src/pages/ent/EntAssessGoal.tsx`：
  - 顶部 toolbar 改为：`AssessYearPicker` + 归属切换 `Tabs`（区管/市管）+ 状态 Badge + 操作按钮。
  - 中间内容改为渲染对应表单组件，移除原 `TabsList` 在中部的写法（直接用 `TabsContent` 受控）。

## 政府侧
保持不变：`gov/AssessGoal.tsx` 仍使用原表格 + 原文案。
