// 当前登录用户角色 mock
// city_admin: 市级总账号（拥有新闻发布权限）
// district_admin: 区级账号
// center_staff: 中心人员
// enterprise: 企业账号
export type UserRole = "city_admin" | "district_admin" | "center_staff" | "enterprise";

const STORAGE_KEY = "mock_current_role";

const RoleProfile: Record<UserRole, { id: string; name: string; districtId?: string; entId?: string }> = {
  city_admin: { id: "u-city", name: "市级管理员" },
  district_admin: { id: "u-dist-qp", name: "青浦区管理员", districtId: "qingpu" },
  center_staff: { id: "u-center", name: "节能中心" },
  enterprise: { id: "u-ent-001", name: "宏茂微电子（上海）有限公司", entId: "ent-001" },
};

function readRole(): UserRole {
  if (typeof window === "undefined") return "city_admin";
  const v = window.localStorage.getItem(STORAGE_KEY) as UserRole | null;
  return v && v in RoleProfile ? v : "city_admin";
}

let _role: UserRole = readRole();

export const currentUser = new Proxy(
  { id: "", name: "", role: _role, districtId: undefined as string | undefined, entId: undefined as string | undefined },
  {
    get(_t, k) {
      _role = readRole();
      const p = RoleProfile[_role];
      const obj = { ...p, role: _role };
      // @ts-expect-error index
      return obj[k];
    },
  },
);

export function getCurrentRole(): UserRole {
  return readRole();
}

export function setCurrentRole(role: UserRole) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, role);
    window.dispatchEvent(new CustomEvent("role-changed", { detail: role }));
  }
}

export function isCityAdmin() {
  return getCurrentRole() === "city_admin";
}

export const RoleLabel: Record<UserRole, string> = {
  city_admin: "市级管理员",
  district_admin: "区级管理员（青浦区）",
  center_staff: "节能中心",
  enterprise: "企业用户",
};
