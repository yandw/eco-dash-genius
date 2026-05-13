## 目标

抓取门户的 5 个长页面整页截图并保存到 `/mnt/documents/`，供下载。

## 抓取页面

| 路径 | 文件名 |
|---|---|
| `/portal` | `portal-home.png` |
| `/portal/green-mfg` | `portal-green-mfg.png` |
| `/portal/scenarios` | `portal-scenarios.png` |
| `/portal/news` | `portal-news.png` |
| `/portal/login` | `portal-login.png` |

## 实施方式

由于 `browser--screenshot` 仅支持当前视口截图，无法一键长截图，使用 Playwright 脚本抓取整页：

1. 在 `/tmp/capture.mjs` 写脚本，使用预览 URL `https://id-preview--e62e8152-16bb-4f7f-b22d-f9d29063e448.lovable.app` 作为基址
2. 视口宽度 1440px（与门户主流设计宽度一致），`fullPage: true`
3. 每页打开后等待网络空闲 + 滚动到底再回到顶部，触发懒加载图片
4. 输出 PNG 至 `/mnt/documents/`
5. 用 `code--exec` 安装 playwright（如需）并运行脚本
6. 抓完逐张转图检查无空白/截断后，用 `<presentation-artifact>` 标签列出 5 个文件供下载

## 备选

若 Playwright 在沙箱不可用，则改用 `chromium` + Puppeteer，或退回 `code--fetch_website` 的 screenshot 格式（其只能视口截图，会拼接多张），优先方案 A。

确认后我将开始执行。