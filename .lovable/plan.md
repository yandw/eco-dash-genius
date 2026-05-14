## 目标
在「考核管理」下新增二级菜单 **趋势分解**（仅市级管理员可见），用算法把全市碳排放总量目标按区进行分解，输出每个区的配额，并提供可视化对比。

## 菜单与路由
- `src/components/AppSidebar.tsx`：在 `govItems → 考核管理 → children` 中，紧跟"碳排测算"之后新增 `{ title: "趋势分解", url: "/gov/assess/trend-decomp", icon: PieChart }`，同样用 `isCityAdmin()` 包裹。
- `src/App.tsx`：注册新路由，懒加载新页面 `src/pages/gov/AssessTrendDecomp.tsx`，非市级访问跳转至 `/gov/assess/goal`。

## 页面信息架构（`AssessTrendDecomp.tsx`）

```text
顶部页头（图标 + 标题 + 副标题：基于权重算法的碳排放目标区域分解）
└─ 顶部操作条：[重置默认] [导出 Excel(占位)] [保存方案(占位)]

①「全市目标设置」面板（卡片）
  - 目标年度（2026~2030 下拉，默认 2030）
  - 全市总量目标（万吨 CO₂，数值输入，默认从「碳排测算」基数 8768 推算）
  - 目标类型（单选）：① 总量上限  ② 较 2025 下降率
  - 是否预留储备额度（百分比，默认 3%）
  - 当前可分解额度 = 总量 × (1 − 预留%)（只读，自动计算）

②「分解算法」面板
  - 算法选择（单选卡片，4 种）：
      1. 历史排放权重法（按区 2025 排放占比）
      2. GDP 贡献权重法（按区 GDP 占比）
      3. 强度递减法（按"区现状强度 × 统一下降率"）
      4. 多因子综合法（历史 α + GDP β + 人口 γ，权重可调）
  - 仅"多因子综合法"显示三档滑杆 α/β/γ（合计自动归一），其余隐藏
  - 公式卡片：实时显示当前算法的数学公式

③「区维度参数表」（按 `assessOrgs.districtData` 6 个区生成）
  列：区名 | 2025 历史排放(万吨) | GDP(亿) | 人口(万) | 锁定值(万吨,可选) | 算法权重(自动) | 分配额度(自动) | 同比 2025 增减 | 占比%
  - 前 4 列预填默认值（mock），可编辑
  - "锁定值"勾选后该区按手填值固定，剩余额度在其他区间重算
  - 末行汇总：合计 = 可分解额度（不一致时红色提示）

④「分解结果可视化」（双列卡片）
  - 左：水平柱状图 — 各区分配额度对比（Recharts BarChart）
  - 右：环形饼图 — 各区占比（Recharts PieChart）
  - 下方：折线图 — 当前方案下各区 2025→2030 趋势（基于线性插值）

⑤ 底部「方案对比」抽屉（占位按钮）—— 暂存已保存方案以备后续对比
```

## 算法（`src/lib/trendDecomp.ts`，纯函数）
- `weightHistorical(rows)`：`w_i = hist_i / Σhist`
- `weightGdp(rows)`：`w_i = gdp_i / Σgdp`
- `weightIntensity(rows, dropRate)`：`alloc_i = hist_i × (1 − dropRate)`，其余按比例缩放至 = 可分解额度
- `weightComposite(rows, α, β, γ)`：归一权重后线性叠加
- `applyLocks(rows, total)`：锁定值先扣除，剩余额度按权重在未锁定区分配
- 所有算法返回 `{ districtId, weight, allocation, deltaVs2025, share }[]`

## 数据
- `src/mocks/trendDecompDefaults.ts`：6 个区的默认 `historical2025 / gdp / population`（基于 `assessOrgs` 的区列表）+ 全市默认总量 8768、默认下降率 12%。

## 设计与样式
- 复用 `panel`、`Card`、`Tabs`、`Select`、`Input`、`Button`、`Slider`、`Tooltip`，纯使用 `index.css` 语义色 (`primary` / `success` / `warning` / `muted-foreground`)。
- 输入单元用 `text-primary`，自动计算用 `text-foreground`，提示用 `text-muted-foreground`，超量警告用 `text-destructive`。

## 范围说明
- 纯前端 mock，无后端、无导出、无方案持久化（按钮先用 toast 占位）。
- 仅市级管理员可见和访问。
- 区列表来自现有 `assessOrgs.districtData`（目前 6 个区，新增区会自动出现在表中）。
