## 需求拆解

1. **基本信息 Tab**：在「详细地址」之后增加「所属集团」字段（企业侧 + 政府侧只读视图）。
2. **能源管理岗位备案 Tab**：去掉顶部操作栏的「同步企业设置」和「上传备案表」按钮。
3. **导出按钮**：点击「导出」后浏览器下载该企业对应的 PDF（如「三井高科技（上海）有限公司.pdf」）。
4. **岗位备案 增删改 + 校验交互**：基本信息、能源岗位、碳排岗位 3 个子页 — 编辑/保存校验必填字段；管理人员名册支持新增、编辑、删除并带校验；备案文件支持新增/删除（已有，补校验提示）。
5. **碳排放管理岗位备案 Tab**：同样去掉「上传岗位备案表」按钮。

## 实现方案

### 1. 资源准备
- 把用户上传的 `三井高科技（上海）有限公司.pdf` 复制到 `public/exports/三井高科技（上海）有限公司.pdf`，作为所有"导出"按钮的下载样本（mock 行为：导出文件名 = `${企业名称}.pdf`，下载内容统一指向该样例 PDF）。

### 2. 基本信息字段（`src/components/posts/PostBasicTab.tsx`）
- 在 `FIELDS.loc` 数组里 `address` 之后追加 `{ key: "group", label: "所属集团" }`。`BasicInfo.group` 已存在于 mock 数据，直接复用。
- 编辑模式下增加简单必填校验：`name`、`creditCode`、`industry` 为空时点保存 toast 提示 + 阻止退出编辑态。

### 3. PostFilingTab 顶部操作栏（`src/components/posts/PostFilingTab.tsx`）
- 移除「同步企业设置」按钮（`RefreshCw`）。
- 移除「上传备案表」按钮（`Upload`）— energy 与 carbon 共用此组件，自然两个 Tab 都去掉。
- 「导出」按钮改为可点击：触发一个 `<a>` 临时元素，`href="/exports/三井高科技（上海）有限公司.pdf"`，`download="${企业名称}.pdf"`，自动 click 然后 toast「已开始下载」。
- 通过 prop 把当前企业名 `enterpriseName` 透传进 `PostFilingTab`（在 `EntPosts.tsx`、`GovPostDetail.tsx` 调用处补传）。

### 4. 详情页顶部「导出 PDF / 导出名册」（`src/pages/gov/GovPostDetail.tsx`）
- 让这两个按钮也走相同下载逻辑（同一个 mock PDF，文件名带企业名）。

### 5. 字段校验逻辑（PostFilingTab）
- 保存「领导与负责人」时校验：`leader.name`、`leader.duty`、`owner.name`、`owner.department` 必填；电话/邮箱格式简单正则校验，不通过 toast 错误提示并保持编辑态。
- `OwnerInfo.hasCert === true` 时，`certNo`、`certDate` 必填。

### 6. 管理人员名册新增/编辑/删除（`src/components/posts/PostStaffTable.tsx`）
- 新增本地 state：`rows`（取自 props 初始化）+ `editing` 行 id（`"new"` 表示新增行）+ `draft` 暂存。
- 「新增人员」按钮：在表格顶部插入一行可编辑空白行（输入框替代单元格）。
- 每行操作按钮 编辑/保存/取消/删除：编辑态把单元格替换为 Input/Select。
- 删除使用 `AlertDialog` 二次确认。
- 校验：姓名、岗位分工、电话必填；电话格式 `/^1\d{10}$/`；`hasCert=是` 时 `certNo` 必填。校验失败 toast。
- 保存/删除后 toast 成功提示（mock，不持久化）。

### 7. 备案文件交互（`src/components/posts/FileUploadList.tsx`）
- `<input type="file">` 加 `onChange`：把所选文件追加到本地 state 列表，文件大小格式化展示，toast「上传成功」。
- 删除按钮加 `AlertDialog` 二次确认 + toast。
- 预览/下载 按钮：复用同一个 mock PDF 下载行为。

### 8. 文件清单

| 类型 | 文件 | 主要改动 |
|---|---|---|
| 新增 | `public/exports/三井高科技（上海）有限公司.pdf` | 复制自上传 |
| 编辑 | `src/components/posts/PostBasicTab.tsx` | 加「所属集团」字段 + 必填校验 |
| 编辑 | `src/components/posts/PostFilingTab.tsx` | 删 2 按钮 + 导出下载 + 字段校验 + 接收 enterpriseName |
| 编辑 | `src/components/posts/PostStaffTable.tsx` | 新增/编辑/删除 + 校验 |
| 编辑 | `src/components/posts/FileUploadList.tsx` | 上传/删除/下载交互 |
| 编辑 | `src/pages/ent/EntPosts.tsx` | 透传 `enterpriseName` |
| 编辑 | `src/pages/gov/GovPostDetail.tsx` | 透传 `enterpriseName` + 顶部按钮接下载 |

### 备注
- 全部数据为前端 mock，刷新后还原；toast 使用项目已接入的 `useToast`/`sonner`。
- 政府侧详情页 `readOnly` 模式下不显示编辑/新增/删除按钮，原有判断保持。
