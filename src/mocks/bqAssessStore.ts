import { useSyncExternalStore } from "react";
import { bqEntAssessList, type BqEntAssessRow } from "./assess";

let data: BqEntAssessRow[] = bqEntAssessList.map((r) => ({ ...r }));
let snapshot = data;
const listeners = new Set<() => void>();

function emit() {
  snapshot = [...data];
  listeners.forEach((l) => l());
}

export function useBqAssessStore() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => snapshot,
    () => snapshot,
  );
}

export function getBqEnt(id: string): BqEntAssessRow | undefined {
  return snapshot.find((r) => r.id === id);
}

export function updateBqEnt(id: string, patch: Partial<BqEntAssessRow>) {
  data = data.map((r) => (r.id === id ? { ...r, ...patch } : r));
  emit();
}

export function setBqReport(id: string, file: { name: string; url: string; uploadedAt: string }) {
  updateBqEnt(id, { reportFile: file });
}

export function rollbackBqEnt(id: string) {
  updateBqEnt(id, { status: "待考核" });
}
