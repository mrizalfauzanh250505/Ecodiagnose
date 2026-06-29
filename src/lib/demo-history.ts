import type { AnalysisResult } from "@/lib/scans.functions";

export type DemoHistoryItem = {
  id: string;
  created_at: string;
  image_url: string;
  result: AnalysisResult;
};

const KEY = "ecoscan:demo-history";
const MAX_ITEMS = 50;

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getDemoHistory(): DemoHistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addDemoHistory(item: Omit<DemoHistoryItem, "id" | "created_at">): DemoHistoryItem {
  const entry: DemoHistoryItem = {
    id: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    ...item,
  };
  if (!isBrowser()) return entry;
  const list = [entry, ...getDemoHistory()].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("demo-history:updated"));
  } catch {
    // quota exceeded — drop oldest until it fits
    let trimmed = list.slice(0, Math.floor(list.length / 2));
    while (trimmed.length > 0) {
      try {
        localStorage.setItem(KEY, JSON.stringify(trimmed));
        window.dispatchEvent(new CustomEvent("demo-history:updated"));
        break;
      } catch {
        trimmed = trimmed.slice(0, Math.floor(trimmed.length / 2));
      }
    }
  }
  return entry;
}

export function removeDemoHistory(id: string) {
  if (!isBrowser()) return;
  const list = getDemoHistory().filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("demo-history:updated"));
}

export function clearDemoHistory() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("demo-history:updated"));
}
