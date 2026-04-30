## 目标

完善节能档案各子界面的列表交互一致性：精简操作按钮、修正文案、补全改造项目计划的增删改弹窗，并为四个表格统一接入分页选择器。

## 1. 能源审计 / 能效诊断 — 操作按钮改为图标

文件：`src/components/archives/ArchiveStepContent.tsx` `AuditTable`

- 编辑按钮：去掉「编辑」文字，仅保留 `Pencil` 图标，使用 `variant="ghost"` + `size="icon"` + `title="编辑"`（hover 提示）。
- 删除按钮：去掉「删除」文字，仅保留 `Trash2` 图标，`title="删除"`，保留红色 `text-destructive`。
- 操作列宽度收窄。

## 2. 主要产品情况 — 文案修改

文件：`src/components/archives/ArchiveStepContent.tsx` `Products`

- description 由 `如已纳入国家能耗限额标准目录，将自动比对并生成对标等级` 改为 `数据来源于年报和限额报告`。

## 3. 节能降碳改造和用能设备更新项目计划 — 完善增删改交互

文件：
- `src/mocks/archives.ts`：`ProjectRow` 增加 `id: string`；mock 数据补 `id`。
- `src/components/archives/ArchiveStepContent.tsx` `Projects` 重构：

新增/编辑：弹窗 `ProjectFormDialog`，字段（顺序与现有展示一致）：

- 项目名称 *（Input）
- 项目类型 *（Select：新建 / 改造 / 更新）
- 实施单位 *（Input）
- 建设地点 *（Input）
- 总投资（亿元）*（Input，数字）
- 建设起止时间 *（Input，文本，格式 `YYYY-MM 至 YYYY-MM`）
- 立项信息（Input）
- 能评批复（Input）
- 环评批复（Input）
- 用地（Input）
- 更新改造内容 *（Textarea）

校验：必填项缺失 → toast.error；通过 → toast.success 并关闭弹窗，调用 onSave。

新增按钮：保留 section header 右侧「新增项目」（gradient-primary），点击打开空白弹窗。

行操作：编辑（铅笔图标）/ 删除（垃圾桶图标），均为图标按钮，`title` 提示。

删除：`AlertDialog` 二次确认「确认删除该项目？」→ 调 onDelete。

状态：`Projects` 内部 `useState<ProjectRow[]>(detail.projects)`，统一 upsert / remove。
`readOnly` 时隐藏新增按钮和行操作。

## 4. 四个列表统一接入分页选择器

引入：`import { ListPagination, paginate } from "@/components/ui/list-pagination";`

为以下列表都添加分页：
- Products（detail.products）
- Equipments（detail.equipments）
- Audits 内部 `AuditTable`（rows） — 两张表各自独立分页
- Projects（projects state）

实现要点：
- 每个组件（或 AuditTable）维护本地 `page=1`、`pageSize=10`，`pageSizeOptions=[10, 20, 50]`。
- 用 `paginate(list, page, pageSize)` 切片渲染。
- 在表格容器底部（border 内）渲染 `<ListPagination total={list.length} ... />`。
- 仅当 `list.length > 0` 时显示分页，空态隐藏。

## 受影响文件

- `src/mocks/archives.ts`：`ProjectRow` 增 `id` 字段，mock 数据补 `id`。
- `src/components/archives/ArchiveStepContent.tsx`：
  - `Products`：改文案、加分页。
  - `Equipments`：加分页。
  - `AuditTable`：操作改图标、加分页。
  - `Projects`：重构为状态管理 + 弹窗 + 删除确认 + 分页。

## 不在本次范围

- Audit/Project 的真实文件上传（仍 mock）
- 多选批量删除
- 服务端分页（纯前端切片）