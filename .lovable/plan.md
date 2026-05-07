基于已完成的门户原型，输出一份可直接交付研发评审的《门户模块 PRD》Word 文档（.docx），按"背景 / 需求描述（功能概述、需求目标、需求范围、详细需求描述）"的结构组织，详细到字段、交互与异常级。

## 交付物

- 文件：`/mnt/documents/PRD-门户模块_v1.docx`
- 格式：A4 纵向，正文宋体/Arial 10.5pt，标题加粗，表格用于字段与交互规则。
- 文末附录：演示账号、术语表。

## 文档大纲（最终生成的 PRD 结构）

### 一、背景

- 平台定位：上海市工业和通信业能碳数智空间面向政府监管侧、企业服务侧两类用户，门户为统一公众入口。
- 业务背景：节能监察、绿色制造、双控考核等业务此前分散在多个系统，需要一个统一的对外宣传 + 业务入口 + 资讯发布门户。
- 用户角色：访客（未登录公众/媒体）、企业账号、政府账号；门户为三类用户共同入口。

### 二、需求描述

#### 2.1 功能概述

门户模块包含 8 个页面 + 公共框架（Header / Footer），整体分为 4 类：

| 类别 | 页面 | 路由 |
|------|------|------|
| 首页 | 门户首页 | `/portal` |
| 内容栏目 | 绿色制造、绿色工厂示范单位、场景招商、要闻动态列表、要闻动态详情 | `/portal/green-mfg`、`/portal/green-mfg/factories`、`/portal/scenarios`、`/portal/news`、`/portal/news/:id` |
| 账号 | 登录、注册 | `/portal/login`、`/portal/register` |
| 公共 | 顶部导航 PortalHeader、底部 PortalFooter | 全局 |

#### 2.2 需求目标

1. 对外：树立平台品牌形象，展示绿色制造成果与要闻动态。
2. 对内：作为政府/企业用户访问业务系统的统一入口，承载登录与权限校验。
3. 数据：统一管理资讯、绿色工厂、科技成果、展示基地等运营内容。

#### 2.3 需求范围

- 包含：门户首页、绿色制造（含示范单位子页）、场景招商（含科技成果与展示基地）、要闻动态（列表+详情）、登录、注册、公共 Header/Footer。
- 不包含：政府侧 / 企业侧业务模块（独立 PRD）、运营后台资讯管理（已在政府侧 NewsAdmin PRD 中描述，门户只消费已发布数据）。

#### 2.4 详细需求描述

按页面拆解，每页输出：页面说明 → 区块清单 → 字段表 → 交互规则 → 异常/边界 → 权限。

**2.4.1 公共框架**

- PortalHeader（透明/实心两种变体）：导航项「首页/绿色制造/场景招商/要闻动态」+ 右侧登录入口/用户头像下拉（已登录显示用户名首字 + 退出登录）。
- PortalFooter：品牌区、友情链接（5 个外链 target=_blank）、联系方式、备案号。

**2.4.2 门户首页 `/portal`**

按从上到下区块：

1. HeroBanner（高 520px，城市天际线背景）：左上角口号、居中 Logo+主标题、3 个 CTA（政府管理侧 / 企业服务侧 / 体验门户 V2，未登录跳登录页）。
2. StatsBar（碳账户统计条）：5 项数据（市级/区级/园区/集团/企业碳账户数量）。
3. GreenMfgGrid（绿色制造 4 卡片宫格）：绿色工厂、企业预评估、培育库、示范单位（仅"示范单位"可点击进入子页）。
4. AchievementShowcase（场景招商双卡）：绿色科技成果、基地展厅，均跳 `/portal/scenarios`。
5. BusinessFunctions（业务功能）：政府侧/企业侧 Tab 切换，分页展示 4 个/页，未登录点击 → toast 提示并跳登录页（带 from 回跳）。
6. NewsCarousel（要闻动态）：取已发布 4 条最新资讯，"查看更多"跳列表页。

**2.4.3 绿色制造 `/portal/green-mfg`**

- Hero 横幅 + GreenMfgGrid 宫格复用。
- 字段：tile.title、desc、image、to。

**2.4.4 绿色工厂示范单位 `/portal/green-mfg/factories`**

- 卡片字段：name（企业名称）、level（国家级/市级绿色工厂）、year、image、measures[{title, desc}]。
- 等级标签颜色区分（国家级 primary / 市级 emerald）。

**2.4.5 场景招商 `/portal/scenarios`**

- TechAchievementsGrid（绿色科技创新成果）：tag、title、desc、image、status（试点验证/规模化推广/原型阶段/成熟商业化，状态标签色区分）。
- ExhibitionBases（线下展示基地）：no、title、desc、address、image，左右交错布局。

**2.4.6 要闻动态列表 `/portal/news`**

- 左侧分类（热点动态/企业发布/通知公告，单选）+ 右侧搜索框 + 列表。
- 列表字段：cover、title、summary、publishAt、pinned。
- 排序：pinned 优先 → publishAt 倒序。
- 仅展示 status=published 的数据；空态展示"未找到相关资讯"。

**2.4.7 要闻动态详情 `/portal/news/:id`**

- 字段：category、title、source（含自定义 sourceCustom 显示规则）、publishAt、cover、content[]（按段落渲染）。
- 异常：id 不存在 → 展示"新闻不存在"+ 返回列表入口。

**2.4.8 用户登录 `/portal/login`**

- 字段：username（必填）、password（必填）、记住账号（勾选）。
- 校验：均必填，错误 toast；接 mock auth，演示账号 admin / 123456。
- 成功：toast + 跳 location.state.from（默认 /portal）；失败 toast"账号或密码错误"。

**2.4.9 用户注册 `/portal/register`**

- 字段：企业名称、账号、密码（当前为占位，研发阶段需对接接口）。
- 入口：登录页"已有账号？返回登录"链接。

#### 2.5 交互与异常通用规则

- 未登录访问业务功能：toast 警告 + 重定向登录，登录后回跳原入口。
- 外链统一 target=_blank, rel=noopener。
- 图片懒加载 loading="lazy"。
- 响应式断点：≥1024 桌面 / ≥768 平板 / 默认移动；门户最大宽度 1400px。

#### 2.6 权限矩阵

| 角色 | 浏览门户 | 登录 | 业务功能入口 | 个人中心 |
|------|--------|------|-------------|--------|
| 未登录 | ✓ | — | 跳登录 | — |
| 企业账号 | ✓ | ✓ | 仅企业侧入口 | ✓ |
| 政府账号 | ✓ | ✓ | 仅政府侧入口 | ✓ |

### 附录

- 演示账号、外链清单、术语表（双控、CBAM、能效领跑等）、版本记录。

## 实现步骤

1. 用 docx-js 脚本生成文档，包含标题层级、表格（字段表/权限矩阵）、有序无序列表。
2. 使用现有的 docx skill 中的 generation 模板，设置 A4、Arial 字体、Heading1/Heading2 样式。
3. 生成后用 LibreOffice 转 PDF + 截图首/中/末页 QA，确保无溢出/缺字。
4. 输出至 `/mnt/documents/PRD-门户模块_v1.docx` 并附 `<lov-artifact>` 链接。

## 后续可扩展

- 后续每个模块（政府监管侧、企业服务侧、节能档案、双控考核、资讯管理 …）独立按相同模板出 PRD。