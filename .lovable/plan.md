## 目标

在「考核管理 / 碳排测算」页面（`/gov/assess/trend`）的现有 4 个测算 Tab 之外，新增一个 **"双控测算"** 顶级 Tab。该 Tab 内按企业所属行业切换表单样式，目前支持 **化石 / 钢铁 / 电力 / 工业其它** 四个行业，每个行业下仅展示两个范围：

- **范围一 · 化石燃料燃烧**（按燃料品种逐条录入）
- **范围二 · 净购入电力和热力消费**（按能源类型逐条录入）

不涉及「工业生产过程」范围。所有缺省值、排放因子先留空（输入框 placeholder "—"），后续从其它模块同步。

---

## 页面结构

```text
碳排测算 (AssessTrend.tsx)
└── Tabs (顶层)
    ├── 能耗增量测算
    ├── 能耗强度测算
    ├── 碳排放增量测算
    ├── 碳排放强度测算
    └── 双控测算  ← 新增
        └── 行业切换 Tabs：化石 / 钢铁 / 电力 / 工业其它
            └── DualCalcForm（按行业渲染对应字段集）
                ├── Card：范围一 · 化石燃料燃烧
                │   └── 燃料品种表 + 合计 + 公式提示
                └── Card：范围二 · 净购入电力和热力消费
                    └── 能源类型表 + 合计 + 公式提示
```

---

## 表单详情（参考用户上传截图样式）

### 范围一 · 化石燃料燃烧

表头：`# / 燃料品种 / 净消耗量 / 单位 / 数据来源 / 低位发热量 / 单位热值含碳量(tC/GJ) / 碳氧化率(%) / 排放量(tCO₂) / 操作`

- 燃料品种：Select（按行业不同提供不同候选项，先空数组占位）
- 数据来源：Select（缺省值 / 自测值）
- 低位发热量、单位热值含碳量、碳氧化率：选「缺省值」时禁用并显示 "—"，选「自测值」时可输入
- 排放量 = 净消耗量 × 低位发热量 × 单位热值含碳量 × 碳氧化率(%) × 44/12（公式行展示在表底）
- 底部：`+ 新增燃料品种` 按钮、合计行
- Card 右上角：小计排放量徽章

### 范围二 · 净购入电力和热力消费

表头：`# / 类型 / 净购入量 / 单位 / 数据来源 / CO₂ 排放因子 / 排放量(tCO₂) / 操作`

- 类型：Select（电力 / 热力）
- 数据来源：Select（缺省值 / 自测值）
- CO₂ 排放因子：缺省值时禁用并显示 "—"
- 排放量 = 净购入量 × 排放因子
- 底部：`+ 新增能源类型` 按钮、合计行
- Card 右上角：小计排放量徽章

### 行业差异（仅在燃料/类型候选项与缺省因子不同，先全部留空）

| 行业 | 范围一 候选燃料示例（占位空） | 范围二 候选 |
|------|-----------------------------|-----------|
| 化石（通用）| 柴油、汽油、天然气、煤炭… | 电力、热力 |
| 钢铁 | 焦炭、高炉煤气、转炉煤气、焦炉煤气、煤粉… | 电力、热力 |
| 电力 | 烟煤、重油、天然气… | 电力、热力 |
| 工业其它 | 通用燃料集 | 电力、热力 |

候选项数据先以空 `FUEL_OPTIONS_BY_INDUSTRY[industry] = []` 占位，预留接入位置。

---

## 文件改动

### 新增

1. `src/components/assess/trend/DualCalcPanel.tsx`
   - Props：`industry: 'fossil' | 'steel' | 'power' | 'other'`
   - 内部含两个子表组件 `Scope1FuelTable`、`Scope2ElecHeatTable`
   - 顶部一个 Card 总览（行业名 + 总排放 = 范围一 + 范围二）
   - 行级状态 useState 管理；`useMemo` 算每行 / 小计 / 总计

2. `src/components/assess/trend/DualCalcForm.tsx`（可与上合并）
   - 行业 Tabs（4 个），切换渲染 `DualCalcPanel`

3. `src/mocks/dualCalcDefaults.ts`
   - 导出 `INDUSTRY_LABEL`、`FUEL_OPTIONS_BY_INDUSTRY`、`HEAT_ELEC_OPTIONS`、`DEFAULT_FACTORS`（全部空对象/空数组占位，附 TODO 注释"待从档案/字典模块同步"）

### 修改

4. `src/pages/gov/AssessTrend.tsx`
   - 顶层 `TabsList` 由 `grid-cols-4` 改为 `grid-cols-5`，新增 `<TabsTrigger value="dual-calc">双控测算</TabsTrigger>`
   - 新增 `<TabsContent value="dual-calc"><DualCalcForm /></TabsContent>`

### 不修改

- 路由、侧边栏不变（仍走 `/gov/assess/trend`）
- 不动现有 4 个 Panel 与算法库

---

## 视觉规范

- 全部使用项目语义 token（`bg-muted/40`、`text-primary`、`text-success`、`text-warning` 等），不写裸色
- 表格沿用 `@/components/ui/table`，Card 沿用 `@/components/ui/card`
- 范围一 Card 顶条用 warning 色调（与上传截图的橙色徽章呼应），范围二用 primary 色调（蓝色）
- 公式行：`bg-muted/30 rounded-md px-3 py-2 text-xs font-mono`
- 空状态因子：placeholder `—`，禁用态 `disabled:opacity-50`

---

## 验收

- 进入 `/gov/assess/trend`，看到 5 个 Tab，最后一个为"双控测算"
- 双控测算下有 4 个行业子 Tab，切换无报错
- 每个行业表单可新增/删除燃料行与电热行，输入净消耗量/净购入量后排放量列实时计算（因子为空时显示 "—"）
- 选择"自测值"后因子输入框可编辑；选"缺省值"则禁用、显示占位
- 小计、合计、总排放量随输入实时刷新