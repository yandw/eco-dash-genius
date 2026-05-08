## 目标
对齐"目标分解"页面的"已修改"提示模式，把同样的能力加到 `区下属企业能耗目标考评`（双控考核详情）：
1. 表格行：被编辑过的行显示"已修改"标记 + 高亮底色
2. 顶部统计卡：在现有 4 张卡（企业总数 / 完成 / 未完成 / 达标率）后追加"已修改"卡
3. 顶部增加查询条件：「是否已修改」(全部 / 已修改 / 未修改)，配合现有筛选生效

## 数据模型
在 `EnergyAssessRow` 上新增可选字段 `modified?: boolean`（默认 false），由"确认"操作置 true。

## 实现要点

### `src/mocks/assess.ts`
- `EnergyAssessRow` 增加 `modified?: boolean`

### `src/components/assess/DistrictAssessTable.tsx`
- `confirmEdit` 提交 patch 时附带 `modified: true`
- 行渲染：当 `r.modified` 时，整行加 `bg-warning/5` 背景；在"企业名称"单元格右侧追加 `<PassBadge value="已修改" />`（参考 `BqGoalTable` 用法）
- 同时支持外部按 modified 过滤后的列表展示（仅消费 props.rows）

### `src/pages/gov/AssessDualDistrictDetail.tsx`
- 新增 state：`keyword`、`modifiedFilter: "all" | "modified" | "unmodified"`
- 计算 `modifiedCount = rows.filter(r => r.modified).length`
- `summary` 卡片新增"已修改"一项（warning 色）
- 在表格上方加一行筛选区：
  - 企业名称关键词搜索 Input
  - 「是否已修改」Select（全部 / 已修改(N) / 未修改）
- 过滤后的 `displayRows` 传给 `DistrictAssessTable`
- 卡片栏布局由 4 列 → 5 列（md:grid-cols-5）

### `PassBadge`
- 已支持 "已修改" 文案，无需改动（`BqGoalTable` 已使用）

## 不在范围
- 不改其他 mode 行为；`city-view` 同样会展示"已修改"标识（与图1一致：只读视图也能看出哪些被改过）
- 不持久化 modified 到 store，仅通过父组件 setState 维持（与现有编辑流程一致）
