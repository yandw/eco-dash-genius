## 目标

将门户的"场景招商"模块（首页区块 + 独立页面 + 顶部导航）整体重塑为：**绿色科技创新成果展示 + 推动技术产业化落地的线下基地展厅**。

仅参考用户提供的 4 张图片中的**信息结构与内容**（成果展、线下展厅、节能中心展示大厅 / 工博会专区 / 徐汇西岸常态化展示中心、创新成果卡片），**不沿用其深色霓虹风**——继续使用 `.portal-theme` 现有的浅色 + 深蓝主色 + 卡片阴影风格，与门户其余区块保持视觉一致。

## 命名与导航

- 模块新名称：**绿色科技成果与展示基地**（首页区块标题）/ 路由页面标题 **绿色科技创新成果展示**
- 顶部导航 `场景招商` → `成果展示`
- 路由保持 `/portal/scenarios` 不变（避免外链失效），页面文案与内容全部替换
- `PortalTabsV2` 中的锚点 tab `场景招商` → `成果展示`

## 新增 / 改造文件

### 1. 新组件 `src/components/portal/AchievementShowcase.tsx`（替换首页对 `ScenarioTabs` 的使用）

包含两个子区块，垂直堆叠，沿用 `portal-section-title` / `portal-section-divider`：

**A. 顶部双卡（参考图1）—— 成果展 + 线下展厅入口**
- 左卡：`绿洲成果展`（年度大赛标签）— 描述 + 数据 `80+ 展示技术 / 200+ 参与机构 / 5届 成功举办`，复用 `mfg-demo.jpg` 占位
- 右卡：`绿洲基地线下展厅`（常态展厅标签）— 描述 + 数据 `15+ 工业场景 / 200+ 技术验证 / 3个 展示基地`，复用 `mfg-green-factory.jpg` 占位
- 卡片：`portal-card` 白底 + 顶部图（h-260）+ 标签徽章 + 标题/描述 + 横向数据条（数字用 `text-primary`）

**B. 创新成果网格（参考图2）—— 6 张技术卡片**
- 卡片字段：分类标签（负碳/极致能效/氢能/储能/智能控制等）、标题、简介、城市、投资金额、`认领产品` / `查看详情` 双按钮
- 6 条 mock 数据写入组件内常量（沿用图2文案：工业级碳捕集与封存系统、智能光伏组件优化器、固态储氢关键技术研发、压缩空气储能系统、工业互联网能效管理平台、绿氢制取电解槽技术）
- 网格 `lg:grid-cols-3`，卡片图沿用现有 `mfg-*` / `scene-*` 资源
- 状态徽章颜色：试点验证 / 规模化推广 / 原型阶段 / 成熟商业化 → 用 `portal-theme` 内已有蓝/绿语义色

### 2. 新组件 `src/components/portal/ExhibitionBases.tsx`（仅独立页面用，参考图3/图4）

三个展厅卡片，左右图文交错布局：
1. `节能中心展示大厅` — 上海市徐汇区漕河泾开发区桂平路700号（左文右图）
2. `工博会专区` — 上海市青浦区崧泽大道333号国家会展中心（左图右文）
3. `徐汇西岸常态化展示中心` — 上海市徐汇区龙腾大道2350号西岸智慧谷B栋（左文右图）

每段含序号 `01/02/03`、标题、详细介绍、地址条（`MapPin` 图标 + 浅蓝底）、底部一行邀约横幅。沿用浅色卡片 + 主色边框，**不使用深色背景**。

### 3. 改造 `src/pages/portal/PortalScenarios.tsx`
- Hero 标题改为 `绿色科技创新成果展示`，副标题 `汇聚绿色科技创新前沿成果，推动技术成果产业化落地`
- 页面结构：Hero → `AchievementShowcase` → `ExhibitionBases`

### 4. 改造首页引用
- `src/pages/portal/PortalHome.tsx`：`<ScenarioTabs />` → `<AchievementShowcase />`
- `src/pages/portal/PortalHomeV2.tsx`：同上替换（保留 `id="scenario"` 锚点不变）
- `src/components/portal/PortalTabsV2.tsx`：tab 文案 `场景招商` → `成果展示`

### 5. 顶部导航 `src/components/portal/PortalHeader.tsx`
- `{ to: "/portal/scenarios", label: "场景招商" }` → `{ to: "/portal/scenarios", label: "成果展示" }`

### 6. 删除 `ScenarioTabs.tsx`
全部引用替换完成后删除旧组件文件，避免冗余。

## 视觉规范（保持门户原风格）

- 不引入深色背景、不引入薄荷绿/青色霓虹色，统一使用 `--primary`（深蓝 `217 80% 22%`）+ 浅灰底 `--secondary/40`
- 卡片：`portal-card` 圆角 + 阴影（`--portal-shadow-card`），hover 上浮
- 按钮：`portal-cta-primary` / `portal-cta-ghost`
- 标签徽章：`bg-accent text-primary` 圆角小药丸，与现有 `BusinessFunctions` 风格一致
- 数据数字：`text-2xl font-bold text-primary`，单位与说明 `text-xs text-muted-foreground`

## 不在范围

- 不改任何政府侧 / 企业侧业务页面
- 不引入新静态资源，复用 `src/assets/portal/` 现有图片
- "认领产品 / 查看详情" 按钮仅 UI，不接业务逻辑
