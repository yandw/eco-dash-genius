## 企业侧考核结果界面 — 增加"双控考核完成情况 / 考核结果 / 备注" 与考核说明

### 1. 新增"考核说明"提示条
在 `EntAssessDual.tsx` 页面顶部、考核状态条之后（总体结论横幅之前）增加一个浅色提示条：

- 样式：`rounded-md border border-border bg-muted/40 p-3` + `Info` 图标 + 小字
- 文案（完整保留）：
  > 考核说明：考核结果分为完成、未完成两个等次（总量和强度目标均完成可视为完成，有1项未完成即视为未完成）。双控指标完成情况为"未完成"但考核结果为"完成"的，需在备注中说明原因。

### 2. 新增"双控考核结论"卡片（替代原"备注"卡片，备注合并入此卡片）
在"能耗强度目标完成情况"卡片之后，新增一个 `Card`：标题 `双控考核结论`，含 3 个只读字段（与现有 `ro` 样式一致）：

| 字段 | 取值 |
|------|------|
| 双控指标完成情况 | "完成"（总量&强度均达标）/ "未完成"（任一未达标）/ "—"（暂未考核），渲染为 `PassBadge` |
| 考核结果 | "完成" / "未完成" / "—"，渲染为 `PassBadge`；逻辑默认与"双控指标完成情况"一致，但 mock 中允许差异（见下） |
| 备注 | 文本只读，多行；当"双控指标=未完成"且"考核结果=完成"时高亮（`border-warning/40 bg-warning/5`）以强调说明原因 |

原"备注"卡片删除（备注合并到本卡片中），保持页面紧凑。

### 3. Mock 数据扩展
`src/mocks/assess.ts` 的 `EntAssessYearRow` 新增两字段：
- `dualPass: "完成" | "未完成" | "—"`
- `assessResult: "完成" | "未完成" | "—"`

`getEntAssess()` 计算规则：
- `dualPass`：`totalPass` 与 `intensityPass` 任一为 "—" → "—"；均为"达标" → "完成"；否则 "未完成"
- `assessResult`：默认等于 `dualPass`；为演示"双控未完成但考核完成"的破例情况，mock 中将其中一年（如 2024）手动覆盖为：`dualPass="未完成"`、`assessResult="完成"`、`remark="因 XX 客观原因，经主管部门核定准予通过"`

### 4. 顶部状态条与年度状态联动调整
`rowStatus()` 改为以 `assessResult` 为准（passed = "完成"，failed = "未完成"，其他 pending），让年度按钮、状态徽章、总体结论横幅与"考核结果"字段保持一致。

### 5. PassBadge 兼容
`PassBadge.tsx` 已支持 "完成 / 未完成"（pass / fail），无需改动。

### 文件改动清单
- `src/mocks/assess.ts`：`EntAssessYearRow` 新增 `dualPass`、`assessResult` 字段，`getEntAssess()` 填充逻辑 + 一年破例数据
- `src/pages/ent/EntAssessDual.tsx`：
  - 顶部新增"考核说明"提示条（`Info` 图标）
  - 新增"双控考核结论"卡片（3 字段 + 备注高亮）
  - 删除原独立"备注"卡片
  - `rowStatus()` 改为基于 `assessResult`
  - 引入 `Info` 图标
