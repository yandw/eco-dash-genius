## 改动 1 — 双控考核详情表（`DistrictAssessTable`）
对齐"目标分解"页面的视觉：
- 单元格指示从黄色圆点改为**红色感叹号图标**（`AlertCircle`，与 `ChangeBadge` 同款样式：`bg-destructive/20 text-destructive` 圆形包裹的小图标）
- **高亮整行**：行存在任意 `modifiedFields` 时，给 `<tr>` 加 `bg-warning/5`
- 单元格本身的黄色 ring/底色去掉，避免重复

涉及文件：`src/components/assess/DistrictAssessTable.tsx`

## 改动 2 — 目标分解表去掉"操作"列的"已修改"徽标
图中操作列只保留「编辑」按钮，不再显示蓝色"已修改"小标签（行内/单元格已有红色感叹号 + 行高亮，足够识别）。

涉及文件：
- `src/components/assess/CarbonGoalTable.tsx`：移除 line ~307、~311 的 `<PassBadge value="已修改" />`
- `src/components/assess/BqGoalTable.tsx`：移除 line ~213、~217 的 `<PassBadge value="已修改" />`

行级 `bg-warning/5` 高亮保留，不动。

## 不在范围
- 不动统计卡 / 筛选下拉
- 不动 mock 数据结构
