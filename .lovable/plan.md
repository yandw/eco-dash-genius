
## 趋势分解模块迭代

### 1. 维度调整：去人口、加能耗总量

**数据** `src/mocks/trendDecompDefaults.ts`
- `DistrictInput` 字段：`historical2025 / gdp / energy`（删除 `population`）
- 6 个区补充 `energy`（万吨标煤）默认值

**算法** `src/lib/trendDecomp.ts`
- `weightPopulation` → `weightEnergy`（按区能耗占比）
- `composite` 含义：α 历史排放 + β GDP + γ 能耗总量
- `ALGO_LABEL` / `ALGO_FORMULA` 文案与公式中"人口"全部替换为"能耗"

**页面** `src/pages/gov/AssessTrendDecomp.tsx`
- 区参数表"人口（万人）"列 → "能耗（万吨标煤）"列
- composite 滑块第 3 项 "人口 γ" → "能耗 γ"
- 算法卡片副标题"历史 + GDP + 人口加权" → "历史 + GDP + 能耗加权"

### 2. 分解粒度：整段(2026–2030) / 逐年

在「全市目标设置」区新增 **分解模式** 切换（RadioGroup）：

- **整段模式（默认）**：现有逻辑，仅给出目标年（2026-2030）单一终点的分配，趋势图为 2025→目标年线性插值。
- **逐年模式**：取消单一目标年，输入扩展为 2026/2027/2028/2029/2030 五年的全市总量目标（默认按等比下降自动填充，可逐年覆盖）。
  - 算法对每一年独立调用 `decompose`，得到每个区在 5 个年度的分配额度
  - 区参数表"分配额度"列展开为 5 列（2026…2030），同比/占比按目标年（2030）展示
  - 趋势折线图 X 轴为 2025→2030 的真实分配（非插值），每条线为一个区
  - 条形图与饼图默认展示终点年（2030）的分配，提供年份切换器

**算法层新增**：`decomposeMultiYear(districts, yearTargets[], options)` 返回 `{ year, results[] }[]`；锁定值在逐年模式下视为「终点年锁定」，中间年按线性反推。

### 3. 不改动
- 路由 / 菜单入口 / 权限 / 储备额度 / 历史排放与 GDP 输入交互

### 涉及文件
- 修改：`src/lib/trendDecomp.ts`、`src/mocks/trendDecompDefaults.ts`、`src/pages/gov/AssessTrendDecomp.tsx`
- 不新建组件
