# 优化要闻动态模块

## 现状问题

1. 列表页（`/portal/news`）当前每条新闻除标题、简介、时间外，还展示了大封面图，且左侧还有分类侧边栏与搜索框，与需求"标题+简介+时间"不一致。
2. 详情页（`/portal/news/:id`）当前用 `<iframe>` 嵌入微信公众号链接，由于微信对外站点禁用 iframe（X-Frame-Options），实际加载到的是微信"参数错误"提示页，体验异常。
3. 列表页（`PortalNews.tsx`）使用的扩展数据有 id `"4"`、`"5"`，与详情页数据源 `newsArticles`（id 为 `n1`–`n7`）不匹配，点这两条会落到默认 `n1`。
4. 列表与首页轮播分别维护新闻数据，存在重复。

## 目标

- 列表：每条卡片只展示「标题 + 简介 + 发布时间」，去掉封面图、分类标签和侧边栏。
- 详情：在站内直接渲染新闻正文，不再使用 iframe，不再出现"参数错误"。
- 数据：统一使用 `src/mocks/news.ts` 的 `newsArticles`（id 为 `n1`–`n7`），首页轮播也指向同一数据源，确保点击任何一条都能进入对应详情。

## 改动方案

### 1. 列表页 `src/pages/portal/PortalNews.tsx`
- 数据源改用 `newsArticles`（仅 `status === "published"` 的条目）。
- 移除左侧分类侧边栏、搜索框（保留 Hero）；改为单列卡片列表。
- 每张卡片：标题（大号、加粗）+ 简介（2 行截断）+ 右下角发布时间。无封面图、无分类徽标。
- 卡片点击跳转 `/portal/news/{id}`。

### 2. 详情页 `src/pages/portal/PortalNewsDetail.tsx`
- 移除 iframe 与"在微信中打开"提示框。
- 渲染顺序：返回按钮 → 标题 → 元信息行（来源 / 发布时间 / 浏览量）→ 封面大图 → 正文段落。
- 正文：在 `newsArticles` 中没有 `content` 字段，新增可选 `content?: string`（段落数组或长字符串），并为 `n1`–`n6` 各补一段示例正文（围绕已有 summary 扩写 3–5 段）。原 `wechatUrl` 可保留为「原文链接」按钮，新窗口打开，但页面不再 iframe 嵌入。
- 找不到 id 时显示"新闻不存在"占位，而不是默认回落到 n1。

### 3. 首页轮播 `src/components/portal/NewsCarousel.tsx`
- 将本地 `newsList` 替换为从 `newsArticles` 派生（取前 4 条 published），保持现有大图 + 列表布局。
- 链接 `to={`/portal/news/${n.id}`}` 已经匹配 `n1`–`n7` 的 id。
- 同步导出兼容字段（如其他文件还在引用 `newsList`），保持向后兼容。

### 4. 数据 `src/mocks/news.ts`
- 给 `NewsArticle` 增加可选字段 `content?: string[]`。
- 为前 6 条发布状态的新闻补 3–5 段中文正文示例。

## 涉及文件

- 修改：`src/pages/portal/PortalNews.tsx`
- 修改：`src/pages/portal/PortalNewsDetail.tsx`
- 修改：`src/components/portal/NewsCarousel.tsx`
- 修改：`src/mocks/news.ts`

## 不在本次范围

- 接入真实微信公众号文章抓取/代理（需后端，能绕过 X-Frame-Options），如需后续可单独提出。
