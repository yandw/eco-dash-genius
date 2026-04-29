import { useSyncExternalStore } from "react";

const STORAGE_KEY = "portal_auth_user";
const EVENT = "portal-auth-change";

export interface AuthUser {
  username: string;
  displayName: string;
}

const DEFAULT_ACCOUNTS: Record<string, { password: string; displayName: string }> = {
  admin: { password: "123456", displayName: "市级管理员" },
};

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

export function login(username: string, password: string): AuthUser | null {
  const acct = DEFAULT_ACCOUNTS[username.trim()];
  if (!acct || acct.password !== password) return null;
  const user: AuthUser = { username: username.trim(), displayName: acct.displayName };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  emit();
  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  emit();
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// Cache snapshot to keep referential equality for useSyncExternalStore
let cachedRaw: string | null = null;
let cachedUser: AuthUser | null = null;
function getSnapshot(): AuthUser | null {
  const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

export function useAuth(): AuthUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
