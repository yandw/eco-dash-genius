## 目标

保留现有门户 `/portal` 不动，新增"门户版本2"路由 `/portal/v2`，按图片参考的结构（参照上海发改委首页布局）重新编排各区块，并在原门户首页与版本2之间提供互通入口（"体验版本2"）。

## 新增/改动文件

### 1. 新增 HeroBannerV2 — `src/components/portal/HeroBannerV2.tsx`
- 复用 `hero-shanghai-bright.jpg` 背景与 `portal-theme` 颜色
- 左上角口号：`节约能源 · 监察有力 · 高效廉洁 · 服务社会`
- 右上角操作区：`登录` 按钮（链接 `/portal/login`）+ "返回旧版门户" 文本链接（链接 `/portal`）
- 中间居中：
  - 主标题：`上海市工业和通信业能碳数智空间`
  - 两个 CTA：`政府管理侧` → `/gov`，`企业服务侧` → `/ent`
  - **不渲染搜索框**（与 V1 区别）
- 底部不嵌入页面导航（导航另起一行，紧贴 Hero 下方）

### 2. 新增 PortalTabsV2 — `src/components/portal/PortalTabsV2.tsx`
- 紧贴 Hero 下方的横向 Tab 行：`首页` / `绿色制造` / `场景招商`
- 默认激活"首页"，点击"绿色制造"/"场景招商"以页面内 `scrollIntoView` 方式滚动到对应区块（通过 `id="green-mfg"` / `id="scenario"` 锚点）
- 视觉：白底带底部细分隔线，激活项橙色文字 + 下划线（参照参考图）
- 内置 sticky 行为可选（`top-0 z-20`），不强制

### 3. 新增页面 PortalHomeV2 — `src/pages/portal/PortalHomeV2.tsx`
按以下顺序组织（复用现有组件，避免重复实现）：

```text
PortalLayout (headerVariant="transparent", 复用 PortalHeader/PortalFooter)
├── HeroBannerV2          (新)
├── PortalTabsV2          (新, 锚点导航)
├── NewsCarousel          (复用 — 要闻动态)
├── BusinessFunctions     (复用 — 政府侧/企业侧 业务功能 Tab)
├── <div id="green-mfg">
│     GreenMfgGrid        (复用 — 绿色制造卡片)
│   </div>
├── <div id="scenario">
│     ScenarioTabs        (复用 — 场景招商卡片)
│   </div>
└── PortalFooter          (复用，与现有门户一致)
```

注意：不渲染 `StatsBar`（V1 浮起统计条），以与参考图结构对齐。

### 4. 路由注册 — `src/App.tsx`
在 `/portal` 路由附近新增：
```tsx
<Route path="/portal/v2" element={<PortalHomeV2 />} />
```

### 5. V1 入口 — `src/pages/portal/PortalHome.tsx` 或 `src/components/portal/HeroBanner.tsx`
在原 Hero 的 CTA 行追加一个轻量按钮 `体验门户 V2 →`（链接 `/portal/v2`），样式沿用 `portal-cta-ghost`，方便对比。

## 视觉与交互细节

- 沿用 `.portal-theme` 配色与 `portal-card` / `portal-section-title` / `portal-section-divider` 样式，确保与 V1 一致
- HeroBannerV2 高度沿用 V1（约 520px），右上角"登录"采用与 PortalHeader 相同的 primary 背景小按钮
- PortalTabsV2 的锚点滚动加 `scroll-mt-20`，避免被 sticky 顶栏遮挡
- 页脚直接复用 `PortalFooter`，无需改动

## 不在本次范围

- 不改动 `/portal/news`、`/portal/green-mfg`、`/portal/scenarios`、`/portal/login`、`/portal/register` 等子页
- 不修改任何政府侧 / 企业侧业务页面
- 不引入新的 mock 数据；要闻、绿色制造、场景招商均使用现有数据源
