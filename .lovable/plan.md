## 调整内容

### 1. 企业侧 — 去掉待填报档案时间轴节点的提示文字（图1红框）
**文件**：`src/mocks/archives.ts`
- 在 `ent-001` 的 2025 待填报记录里，将 timeline 节点 `创建年度档案` 的 `comment` 字段去掉（仅保留时间、操作者、操作名）。
- `ArchiveTimeline` 组件已经在 `comment` 为空时不渲染绿色提示框，无需改组件。

### 2. 政府侧节能档案列表增加序号
**文件**：`src/components/archives/EnterpriseYearMatrix.tsx`
- 在表头第一列前增加 `序号` 列（宽度约 60px，居中）。
- 表体行中按当前分页计算序号：`(page - 1) * pageSize + idx + 1`，使用等宽字体展示。

### 3. 政府侧节能档案详情去掉「已标注 N 处问题」汇总区（图2红框）
**文件**：`src/pages/gov/GovArchiveDetail.tsx`
- 删除 89~145 行之间渲染 `annotations.length > 0` 时的整个橙色汇总块。
- 保留底部「标注问题」按钮以及退回弹窗内已附加标注的提示。

### 4. 政府侧详情去掉「转交」「导出 PDF」按钮
**文件**：`src/pages/gov/GovArchiveDetail.tsx`
- 移除顶部操作区的「导出 PDF」「转交」两个按钮，仅保留「退回整改」「审核通过」。
- 同步清理未使用的 `Forward`、`Download` 图标导入。

### 5. 列表页「导出节能档案」改为弹窗选择年份并触发下载
**文件**：`src/pages/Archives.tsx`
- 引入 `Dialog` 组件，新增 `exportOpen` 与 `exportYear` 状态（默认 `CURRENT_YEAR`）。
- 点击「导出节能档案」按钮时打开弹窗，弹窗内展示一个 `Select`，可选年份来自 `YEARS`。
- 「确定」按钮逻辑：
  - 在浏览器端用 `Blob` 生成一个简单的 CSV 文件（含序号、企业名称、信用代码、行业、所属区、所选年度状态等列），文件名形如 `节能档案_2024.csv`。
  - 通过创建临时 `<a download>` 触发浏览器下载，下载完成后关闭弹窗并 `toast.success` 提示。
- 不调用任何后端接口，纯前端模拟下载。

### 6. 列表页去掉「文件中心」按钮
**文件**：`src/pages/Archives.tsx`
- 移除「文件中心」按钮以及未使用的 `FolderOpen` 图标导入。

## 技术细节

- CSV 内容用 UTF-8 BOM (`\uFEFF`) 前缀避免 Excel 中文乱码。
- 表头额外列与现有 `min-w-*` 宽度协调，保持桌面端布局不溢出。
- 时间轴节点删除 `comment` 后，已审核/已退回流程仍各自保留含 comment 的节点（不受影响）。

## 影响面
- 企业侧节能档案 详情页（`/ent/archives/:year`）。
- 政府侧节能档案 列表页（`/gov/archives`）与详情页（`/gov/archives/:entId/:year`）。
