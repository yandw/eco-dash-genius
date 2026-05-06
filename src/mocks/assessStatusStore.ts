// 双控考核 — 区级状态 + 盖章证明 共享 store（mock）
import { useSyncExternalStore } from "react";
import { districtAssessSummary, type DistrictId } from "./assess";
import type { StampedDocFile } from "@/components/assess/StampedDocDialog";

export type AssessStatus = "待考核" | "考核中" | "已考核" | "完成考核";

export interface AssessStatusEntry {
  status: AssessStatus;
  assessTime: string | null;
  doc?: StampedDocFile;
}

const data: Record<string, AssessStatusEntry> = {};
districtAssessSummary.forEach((d) => {
  data[d.districtId] = {
    status: d.status as AssessStatus,
    assessTime: d.assessTime,
  };
});

let snapshot: Record<string, AssessStatusEntry> = { ...data };
const listeners = new Set<() => void>();

function emit() {
  snapshot = { ...data };
  listeners.forEach((l) => l());
}

export function useAssessStatusStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
    () => snapshot,
  );
}

export function getAssessEntry(id: string): AssessStatusEntry | undefined {
  return snapshot[id];
}

export function updateAssessEntry(id: DistrictId | string, patch: Partial<AssessStatusEntry>) {
  data[id] = { ...(data[id] ?? { status: "待考核", assessTime: null }), ...patch };
  emit();
}

export function submitAssess(id: DistrictId | string) {
  updateAssessEntry(id, {
    status: "完成考核",
    assessTime: new Date().toISOString().slice(0, 10),
  });
}

export function rollbackAssess(id: DistrictId | string) {
  updateAssessEntry(id, { status: "待考核", assessTime: null });
}

export function setAssessDoc(id: DistrictId | string, doc?: StampedDocFile) {
  updateAssessEntry(id, { doc });
}
