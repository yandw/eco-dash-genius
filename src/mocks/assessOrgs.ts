import { useSyncExternalStore } from "react";

export type OrgStatus = "正常" | "关闭";
export type OrgUnitType = "区" | "集团";
export type OrgTab = "district" | "group";

export interface AssessOrg {
  id: string;
  group: string; // 区/集团 名称（列名为"集团"）
  unitType: OrgUnitType;
  status: OrgStatus;
  unitName: string; // 单位全称（去重字段）
  ownerName: string;
  ownerPhone: string;
  address: string;
  centerContact: string;
}

export const CENTER_CONTACTS = ["李雯", "陈玲凯", "蒋伊莹", "刘鑫", "贾连海", "李婕"];

let districtData: AssessOrg[] = [
  { id: "d1", group: "黄浦区", unitType: "区", status: "正常", unitName: "黄浦区商务委员会", ownerName: "葛宏彬", ownerPhone: "13801680300", address: "广东路357号1号楼西908室品牌经济科", centerContact: "李雯" },
  { id: "d2", group: "青浦区", unitType: "区", status: "正常", unitName: "青浦区经济委员会技术进步科", ownerName: "李子怡", ownerPhone: "18721662600", address: "上海市青浦区公园路100号", centerContact: "李雯" },
  { id: "d3", group: "嘉定区", unitType: "区", status: "正常", unitName: "嘉定区经济委员会", ownerName: "戴修军", ownerPhone: "13391052800", address: "嘉定区博乐南路111号技术进步科C205室", centerContact: "陈玲凯" },
  { id: "d4", group: "虹口区", unitType: "区", status: "正常", unitName: "虹口区科经委", ownerName: "刘涛", ownerPhone: "25658349", address: "虹口区飞虹路518号", centerContact: "贾连海" },
  { id: "d5", group: "长宁区", unitType: "区", status: "正常", unitName: "长宁区商务委员会", ownerName: "朱雷檬", ownerPhone: "13120587200", address: "长宁区安西路8号824室", centerContact: "李雯" },
  { id: "d6", group: "徐汇区", unitType: "区", status: "正常", unitName: "徐汇区新型工业化推进办公室", ownerName: "储琳", ownerPhone: "13900000006", address: "上海市徐汇区漕溪北路336号", centerContact: "陈玲凯" },
];

let groupData: AssessOrg[] = [
  { id: "g1", group: "华谊集团", unitType: "集团", status: "正常", unitName: "上海华谊（集团）公司", ownerName: "王婕", ownerPhone: "18917275082", address: "静安区常德路809号华谊集团大厦", centerContact: "刘鑫" },
  { id: "g2", group: "建材集团", unitType: "集团", status: "正常", unitName: "上海建材（集团）有限公司", ownerName: "姚建波", ownerPhone: "13681959200", address: "上海市闵行区莲花南路2228号开幕啦园区A幢9楼", centerContact: "陈玲凯" },
  { id: "g3", group: "高桥石化", unitType: "集团", status: "正常", unitName: "中国石化上海高桥石油化工有限公司", ownerName: "胡跃梁", ownerPhone: "13818132300", address: "浦东新区江新沙路1号", centerContact: "蒋伊莹" },
  { id: "g4", group: "上海石化", unitType: "集团", status: "正常", unitName: "中国石化上海石油化工股份有限公司", ownerName: "谢知森", ownerPhone: "18521534000", address: "金山区石化金一路48号", centerContact: "蒋伊莹" },
  { id: "g5", group: "华虹集团", unitType: "集团", status: "正常", unitName: "上海华虹（集团）有限公司", ownerName: "张纪军", ownerPhone: "13817662800", address: "浦东新区碧波路177号", centerContact: "李婕" },
];

let dSnap = districtData;
let gSnap = groupData;
const listeners = new Set<() => void>();

function emit() {
  dSnap = [...districtData];
  gSnap = [...groupData];
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useDistrictOrgs() {
  return useSyncExternalStore(subscribe, () => dSnap, () => dSnap);
}
export function useGroupOrgs() {
  return useSyncExternalStore(subscribe, () => gSnap, () => gSnap);
}

function getList(tab: OrgTab) {
  return tab === "district" ? districtData : groupData;
}

export function isUnitNameDuplicated(tab: OrgTab, unitName: string, excludeId?: string) {
  const name = unitName.trim();
  return getList(tab).some((r) => r.unitName.trim() === name && r.id !== excludeId);
}

export function addOrg(tab: OrgTab, row: Omit<AssessOrg, "id">): { ok: boolean; reason?: string } {
  if (isUnitNameDuplicated(tab, row.unitName)) return { ok: false, reason: "该单位已存在" };
  const id = `${tab[0]}${Date.now()}`;
  if (tab === "district") districtData = [...districtData, { ...row, id }];
  else groupData = [...groupData, { ...row, id }];
  emit();
  return { ok: true };
}

export function updateOrg(tab: OrgTab, id: string, patch: Partial<AssessOrg>): { ok: boolean; reason?: string } {
  if (patch.unitName && isUnitNameDuplicated(tab, patch.unitName, id)) {
    return { ok: false, reason: "该单位已存在" };
  }
  if (tab === "district") districtData = districtData.map((r) => (r.id === id ? { ...r, ...patch } : r));
  else groupData = groupData.map((r) => (r.id === id ? { ...r, ...patch } : r));
  emit();
  return { ok: true };
}

export function removeOrg(tab: OrgTab, id: string) {
  if (tab === "district") districtData = districtData.filter((r) => r.id !== id);
  else groupData = groupData.filter((r) => r.id !== id);
  emit();
}
