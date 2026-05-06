## 目标
让"目标分解"列表中红框范围内的所有数据列支持内联编辑：
- 区级管理员：在 AssessGoal 主页的"区下属企业碳排放目标分解"列表中可编辑所有数据列
- 市级管理员：在"区下属企业目标分解详情页"和"百家/千家/通信业"列表中可编辑所有数据列

## 涉及编辑的列

**CarbonGoalTable（图1、图2）**
- 2025年总量（total2025）
- 2025年单位产值碳排放（intensity2025）
- 推荐值/总量推荐值（recommendTotal）
- 2026年总量（total2026）
- 2026年强度（intensity2026）
- 强度指标（intensityIndicator）
- 强度单位（intensityUnit）
- 备注（remark）

**BqGoalTable（图3）**
- 2025年总量（total2025）
- 2025年单位产值碳排放（intensity2025）
- 总量推荐值（recommendTotal）
- 总量目标值（totalGoal）
- 强度目标值（intensityGoal）
- 强度指标（intensityIndicator）
- 强度单位（intensityUnit）
- 备注（remark）

## 实现方案

### 1. `src/components/assess/CarbonGoalTable.tsx`
- 扩展现有内联编辑机制（已支持 `district-view` 编辑 total2026/intensity2026/remark），新增上面所有字段。
- `district-view` 与 `city-view` 都启用"编辑"按钮 + 行内编辑（保存/取消图标）。
- `draft` 默认值与 `saveInline` 的字段对比循环扩展为全部 8 个字段，文本字段（指标/单位/备注）变化也写入 ChangeRecord。
- 编辑中 td 使用 Input 组件（数值类型用 number，文本类型用普通 Input）。
- 操作列显示规则：`district-view` 与 `city-view` 都显示"编辑"按钮（city-view 同样可保存，by 改为"市级管理员"）。
- `city-view` 现存的"已修改"徽章移到不在编辑态时显示。

### 2. `src/components/assess/BqGoalTable.tsx`
- 当前 `city-view` 与 `district-view` 都是只读。增加内联编辑能力（参考 CarbonGoalTable 模式）：
  - 新增 `editingId` / `draft` 状态
  - 操作列在 `city-view` 也显示，呈现"编辑 / 保存 / 取消"按钮
  - 编辑字段：total2025、intensity2025、recommendTotal、totalGoal、intensityGoal、intensityIndicator、intensityUnit、remark
  - 保存通过新增的 `onInlineSave?: (id, patch) => void` 回调上抛
  - 表头多加一列"操作"（city-view 时）

### 3. `src/pages/gov/AssessGoal.tsx`
- 维护 `bqRows` state（基于 `bqGoals` 初始化），传给 BqGoalTable，提供 `onInlineSave` 更新 state 并将 status 置为 `modified`。
- 区级管理员部分（else 分支）原本已用 `onInlineSave`，无需大改，仅因 CarbonGoalTable 扩展自动生效。

### 4. `src/pages/gov/AssessGoalDistrictDetail.tsx`
- 当前 `<CarbonGoalTable mode="city-view" />` 为只读，需改为支持编辑：
  - 维护本地 rows state，提供 `onInlineSave` 更新本地数据 + 弹 toast
  - 保留 mode="city-view"（编辑能力由组件内部扩展支持）

## 不修改
- mock 数据结构（仅前端编辑，状态变 modified）
- 后端/接口逻辑（项目无后端，纯前端演示）
- 其他页面与样式系统
