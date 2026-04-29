import type { Habit, Weekday } from "../types/habit";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatISO(date: Date): string {
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function addDays(iso: string, delta: number): string {
  const date = parseISO(iso);
  date.setUTCDate(date.getUTCDate() + delta);
  return formatISO(date);
}

function getWeekday(iso: string): Weekday {
  return parseISO(iso).getUTCDay() as Weekday;
}

/**
 * Returns true if the habit is "scheduled" for the given date based on its
 * frequency. A scheduled date counts toward the streak; non-scheduled dates
 * are skipped (they neither break nor extend the streak).
 */
export function isScheduledOn(habit: Pick<Habit, "frequency" | "daysOfWeek" | "createdAt">, iso: string): boolean {
  switch (habit.frequency) {
    case "daily":
      return true;
    case "weekly": {
      // Scheduled once per week on the same weekday the habit was created.
      const created = habit.createdAt ? habit.createdAt.slice(0, 10) : iso;
      return getWeekday(iso) === getWeekday(created);
    }
    case "monthly": {
      // Scheduled once per month on the same day-of-month as creation.
      const createdDay = habit.createdAt
        ? parseISO(habit.createdAt.slice(0, 10)).getUTCDate()
        : parseISO(iso).getUTCDate();
      return parseISO(iso).getUTCDate() === createdDay;
    }
    case "custom": {
      const days = habit.daysOfWeek ?? [];
      return days.includes(getWeekday(iso));
    }
  }
}

/**
 * Current streak: counts consecutive *scheduled* occurrences (going backward
 * from today) that were completed. Non-scheduled days are skipped. If today
 * is scheduled and not completed, the streak is 0.
 */
export function calculateCurrentStreak(
  completionsOrHabit: string[] | Habit,
  today?: string,
  habitArg?: Pick<Habit, "frequency" | "daysOfWeek" | "createdAt">,
): number {
  // Backwards-compatible signature:
  // - calculateCurrentStreak(completions, today)            => treated as daily
  // - calculateCurrentStreak(completions, today, habitMeta) => uses frequency
  // - calculateCurrentStreak(habit, today)                  => uses habit
  let completions: string[];
  let meta: Pick<Habit, "frequency" | "daysOfWeek" | "createdAt">;
  if (Array.isArray(completionsOrHabit)) {
    completions = completionsOrHabit;
    meta = habitArg ?? { frequency: "daily", createdAt: today ?? todayISO() };
  } else {
    completions = completionsOrHabit.completions;
    meta = completionsOrHabit;
  }

  const reference = today ?? todayISO();
  const set = new Set(completions);

  // Find the most recent scheduled date on/before reference.
  let cursor = reference;
  // Safety bound: scan back up to ~2 years to find a scheduled occurrence.
  let guard = 0;
  while (!isScheduledOn(meta, cursor) && guard < 800) {
    cursor = addDays(cursor, -1);
    guard += 1;
  }

  // If the most recent scheduled day isn't completed, streak is 0.
  if (!set.has(cursor)) return 0;

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    // Move to previous scheduled occurrence.
    let prev = addDays(cursor, -1);
    let g = 0;
    while (!isScheduledOn(meta, prev) && g < 800) {
      prev = addDays(prev, -1);
      g += 1;
    }
    cursor = prev;
  }
  return streak;
}