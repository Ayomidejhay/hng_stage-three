'use client';

import { useState } from "react";
import { calculateCurrentStreak } from "../../lib/streak";
import { getHabitSlug } from "../../lib/slug";
import { todayISO } from "../../lib/storage";
import type { Habit } from "../../types/habit";

type Props = {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitCard({ habit, onToggleComplete, onEdit, onDelete }: Props) {
  const slug = getHabitSlug(habit.name);
  const today = todayISO();
  const completedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit, today);
  const [confirming, setConfirming] = useState(false);

  const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const scheduleLabel = (() => {
    switch (habit.frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "custom": {
        const days = (habit.daysOfWeek ?? []).slice().sort((a, b) => a - b);
        if (days.length === 0) return "Custom";
        if (days.length === 7) return "Every day";
        const wk = [1, 2, 3, 4, 5];
        if (days.length === 5 && wk.every((d) => days.includes(d as 1 | 2 | 3 | 4 | 5)))
          return "Weekdays";
        if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
        return days.map((d) => DAY_SHORT[d]).join(", ");
      }
    }
  })();

  return (
    <li
      data-testid={`habit-card-${slug}`}
      className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
        completedToday
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {habit.name}
          </h3>
          {completedToday && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
              Done
            </span>
          )}
        </div>
        {habit.description && (
          <p className="mt-1 text-sm text-slate-600">{habit.description}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">📅 {scheduleLabel}</p>
        <p
          data-testid={`habit-streak-${slug}`}
          className="mt-2 text-sm font-medium text-slate-700"
        >
          🔥 Current streak: {streak} day{streak === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
            completedToday
              ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {completedToday ? "Unmark today" : "Mark complete"}
        </button>
        <button
          type="button"
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Edit
        </button>
        {!confirming ? (
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirming(true)}
            className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete
          </button>
        ) : (
          <span className="flex items-center gap-2">
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => {
                setConfirming(false);
                onDelete(habit);
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </span>
        )}
      </div>
    </li>
  );
}
