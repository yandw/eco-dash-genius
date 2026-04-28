// 当前登录用户角色 mock
// city_admin: 市级总账号（拥有新闻发布权限）
// district_admin: 区级账号
// center_staff: 中心人员
// enterprise: 企业账号
export type UserRole = "city_admin" | "district_admin" | "center_staff" | "enterprise";

export const currentUser = {
  id: "u-001",
  name: "市级总账号",
  role: "city_admin" as UserRole,
};

export function isCityAdmin() {
  return currentUser.role === "city_admin";
}
