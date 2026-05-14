## 目标
在所有「碳双控测算」界面（市级管理员 4 个行业 Tab、区级管理员、企业侧）的表格中，于「排放量(tCO₂)」列之后新增两列：
- **生产总值（万元）**：用户手动输入
- **碳排放强度（tCO₂/万元）** = 排放量 / 生产总值，自动计算（实时）

## 范围
仅修改 `src/components/assess/trend/DualCalcPanel.tsx`（所有入口共用此面板，一处改动全部生效）。

## 改动点

### 1. 数据模型
- `FuelRow` 与 `ElecRow` 各新增字段：`output: number`（生产总值，万元，默认 0）。
- `newFuelRow()` / `newElecRow()` 初始化 `output: 0`。

### 2. 计算
在 `fuelComputed` / `elecComputed` 的 map 中，基于已有 `emission` 追加：
```
intensity = (emission != null && output > 0) ? emission / output : null
```

### 3. 表格列
范围一表格 `<TableHeader>` 与每行：
- 在「排放量 (tCO₂)」`<TableHead>` 之后插入：
  - `生产总值 (万元)`（右对齐，min-w-[120px]）
  - `碳排放强度 (tCO₂/万元)`（右对齐，min-w-[140px]）
- 行内：
  - 生产总值列：`<Input type="number">`，绑定 `r.output`，`onChange` 调用 `updateFuel(r.id, { output: +e.target.value || 0 })`
  - 碳排放强度列：纯展示，`r.intensity == null ? "—" : fmt(r.intensity, 4)`，文本色 `text-warning`

范围二表格做同样处理（颜色用 `text-primary`，updater 用 `updateElec`）。

### 4. 合计行
- 范围一合计行 `colSpan` 由 `7` 改为 `9`（新增 2 列向左推 1 格，需重算）— 当前结构：`#, 燃料, 净消耗, 来源, 低位发热, 含碳, 氧化率, 排放, 删除` = 9 列；合计 `colSpan=7` 占前 7 列，排放 1 列，删除 1 列。新增 2 列后总列数 = 11，合计应 `colSpan=7`，再加新增的"生产总值合计/强度占位"，最简方案：合计行改为 `colSpan=7`（前 7 列）+ 排放小计 + 生产总值合计单元（合计输入用 `—` 或求和）+ 强度单元（`—`）+ 删除空列。
- 决定：**合计行下「生产总值」展示总和（数值求和），「碳排放强度」展示 `—`**（避免误导，因为整体强度 ≠ 各行强度均值）。
- 范围二同理，原 `colSpan=5` 保持，后接 排放小计 / 生产总值小计 / 强度`—` / 删除空列。

### 5. 删除按钮列
保持最右侧不变。

## 不改动
- `DualCalcForm`、`dualCalcDefaults`、其他页面与路由
- 公式说明卡仅为范围一/二排放公式，不新增公式说明（如需可后续补充）

## 视觉
- 新列单元格内 Input 高度 `h-8`、右对齐、`text-primary`
- 强度文本采用 `tabular-nums font-medium`，颜色与该范围主色一致
- 表格已 `overflow-x-auto`，新增列不破坏响应式

## 验证
进入 `/gov/assess/dual-calc`（市级查看 4 Tab）/ 区级 / 企业侧三处页面，输入排放参数 + 生产总值，确认强度实时变化、合计行求和正确。
