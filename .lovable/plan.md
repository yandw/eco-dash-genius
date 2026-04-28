## 新闻发布管理模块 设计方案

在政府侧新增 **系统管理 → 新闻发布** 二级菜单，仅市级总账号可见。后台维护"要闻动态"下三大类别（热点动态 / 企业发布 / 通知公告）的新闻条目。每条新闻通过粘贴**微信公众号文章链接**（上海市节能中心、上海经信委等公众号原文 URL）来配置，门户详情页改为直接通过 iframe 嵌入该公众号文章链接。

---

### 一、菜单与路由

修改 `src/components/AppSidebar.tsx` 的 `govItems`，将"系统管理"扩展为含子菜单：

```text
系统管理
 ├─ 系统设置  → /gov/system
 └─ 新闻发布  → /gov/news        (仅市级总账号可见)
```

`src/App.tsx` 注册：
- `/gov/news`            → `NewsAdmin.tsx`（列表/管理页）
- `/gov/news/new`        → `NewsEditor.tsx`（新建）
- `/gov/news/:id/edit`   → `NewsEditor.tsx`（编辑）

侧边栏渲染时通过当前登录角色（mock 一个 `currentUser.role === 'city_admin'`）控制"新闻发布"是否显示，非市级总账号自动隐藏；直接访问路由也提示"无权限"。

---

### 二、列表/管理页 `NewsAdmin.tsx`

顶部：
- 4 个 KPI 卡片：总条数、本月新增、已发布、草稿
- 主操作按钮：**+ 发布新闻**

筛选栏：
- 类别 Tab：全部 / 热点动态 / 企业发布 / 通知公告
- 状态：全部 / 已发布 / 草稿 / 已下架
- 来源公众号：全部 / 上海市节能中心 / 上海经信委 / 其他
- 关键词搜索 + 时间范围

数据表格列：
- 缩略图｜标题｜类别（彩色 Badge）｜来源公众号｜发布时间｜状态｜浏览量｜操作

操作列下拉：
- 编辑 / 预览（在站内新窗口打开门户详情）/ 置顶 / 下架 / 删除（确认弹窗）

支持：批量选择 → 批量下架 / 删除；列表分页；拖拽排序（同类别内调整展示顺序）。

---

### 三、编辑器 `NewsEditor.tsx`

采用左右两栏：左侧表单，右侧实时预览卡片（与门户列表卡片样式一致）。

**表单字段：**
1. 新闻标题 *（input，最长 60 字，含字数计数）
2. 类别 *（Select：热点动态 / 企业发布 / 通知公告）
3. 来源公众号 *（Select：上海市节能中心 / 上海经信委 / 其他自定义输入）
4. 微信文章链接 *（input，自动校验 `https://mp.weixin.qq.com/...`）
   - 含一个"获取信息"按钮：mock 自动抓取公众号文章的标题/封面/摘要回填
5. 封面图（拖拽上传 + URL 兜底；展示 16:10 预览）
6. 摘要 *（textarea，最长 120 字）
7. 发布时间（DatePicker，默认当前）
8. 是否置顶（Switch）
9. 状态（草稿 / 立即发布 单选）

底部固定操作栏：取消 / 保存草稿 / 发布上线（含二次确认）。

---

### 四、门户详情页改造（iframe 嵌入公众号原文）

修改 `src/pages/portal/PortalNewsDetail.tsx`：
- 当新闻条目存在 `wechatUrl` 时，正文区改为：
  - 顶部保留：返回按钮、标题、类别、来源公众号、发布日期
  - 主体：`<iframe src={wechatUrl} className="w-full h-[80vh] rounded-lg border" />`
  - 底部："在微信中打开 ↗" 外链按钮
- 兜底：若链接为空，回退到当前的简介+正文样式。

> 说明：微信公众号正文页存在 `X-Frame-Options` 限制，真实环境通常无法直接 iframe 嵌入。本设计在前端完成 UI；后续若上线需走"微信开放平台代理"或"服务端抓取转存"。Demo 阶段先以 iframe 占位，并附带"在微信中打开"兜底入口。

---

### 五、数据与共享组件

新增 mock：`src/mocks/news.ts`
```text
export type NewsCategory = 'hot' | 'enterprise' | 'notice';
export type NewsStatus   = 'draft' | 'published' | 'offline';
export interface NewsArticle {
  id; title; category; source;        // source: 公众号名称
  wechatUrl; cover; summary;
  publishAt; pinned; status;
  views; createdBy; updatedAt;
}
```

新组件目录 `src/components/news/`：
- `NewsCategoryBadge.tsx`：类别彩色标签
- `NewsStatusBadge.tsx`：状态标签
- `WechatUrlInput.tsx`：URL 校验 + 抓取按钮
- `NewsPreviewCard.tsx`：右侧实时预览
- `NewsTable.tsx`：管理列表表格

`NewsCarousel.tsx` / `PortalNews.tsx` 改为消费 `src/mocks/news.ts` 的统一数据，按 `category` 过滤渲染三大 Tab。

---

### 六、权限控制（mock）

新增 `src/mocks/currentUser.ts` 暴露 `currentRole`，默认设为 `city_admin`。
- `AppSidebar` 根据角色显示/隐藏"新闻发布"项。
- `NewsAdmin` 与 `NewsEditor` 入口检查角色，非 `city_admin` 渲染"无权限"占位。

---

### 七、文件清单

新建：
- `src/mocks/news.ts`、`src/mocks/currentUser.ts`
- `src/pages/gov/NewsAdmin.tsx`、`src/pages/gov/NewsEditor.tsx`
- `src/components/news/NewsCategoryBadge.tsx`、`NewsStatusBadge.tsx`、`WechatUrlInput.tsx`、`NewsPreviewCard.tsx`、`NewsTable.tsx`

编辑：
- `src/components/AppSidebar.tsx`（系统管理增加子菜单 + 角色过滤）
- `src/App.tsx`（注册 3 条路由）
- `src/pages/portal/PortalNewsDetail.tsx`（改为 iframe 嵌入）
- `src/components/portal/NewsCarousel.tsx`、`src/pages/portal/PortalNews.tsx`（改为消费统一 mock，跳转使用 `wechatUrl`）

整体延续"深海军蓝 + 亮蓝"设计基调，使用现有 `Card / Tabs / Table / Dialog / Badge` 组件。
