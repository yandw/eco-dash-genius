## 目标

完善「待填报」状态档案的默认数据、提交审核交互、以及详情页流程时间轴的最低显示。

## 1. 主要产品默认值（待填报也有）

文件：`src/mocks/archives.ts`

`baseDetail(year, withData=true)` 中，`products` 当前在 `withData=false` 时为空数组。改为：无论 `withData` 真假，`products` 都返回固定的 2 行默认值（数据来源于年报和限额报告，企业无需手填）。同步把 `completed.products` 默认置为 `true`。

`basic`/`audits`/`projects` 的逻辑保持不变（仍受 `withData` 控制）。

## 2. 提交审核交互完善

文件：`src/pages/ent/EntArchiveDetail.tsx`

把目前的「直接 `toast.success` 提交」改为完整的二次确认 + 提交流程：

- 新增 `AlertDialog` 组件「提交审核确认」：
  - 标题：确认提交本年度档案？
  - 描述：列出当前完成度（X/5 步骤），并提示「提交后将进入经信委审核，期间不可直接编辑，可点击撤回」。
  - 当存在未完成步骤时，描述中以 warning 文案列出未完成的步骤名（来自 `ARCHIVE_STEPS`），但仍允许提交。
  - 操作：取消 / 确认提交（gradient-primary）。
- 确认后：
  - `toast.loading("正在提交...")` → 600ms 后 `toast.success("已提交至中心审核，等待经信委审核")`。
  - 本地 `useState` 管理 `localStatus`（初始 `yr.status`），提交后置为 `"submitted"` 并 push 一条 timeline 项「提交审核」。
  - 顶栏的状态徽章、按钮（撤回 vs 提交）、`readOnly` 都基于 `localStatus`。
- 「撤回提交」「保存草稿」沿用现有 toast，但同样写入本地 timeline 并切换 `localStatus`。

## 3. 待填报档案的时间轴

文件：`src/mocks/archives.ts` + `src/pages/ent/EntArchiveDetail.tsx`

待填报档案 (`status: "pending"`) 当前 `timeline: []`，详情页会显示「尚无操作记录」。改为：

- mock 中 ent-001 的 2025 待填报档案补一条 timeline：
  ```
  { time: "2026-01-01 00:00", actor: "系统", action: "创建年度档案",
    comment: "年度档案已由系统自动生成，请按时填报", type: "info" }
  ```
- 同时在 `EntArchiveDetail.tsx` 内，渲染 timeline 时合并：
  - 基础项 = `yr.timeline`
  - 若用户在当前会话里触发了「保存草稿 / 提交 / 撤回」，append 到本地副本（与第 2 点联动）。

## 4. ArchiveTimeline 兼容

`ArchiveTimeline.tsx` 当前已支持 `info` 类型，无需修改；只需保证传入数组非空即正常渲染。

## 受影响文件

- `src/mocks/archives.ts`：products 改为始终默认；ent-001 的 2025 pending 档案补 1 条创建 timeline。
- `src/pages/ent/EntArchiveDetail.tsx`：新增提交确认 AlertDialog、本地 status/timeline 状态、按钮与 readOnly 改为响应本地状态。

## 不在本次范围

- 真实的服务端提交、撤回、保存接口
- 提交校验阻断（仅提示不阻断）
- 政府侧时间轴展示调整
