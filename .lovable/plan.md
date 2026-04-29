# 门户「业务功能」模块改版

## 目标
按要求重新定义政府侧/企业侧功能入口，每个入口配示意图（AI 生成图片），点击跳转至对应模块二级页面。

## 一、入口与跳转映射

### 政府侧（7 项）
| 功能入口 | 跳转路由 |
|---|---|
| 全景监测 | `/gov` |
| 月报审核 | `/gov/report-monthly` |
| 年报审核 | `/gov/report-yearly` |
| 能耗限额审核 | `/gov/energy-quota` |
| 节能档案审核 | `/gov/archives` |
| 碳排放目标分解 | `/gov/assess/goal` |
| 能耗双控考核 | `/gov/assess/dual` |

### 企业侧（6 项）
| 功能入口 | 跳转路由 |
|---|---|
| 月报填报 | `/ent/report-monthly` |
| 年报填报 | `/ent/report-yearly` |
| 能耗限额填报 | `/ent/energy-quota` |
| 碳排放目标填报 | `/ent/assess/goal` |
| 能耗考核结果 | `/ent/assess/dual` |
| 岗位备案 | `/ent/posts` |

## 二、示意图

为 13 个入口分别生成一张配图（科技感扁平插画风，统一蓝绿色调与门户主题保持一致），存放至 `src/assets/portal/biz/`：
- gov-overview.jpg, gov-monthly.jpg, gov-yearly.jpg, gov-quota.jpg, gov-archives.jpg, gov-carbon-goal.jpg, gov-dual-assess.jpg
- ent-monthly.jpg, ent-yearly.jpg, ent-quota.jpg, ent-carbon.jpg, ent-assess-result.jpg, ent-posts.jpg

使用 AI 图像生成（Nano banana），统一比例 4:3，风格提示词统一以保持一致性。

## 三、组件改造（`src/components/portal/BusinessFunctions.tsx`）

- 重写 `govItems` / `enterpriseItems`：新增 `image`（导入的图片）和 `to`（跳转路由）字段；每项保留 `label` + 简短 `desc`。
- 卡片改为「图片在上 + 文字在下」布局：
  - 顶部 `aspect-[4/3]` 图片区（`object-cover`，hover 轻微放大）
  - 下方标题 + 一行描述
  - 整卡使用 `react-router-dom` 的 `Link` 包裹，hover 时卡片浮起、出现「进入 →」提示
- 网格：政府侧 7 项使用 `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`（最后一行自然换行）；企业侧 6 项同样栅格自适应。
- 保留现有「政府侧 / 企业侧」切换 Tab 与 `portal-card` 样式风格。

## 四、技术细节

- 图片以 ES 模块导入，确保 Vite 打包正确（避免之前 GreenFactoriesShowcase 的命名错误）。
- 仅修改/新增以下文件：
  - `src/components/portal/BusinessFunctions.tsx`（重写）
  - `src/assets/portal/biz/*.jpg`（新增 13 张图）
- 不影响其它模块（`PortalHome.tsx`、`PortalHomeV2.tsx` 引用方式不变）。

## 验收
- `/portal` 页业务功能区显示新入口与配图
- 切换政府/企业侧分别显示 7 / 6 个入口
- 点击任一入口跳转到对应路由且页面可正常打开
