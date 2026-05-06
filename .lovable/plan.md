## 企业侧考核结果界面 重新设计

参照"目标分解"页面（`EntAssessGoal.tsx`）的视觉与信息架构，把考核结果重新组织为"按年度查看 + 卡片化分组"的只读详情页，并删除整改任务、考核申诉两个 Tab。

### 页面结构（自上而下）

1. **页面标题**：`重点单位能耗双控考核结果`，副标题 `{year} 年度`
2. **报告年度选择器**（panel）
   - 复用目标分解的样式：年份按钮含状态点 + 文案
   - 状态来源：每年根据 `dualResult` 自动得出 `已达标 / 未达标 / 未考核`
   - `本期` 角标标在 2026
3. **考核状态条**：左侧"考核状态"标签 + 状态徽章（绿色"已达标" / 红色"未达标" / 灰色"暂未考核"）；右侧自动判定提示文字（`Lock` 图标 + "考核结果由系统自动判定，如有异议请联系主管部门"）
4. **总体结论横幅**（参照目标分解的"已提交"横幅）
   - 已达标：primary 色调 + `CheckCircle2`，文案"X 年度能耗双控考核已通过"
   - 未达标：destructive 色调 + `AlertCircle`，文案"X 年度能耗双控考核未通过，请关注下方未达标项"
5. **卡片分组（替换原表格）** —— 与目标分解一致的 SectionTitle + 只读 `ro` 字段样式
   - **企业基础信息**：所属区 / 统一信用代码 / 企业名称
   - **能耗总量目标完成情况**：目标值、实际值、扣除绿电绿证后能耗总量、是否达标（PassBadge）
   - **能耗强度目标完成情况**：能耗强度指标、能耗强度单位、目标值、实际值、扣除绿电绿证后强度、是否达标
   - **备注**：只读展示文本
6. **底部说明**：保留原有 `※ 实际值与扣除绿电绿证可再生能源后的能耗值由系统自动从年度能源利用状况报告中提取…`

### 删除内容

- `Tabs` 容器及 `rectify`、`appeal` 两个 `TabsContent`
- 不再使用旧的 `EntAssessResultTable`（保留组件文件本身，仅本页不引用）
- 不再使用 `AssessYearPicker`（改用与目标分解一致的年度按钮）

### 技术细节

- 文件：`src/pages/ent/EntAssessDual.tsx` 重写
- 新增小组件结构内联（SectionTitle / Field / `ro` 类）与 `EntCarbonGoalForm` 的样式保持一致
- 数据：`getEntAssess(ent.id)` 已返回多年的 `EntAssessYearRow`，按 `year` 取当年行渲染；`yearStatusMap` 由各年的 `totalPass` & `intensityPass` 综合计算（两项均"达标" → `passed`，存在"未达标" → `failed`，否则 `pending`）
- `statusBadge()`、`yearDotClass()`、`yearStatusLabel()` 仿照 `EntAssessGoal.tsx`，调整为达标/未达标语义色（success / destructive / muted）
- 引入 `CheckCircle2 / AlertCircle / Lock` 图标
- 移除导入：`Tabs / TabsList / TabsTrigger / TabsContent`、`Card`（按需保留）、`AssessYearPicker`、`EntAssessResultTable`、`Bell / FileWarning`
- `AppLayout` 的 `title` 更新为"重点单位能耗双控考核结果"，并在页面顶部增加大号 `<h1>`（与目标分解页一致）

### 颜色 / 设计令牌

仅使用语义色：`primary`、`success`、`destructive`、`muted-foreground`、`border`，不引入新颜色。
