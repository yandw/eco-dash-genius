## 目标
将上传的 Logo 应用到门户页头部、英雄页与页脚，并按要求调整页脚文案与友情链接。

## 一、Logo 接入
- 复制 `user-uploads://image-42.png` 到 `src/assets/portal/logo.png`，作为门户统一 Logo 资源。

## 二、PortalHeader（`src/components/portal/PortalHeader.tsx`）
- 在顶部导航左侧加入 Logo（约 32px 高），点击回到 `/portal`。
- Logo 旁可加一行小号站点中文名（透明 header 时白色，solid header 时深色），保持现有导航与登录按钮位置。

## 三、英雄页（`HeroBanner.tsx` + `HeroBannerV2.tsx`）
- 在主标题上方居中渲染 Logo（约 64–72px 高，带轻微阴影），与现有标题/口号/CTA 保持垂直节奏。
- 不影响左上角口号与右上角操作（V2）。

## 四、页脚（`src/components/portal/PortalFooter.tsx`）
- 左侧品牌区：
  - 用真实 Logo 图替换原来的 Leaf 占位图标。
  - 文案 "Carbon Intelligence Shanghai" 改为 "上海市工业和通信业能碳数智空间"。
  - 下方描述改为：「赋能制造业绿色低碳转型，为可持续发展提供智能化支撑。」
- 友情链接：
  - 删除「上海市节能中心」一项。
  - 其余链接补全官网地址，并加 `target="_blank" rel="noopener noreferrer"`：
    - 国家工信部 → https://www.miit.gov.cn
    - 国家发改委 → https://www.ndrc.gov.cn
    - 国家节能中心 → https://www.chinanecc.cn
    - 上海市经信委 → https://sheitc.sh.gov.cn
    - 上海市发改委 → https://fgw.sh.gov.cn
- 联系我们：删除「电话：XXX-XXXXX」，仅保留地址。
- 底部版权行保持不变。

## 验收
- 首页（`/portal`、`/portal/v2`）头部、英雄页、页脚均显示新 Logo。
- 页脚品牌名/描述按要求更新，无「上海市节能中心」友情链接，无电话行。
- 点击各友情链接在新标签页打开对应官网。