## 双控考核交互完善

### 1. 年份平铺 + 标题（市级 + 区级）
**文件**：`src/pages/gov/AssessDual.tsx`

- 移除 `<AssessYearPicker>` 下拉控件。
- 在年份上方新增页面标题："重点单位能耗双控考核结果"（样式参考 `AssessGoal.tsx` 中的 `h1` + `panel` 年份选择器）。
- 年份用按钮平铺（2026/2025/2024/2023/2022），当前年带"本期"角标，与目标分解页一致。
- 市级、区级两种视图都应用同一布局。

### 2. 市级详情页支持编辑考核结果和备注
**文件**：`src/pages/gov/AssessDualDistrictDetail.tsx`、`src/components/assess/DistrictAssessTable.tsx`

- 详情页本地维护 `rows` 状态，把 `mode="city-view"` 改为 `mode="city-edit"`（新增模式），传入 `onChange`。
- `DistrictAssessTable`：
  - 新增 `city-edit` 模式，与 `district-edit` 一样展示"考核结果"下拉 + "备注" 输入框。
  - 备注 `<Input>` 增加 `onKeyDown`：按 Enter 触发 `blur()`/提交并 `toast.success("备注已保存")`，行为对两种编辑模式都生效。

### 3. 市级详情页新增统计卡片
**文件**：`src/pages/gov/AssessDualDistrictDetail.tsx`

- 在说明条之上加入 4 张卡片：企业总数 / 完成 / 未完成 / 达标率（与区级 `AssessDual` 区视图一致），数据基于本地 `rows` 计算。

### 4. 区级管理员去掉"百千家通信业"Tab
**文件**：`src/pages/gov/AssessDual.tsx`

- 区级视图改为不使用 `<Tabs>`，直接展示"区下属单位能耗目标考核"内容（统计卡片 + 说明 + `DistrictAssessTable`）。
- 市级视图保留双 Tab。

### 技术细节

- 年份选择沿用 `AssessGoal.tsx` 中的实现模式：`YEARS` 常量 + `CURRENT_YEAR` 常量 + 渐变高亮当前选中。
- `DistrictAssessTable` 新增的 `city-edit` 与 `district-edit` 共用编辑分支：`const editable = mode === "district-edit" || mode === "city-edit";`
- 备注 Enter 提交：`onKeyDown={(e) => { if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); toast.success("已保存"); } }}`。
- 不修改 mock 数据结构。
