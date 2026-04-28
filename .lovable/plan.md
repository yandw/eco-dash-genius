# 门户网站 V2 版本

保留原门户首页 (`/portal`)，新增 V2 版本路由 (`/portal/v2`)，并在原首页 Hero 区域增加跳转入口。

## 改动

### 1. 新增 V2 首页
- `src/pages/portal/PortalHomeV2.tsx`
- 复用现有 `<PortalLayout>`，模块顺序按 V2 结构：
  ```
  HeroBanner（含返回 V1 入口）
  StatsBar
  NewsCarousel        ← 新闻模块上移到英雄页下方
  GreenMfgGrid        ← 绿色制造
  ScenarioTabs        ← 场景招商
  BusinessFunctions   ← 业务功能
  ```

### 2. 新增 Hero 变体
- `src/components/portal/HeroBanner.tsx` 增加 `version?: "v1" | "v2"` 可选 prop（默认 `v1`，避免影响原首页）
- V2 模式下：
  - 在原"政府管理侧 / 企业服务侧"两个按钮旁加一个"返回经典版"链接（指向 `/portal`）
  - 主标题副标题可标注 `Version 2 · 新版门户`

### 3. 在原首页加 V2 入口
- 原 `HeroBanner`（`v1` 模式）的右上角或按钮组旁，加一个轻量的"体验新版门户 →"链接（指向 `/portal/v2`），不破坏现有视觉

### 4. 路由注册
- `src/App.tsx` 新增：
  ```tsx
  <Route path="/portal/v2" element={<PortalHomeV2 />} />
  ```

## 不改动

- 原 `PortalHome.tsx`、`PortalHeader`、`PortalFooter`、各模块组件的内容和样式都保持原样
- 仅在 Hero 组件加一个版本切换入口，其它路径不受影响
