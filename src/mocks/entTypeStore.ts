import { useSyncExternalStore } from "react";

export type EntType = "district" | "city";
export const EntTypeLabel: Record<EntType, string> = {
  district: "区管企业",
  city: "市管企业",
};

const KEY = "ent-type";
let current: EntType = (typeof localStorage !== "undefined" && (localStorage.getItem(KEY) as EntType)) || "district";
const listeners = new Set<() => void>();

export function getEntType(): EntType {
  return current;
}

export function setEntType(t: EntType) {
  current = t;
  try { localStorage.setItem(KEY, t); } catch {}
  listeners.forEach((l) => l());
}

export function useEntType(): EntType {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => current,
    () => current,
  );
}
