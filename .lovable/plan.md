## 目标
在市级管理员账号下，于"考核管理"二级菜单中新增"任务管理"，提供任务列表、新建任务弹窗（含按类型下载企业名单模板）、编辑/删除、分页等完整交互。

## 范围
- 仅 `city_admin` 可见该菜单（与"区/集团管理"同样的权限策略）。
- 复用现有 UI 组件（Card / Table / Dialog / ListPagination / Select / Input / Badge / Button 等）和已有 mock 模式。
- 路由：`/gov/assess/tasks`（替换当前 placeholder 实现）。

## 数据模型（mock）
新建 `src/mocks/assessTasks.ts`：
```ts
export type AssessTaskType = "目标分解" | "双控考核" | "碳排放考核";
export type AssessTaskStatus = "未开始" | "进行中" | "已结束" | "已归档";

export interface AssessTask {
  id: string;
  year: number;            // 年份
  type: AssessTaskType;    // 类型
  startDate: string;       // 开始时间 YYYY-MM-DD
  endDate: string;         // 结束时间
  status: AssessTaskStatus;
  createdAt: string;       // 创建日期
  enterprises: { name: string; creditCode: string }[]; // 企业名单
  enterpriseFileName?: string; // 上传文件名展示
}
```
内置 6-10 条样例数据，覆盖三种类型与四种状态。提供 `listTasks / createTask / updateTask / deleteTask` 内存方法（带 `subscribe` 回调便于刷新，参照 `assessStatusStore` 风格）。

## 路由 & 菜单
1. `src/components/AppSidebar.tsx`：在 `govItems` 的"考核管理" children 中，仅 `isCityAdmin()` 时插入：
   ```ts
   { title: "任务管理", url: "/gov/assess/tasks", icon: ClipboardList }
   ```
2. `src/App.tsx`：路由 `/gov/assess/tasks` 指向新页面 `AssessTasks.tsx`（覆盖原 placeholder）。

## 页面：`src/pages/gov/AssessTasks.tsx`
顶部：
- 面包屑/标题"考核管理 / 任务管理"。
- 筛选条：年份 Select、类型 Select、状态 Select、关键字 Input，右侧"新建任务"按钮。

列表（Card 包裹 Table + ListPagination）：
| 列 | 说明 |
|----|----|
| 年份 | 数字 |
| 类型 | Badge 颜色区分三种类型 |
| 开始时间 / 结束时间 | YYYY-MM-DD |
| 状态 | Badge（未开始=secondary，进行中=primary，已结束=outline，已归档=muted） |
| 创建日期 | YYYY-MM-DD |
| 企业名单 | 显示"共 N 家"，点击弹出 Dialog 列出企业表格 |
| 操作 | 编辑 / 删除（删除二次确认 AlertDialog） |

分页：复用 `ListPagination`，默认每页 10。

## 新建/编辑任务 Dialog
字段：
- 年份（Select：当前年±2）
- 类型（Select：目标分解 / 双控考核 / 碳排放考核）
- 开始时间、结束时间（`<Input type="date">`）
- 状态（默认"未开始"，编辑时可改）
- 企业名单上传：
  - `<Input type="file" accept=".xlsx,.xls,.csv">`，仅记录文件名 + mock 解析为 N 家企业。
  - 紧邻一个"下载企业名单模板"链接按钮，**链接随类型联动**：
    - 目标分解 → `goal-template.csv`
    - 双控考核 → `dual-control-template.csv`
    - 碳排放考核 → `carbon-template.csv`
  - 模板由前端运行时构造 Blob 下载（不同类型字段不同）：
    - 目标分解列：`企业名称, 统一社会信用代码, 区/集团, 上年综合能耗, 上年碳排放, 目标降幅(%)`
    - 双控考核列：`企业名称, 统一社会信用代码, 综合能耗(tce), 单位增加值能耗, 节能目标完成率`
    - 碳排放考核列：`企业名称, 统一社会信用代码, 碳排放总量(tCO2), 碳排放强度, 减排目标(%)`

校验：必填校验 + 结束时间 ≥ 开始时间；toast 反馈。

## 权限控制
- 菜单项仅 city_admin 可见。
- 页面内通过 `isCityAdmin()` 守卫；非市级访问显示"无权限"提示卡片。

## 技术细节
- 使用 `useState` + store 订阅刷新列表。
- 模板下载用工具函数 `downloadTextFile(name, content)`，置于页面内部即可（后续可抽离）。
- 删除使用 `AlertDialog`，操作完成后 toast。
- 遵循设计系统：仅使用语义 token 颜色，HSL；不写裸色值。

## 涉及文件
- 新增 `src/mocks/assessTasks.ts`
- 新增 `src/components/assess/AssessTaskFormDialog.tsx`（新建/编辑弹窗）
- 重写 `src/pages/gov/AssessTasks.tsx`（替换占位实现）
- 编辑 `src/components/AppSidebar.tsx`（菜单项 + 权限）
- 编辑 `src/App.tsx`（路由，如缺失）

## 不做的事
- 不接入真实后端 / 不解析上传文件内容（仅记录文件名 + mock 数量）。
- 不修改其它角色侧导航与页面。