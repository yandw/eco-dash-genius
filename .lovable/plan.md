## 目标
4 个 Tab（能耗增量 / 能耗强度 / 碳排增量 / 碳排强度）顶部的「测算公式」整块卡片去掉，公式直接在列表表头对应"自动计算列"展示。

## 改动范围
仅前端展示，不改任何计算逻辑。

### 1. `src/components/assess/trend/IncrementPanel.tsx`
- 删除顶部 `<FormulaCard ... />` 整块（含 items、notes）
- 删除未使用的 `FormulaCard` import
- 表头当前已有公式简写（如 `D = (1+C)^5−1`），补充缺失的语义：
  - B 列表头副行追加 desc：`单位工业增加值${indicator}下降率（负值）`
  - C 列表头副行追加 desc：`工业增加值同比`
  - F 基数行（基数输入区）已显示来源；在其旁补一行小字：`F = 2025年${indicator}基数`
  - D / E / G / H 列保持现有公式 + 一行 desc（"工业增加值5年累计" / "5年${indicator}增长率" / "2030年${indicator}" / "${indicator}增加量"），用 `text-[11px] text-muted-foreground` 第三行展示

### 2. `src/components/assess/trend/IntensityPanel.tsx`
- 删除顶部 `<FormulaCard ... />` 与其 import
- 表头补全：
  - C 列：`工业增加值同比`
  - D 列：`(1+C)^5−1` + desc `工业增加值5年累计`
  - E 列：`5年${indicator}累计增长率`
  - F 列（仅能耗）：`(1+E)^(1/5)−1` + desc `折算的年均${indicator}增速`
  - G/F 列：`(1+E)/(1+D)−1` + desc `5年单位增加值${indicator}下降率`
- 参考目标线（-13.5% / -18%）原本在 FormulaCard notes 里，移到表格右上角操作栏左侧用一行小字保留：`参考目标 -13.5% / -18%`

### 3. 不删除文件
`FormulaCard.tsx` 暂时保留（其它地方未使用，但避免连带影响）。

## 视觉规范
- 表头单元格保持 3 行结构：
  - 第 1 行：列名（默认字体）
  - 第 2 行：公式或"输入 X"标记（`text-[11px]`，输入项用 `text-primary`，自动计算用 `text-muted-foreground`）
  - 第 3 行（新增）：中文 desc（`text-[11px] text-muted-foreground/80`），让用户在表头即可读懂含义，不再依赖顶部公式卡

## 不影响
- `trendCalc.ts` 计算逻辑、默认数据、图表区不动
- 趋势分解页 (`AssessTrendDecomp`) 不动
