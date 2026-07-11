import { Habit } from "./types";

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return todayKey(dt);
}

export function calcStreaks(dates: string[]): { current: number; longest: number; doneToday: boolean } {
  const set = new Set(dates);
  const today = todayKey();
  const doneToday = set.has(today);

  // current streak: walk backward from today (or yesterday if today not done yet)
  let current = 0;
  let cursor = doneToday ? today : addDays(today, -1);
  if (set.has(cursor)) {
    while (set.has(cursor)) {
      current += 1;
      cursor = addDays(cursor, -1);
    }
  } else {
    current = 0;
  }

  // longest streak: scan all dates sorted
  const sorted = Array.from(set).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && addDays(prev, 1) === d) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest, doneToday };
}

export function last7Days(): string[] {
  const out: string[] = [];
  const today = todayKey();
  for (let i = 6; i >= 0; i--) out.push(addDays(today, -i));
  return out;
}

export function last30Days(): string[] {
  const out: string[] = [];
  const today = todayKey();
  for (let i = 29; i >= 0; i--) out.push(addDays(today, -i));
  return out;
}

export function weekdayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return ["S", "M", "T", "W", "T", "F", "S"][dt.getDay()];
}

export function completionRate(habit: Habit, days: string[]): number {
  const set = new Set(habit.completedDates);
  const done = days.filter((d) => set.has(d)).length;
  return days.length ? done / days.length : 0;
}
