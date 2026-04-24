## 目标

将 `/gov/*` 与 `/ent/*` 全部后台页面（侧边栏、顶部栏、面板、KPI 卡、图表配色、按钮、徽章等）的视觉风格，统一为门户首页 `/portal` 的"浅色生态绿"风格，保持布局/字段/交互完全不变，仅替换配色与质感。

## 设计思路

后台所有页面（`AppLayout`、`AppSidebar`、各种 `panel`、`KpiCard`、图表）都通过 HSL 设计令牌（`--primary` / `--accent` / `--sidebar-*` / `--gradient-*` 等）取色。因此 **不需要逐个页面改样式**，只需把 `src/index.css` 中的全局令牌从"科技蓝"切换到"生态绿"，整套后台界面会自动迁移到门户同款风格。

门户绿生态参考调色（取自 `src/styles/portal.css`）：
- 主色 deep green：`155 55% 28%`
- 主色亮绿：`150 55% 45%`
- 背景：`150 20% 98%`
- 前景：`160 30% 12%`
- 弱色文本：`160 12% 45%`
- 强调底：`150 40% 94%`
- 边框：`150 20% 90%`

## 修改清单

### 1. 重写 `src/index.css` 设计令牌

把 `:root` 内的颜色令牌改为门户绿生态调色，包括：
- `--background / --foreground / --card / --popover`
- `--primary / --primary-foreground / --primary-glow`（主色由 217 蓝 改为 155 深绿）
- `--secondary`（改为绿色调辅色）
- `--muted / --muted-foreground / --accent / --accent-foreground`
- `--border / --input / --ring`
- `--success` 保持绿调；`--warning` 橙、`--destructive` 红保留以维持告警语义
- `--gradient-primary / --gradient-secondary / --gradient-glow / --gradient-card`：改为绿色渐变
- `--gradient-grid`：网格线改为浅绿灰，避免蓝色感
- `--shadow-glow / --shadow-card / --shadow-elevated`：阴影色改为绿色 HSL（与 `portal-shadow-card` 同源）
- `body` 背景径向辉光由蓝紫改为绿色

### 2. 侧边栏令牌（同样在 `src/index.css`）

- `--sidebar-background`：白
- `--sidebar-foreground`：深绿灰
- `--sidebar-primary`：与 `--primary` 一致
- `--sidebar-accent` / `--sidebar-accent-foreground`：浅绿底 + 深绿字
- `--sidebar-border` / `--sidebar-ring`：绿调

效果：左侧菜单选中态、悬停态自动变成"白底+浅绿块+深绿字+左侧绿色竖线"，与门户的绿色 logo / 按钮呼应。

### 3. AppLayout 顶部栏微调（`src/components/AppLayout.tsx`）

- "退出"链接 hover 颜色由 `text-primary`（蓝）→ 自然变绿（沿用 `--primary`，无需改文件即可生效）
- 头像渐变背景 `bg-gradient-primary` 已改为绿色渐变（通过令牌生效）
- 状态指示点 `glow-dot` 自动跟随 `--primary` 变绿
- 仅需要补一个极小调整：右上角时间数字 `text-primary` 在浅色绿底下视觉权重已合适，无需改

> 该文件**实质上不需要改 JSX**，全部通过令牌完成迁移。

### 4. PlaceholderPage / panel 类（无需改）

- `src/pages/gov/EquipBench.tsx`、`DualAssess.tsx` 中"待设计"占位的 `bg-primary/10` 图标背景会自动变成浅绿
- `src/components/PlaceholderPage.tsx` 的 `bg-gradient-glow` 自动跟随新绿色渐变
- 所有 `.panel` 卡片由于 `--gradient-card` 改色，会呈现极浅的绿白渐变，质感与门户卡片一致

### 5. 图表配色（`src/components/dashboard/*` 与 `src/components/dashboard/overview/*`）

绝大多数图表使用 `hsl(var(--primary))` / `hsl(var(--secondary))` / `--success` / `--warning` / `--destructive` 取色，将自动迁移成绿色主、辅色绿、橙告警、红超标的生态配色。

仅检查并保留以下硬编码语义色，不做改动：
- IDC 地图四色圆点（绿/蓝/橙/红）：业务语义，保持不变
- 告警等级红/橙：保持
- 趋势对比中"对比基准"的次色若硬编码为蓝，将在实施阶段统一替换为 `hsl(var(--secondary))`，使其跟随新绿调

## 不在范围内

- 门户 `/portal` 已是绿生态，无需调整
- 不修改任何业务字段、表格列、路由、交互逻辑
- 不修改组件结构，仅做配色与质感的令牌级迁移
- 不改变深色/浅色模式（继续浅色）

## 预期效果

- 进入 `/gov` 与 `/ent` 任何页面，整体由"蓝色科技风" → "浅色生态绿"
- 顶部栏、侧边栏、KPI 卡、图表、按钮、徽章、占位页风格与门户首页完全统一
- 无需逐页改动，单点修改令牌即可全站生效，后续也便于维护
