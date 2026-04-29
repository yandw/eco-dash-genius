## 目标

- 门户页右上角：未登录显示「登录」按钮；已登录显示默认头像 + 用户名。
- 默认演示账号：`admin` / `123456`，登录后用户名为「市级管理员」。
- 从门户点击业务功能入口（政府侧 / 企业侧的卡片）时校验登录态：未登录则弹出提示并跳转登录页；登录后再跳转到目标业务页面。

## 实施步骤

### 1. 新建简单的本地登录态管理 `src/mocks/auth.ts`
- 用 `localStorage` 存储登录用户：`{ username, displayName }`。
- 提供 `getCurrentUser()`、`login(username, password)`、`logout()`、`useAuth()` Hook（基于 `useSyncExternalStore` 或自定义事件，便于头部状态实时刷新）。
- `login` 校验默认账号：`admin` / `123456` → `{ username: "admin", displayName: "市级管理员" }`，其他组合返回失败。

### 2. 改造 `src/components/portal/PortalHeader.tsx`
- 引入 `useAuth()`：
  - 未登录：保留现有「登录」按钮。
  - 已登录：显示默认头像（`Avatar` 组件首字母 fallback「市」）+ 用户名「市级管理员」，并提供下拉菜单（退出登录）。

### 3. 改造 `src/pages/portal/PortalLogin.tsx`
- 表单受控，提交时调用 `login()`。
- 成功：toast 提示并跳转到 `location.state.from || /portal`。
- 失败：toast 提示「账号或密码错误」。
- 在登录页底部加一行小字提示：演示账号 `admin / 123456`。

### 4. 业务入口登录校验 `src/components/portal/BusinessFunctions.tsx`
- 将 `<Link to={it.to}>` 改为 `<button>`，点击时：
  - 已登录：`navigate(it.to)`。
  - 未登录：toast 提示「请先登录」，`navigate('/portal/login', { state: { from: it.to } })`。

### 5. （可选范围内）门户其他业务入口
- 仅改造业务功能区（政府侧/企业侧卡片）。门户内的"要闻动态"、"绿色制造"等内容浏览页不做登录校验。

## 技术要点

- 登录态存储 key：`portal_auth_user`。
- 头像使用 shadcn 的 `Avatar` + `AvatarFallback`，无需图片资源。
- `useAuth` 通过 `window` 自定义事件 `portal-auth-change` 在 `login/logout` 后广播，多组件同步刷新。
- 不接入后端，纯前端 mock，便于后续替换为 Lovable Cloud 真实鉴权。

## 涉及文件

- 新增：`src/mocks/auth.ts`
- 修改：`src/components/portal/PortalHeader.tsx`、`src/pages/portal/PortalLogin.tsx`、`src/components/portal/BusinessFunctions.tsx`
