## 目标

将岗位备案详情页中"基本信息""能源管理岗位备案""碳排放管理岗位备案"三个子界面的每个分区拆为独立卡片，企业侧（`/ent/posts`）与政府侧（`/gov/posts/:entId`）保持一致。

## 拆分方案

**基本信息（PostBasicTab）** → 4 个卡片：
- 基础资料
- 注册信息
- 联系方式
- 地址信息

**能源/碳排放管理岗位备案（PostFilingTab）** → 4 个卡片：
- 主管领导信息
- 负责人信息
- 备案文件
- 管理人员名册

## 改动文件

1. `src/components/posts/PostBasicTab.tsx`
   - 将 4 个 `<ArchiveSection>` 各自包裹进独立的 `<Card className="p-5">`，section 之间产生卡片间距（依靠外层 `space-y-4`）。
   - 顶部"编辑/保存"操作条保持在卡片之外。

2. `src/components/posts/PostFilingTab.tsx`
   - 同样将 4 个 `<ArchiveSection>` 分别包到独立 `<Card className="p-5">`。
   - 顶部"最近更新 + 导出 / 编辑"操作条保留为现有的浅色操作条样式，不变。

3. `src/pages/ent/EntPosts.tsx` 和 `src/pages/gov/GovPostDetail.tsx`
   - 将包裹 `<Tabs>` 的外层 `panel p-5` 改为 `panel p-4`（或保留），让内部独立卡片视觉上与现页 EntCarbonGoalForm 风格一致：外层是浅色容器，内部是多张白色卡片。
   - 不修改 Tabs 切换、状态徽章、顶部摘要区。

## 视觉细节

- 每张卡片使用 `<Card className="p-5">`，内部保持原 `ArchiveSection` 的标题条 + 描述 + 内容布局。
- 卡片间距：通过外层 `space-y-4` 控制。
- 不引入新颜色，沿用现有 design tokens。
- 仅前端展示层调整，不改动 mock 数据、校验逻辑、保存逻辑。
