## 目标
在 `区下属企业能耗目标考评` 表格末尾新增"操作"列，市级 / 区级管理员可对每行的实际值（能耗总量实际值、能耗强度实际值）、考核结果、备注进行行内编辑，支持 取消 / 确认。

## 交互设计
- 表格末尾新增固定列：**操作**（rowSpan=3 的表头）。
- 每行默认进入只读状态：
  - 实际值 2 列、考核结果、备注 显示为只读文本/徽标
  - 操作列显示「编辑」按钮
- 点击「编辑」：
  - 进入该行编辑态，仅该行的 4 个字段切换为输入控件
    - 能耗总量实际值（`totalActual`）→ number Input
    - 能耗强度实际值（`intensityActual`）→ number Input（步长 0.001）
    - 考核结果（`resultOverride`）→ Select（完成/未完成）
    - 备注（`remark`）→ Input
  - 操作列显示「取消」「确认」两个按钮
- 「取消」：丢弃本次修改，恢复进入编辑前的快照
- 「确认」：通过现有 `onChange` 回调把 4 个字段的最终值合并提交，行回到只读态，toast 提示"已更新"
- 一次只允许一行处于编辑态（点击新行的「编辑」会自动取消上一行）

## 派生值显示规则
- `扣除绿电绿证…总量/强度`、是否达标、双控完成情况：仍由实际值派生，编辑态下随输入实时刷新（仅在该行内通过本地草稿计算展示），确认后由父组件重算

## 权限
- `mode === "city-edit"`（市级管理员）和 `district-edit`（区级管理员）显示操作列与编辑能力
- `city-view` 不显示操作列

## 影响文件
- `src/components/assess/DistrictAssessTable.tsx`
  - 新增 `editingId` / `draft` 本地 state
  - 表头新增「操作」列
  - 行内根据 `editingId === r.id` 切换只读 / 编辑控件
  - 实际值列用 draft 值实时计算 net / pass / dualResult 显示
  - 现有的"始终可编辑"考核结果 Select、备注 Input 改为仅在编辑态出现
- `src/pages/gov/AssessDualDistrictDetail.tsx`：无需变更（继续接收 onChange 提交）
- `src/pages/gov/AssessDual.tsx` 区级模式（如已使用）同步受益，无需改动

## 技术细节
- 草稿快照：`const [draft, setDraft] = useState<Partial<EnergyAssessRow> | null>(null)`
- 进入编辑：`setEditingId(r.id); setDraft({ totalActual: r.totalActual, intensityActual: r.intensityActual, resultOverride: r.resultOverride, remark: r.remark })`
- 实际值变化时：同步更新 `totalActualNetGreen` / `intensityActualNetGreen`（若现有逻辑里两者通常等于实际值减绿电，演示数据中可直接同步为相同值或保留差额比例 — 沿用 mock 当前行为：编辑态下让 net 值跟随实际值同步变化）
- 确认时一次性 `onChange(r.id, draft + 派生 net 值)`
