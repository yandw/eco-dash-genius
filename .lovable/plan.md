# 市级下钻改为路由详情页

将政府侧市级管理员的两个下钻入口由 Dialog 弹窗改为独立的详情路由页，与"区下属单位/企业"详情交互习惯保持一致（在原界面"新开"一个详情页，可通过浏览器返回/面包屑回到列表）。

## 改动范围

### 1. 新增两个路由详情页

- `src/pages/gov/AssessGoalDistrictDetail.tsx` —— 市级目标详情页
  - 路由：`/gov/assess/goal/district/:districtId`
  - 顶部：面包屑「目标分解 / 区下属单位碳排放目标分解 / {区名称} 下属企业碳排放目标分解」+ 返回按钮 + 导出按钮
  - 主体：复用 `<CarbonGoalTable mode="city-view" rows={该区数据} />`
  - 演示数据仅 qingpu 有，其它区显示空态文案（与现弹窗一致）

- `src/pages/gov/AssessDualDistrictDetail.tsx` —— 市级双控考核下属企业页
  - 路由：`/gov/assess/dual/district/:districtId`
  - 顶部：面包屑「双控考核 / 区下属单位能耗目标考核 / {区名称} 下属企业能耗目标考评」+ 返回按钮 + 导出按钮
  - 考核说明条（沿用现弹窗中的文案）
  - 主体：复用 `<DistrictAssessTable mode="city-view" rows={energyAssess} />`

两个详情页都使用 `<AppLayout side="gov">`，保持与列表页一致的左侧导航与头部。

### 2. 修改列表页：去掉 Dialog，改为 navigate

- `src/pages/gov/AssessGoal.tsx`
  - 删除 `Dialog` 相关 import、`drillId` state、`<Dialog>...</Dialog>` 整段
  - `DistrictListTable` 的 `onAction` 改为 `(id) => navigate(\`/gov/assess/goal/district/\${id}\`)`

- `src/pages/gov/AssessDual.tsx`
  - 同上：删除 Dialog 与 `drillId`，`onAction` 改为 `navigate(\`/gov/assess/dual/district/\${id}\`)`

### 3. 注册路由

`src/App.tsx` 在现有 `/gov/assess/goal`、`/gov/assess/dual` 之后新增：

```tsx
<Route path="/gov/assess/goal/district/:districtId" element={<AssessGoalDistrictDetail />} />
<Route path="/gov/assess/dual/district/:districtId" element={<AssessDualDistrictDetail />} />
```

## 交互细节

- 面包屑中的"目标分解 / 双控考核"为可点击链接，回到列表页
- 顶部右上角保留「导出」按钮（toast 提示）和「返回」按钮（`navigate(-1)`）
- districtId 通过 `districts` mock 反查中文名展示
- 浏览器后退键可正常返回列表页（路由方式天然支持）
