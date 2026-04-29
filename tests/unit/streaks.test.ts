import { describe, it, expect } from "vitest";
import { calculateCurrentStreak, isScheduledOn } from "../../app/lib/streak";
import type { Habit } from "../../app/types/habit";

const dailyHabit = (completions: string[]): Habit => ({
  id: "h1",
  userId: "u1",
  name: "Drink water",
  description: "",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions,
});

describe("calculateCurrentStreak (daily)", () => {
  it("returns 0 when today is not completed", () => {
    expect(calculateCurrentStreak(dailyHabit(["2026-04-26"]), "2026-04-28")).toBe(0);
  });

  it("returns 1 for just today", () => {
    expect(calculateCurrentStreak(dailyHabit(["2026-04-28"]), "2026-04-28")).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    const completions = ["2026-04-26", "2026-04-27", "2026-04-28"];
    expect(calculateCurrentStreak(dailyHabit(completions), "2026-04-28")).toBe(3);
  });

  it("breaks at the first gap walking backward", () => {
    const completions = ["2026-04-25", "2026-04-27", "2026-04-28"];
    expect(calculateCurrentStreak(dailyHabit(completions), "2026-04-28")).toBe(2);
  });

  it("ignores future completions", () => {
    const completions = ["2026-04-28", "2026-04-29", "2026-04-30"];
    expect(calculateCurrentStreak(dailyHabit(completions), "2026-04-28")).toBe(1);
  });

  it("returns 0 for empty completions", () => {
    expect(calculateCurrentStreak(dailyHabit([]), "2026-04-28")).toBe(0);
  });

  it("supports legacy array signature", () => {
    expect(calculateCurrentStreak(["2026-04-27", "2026-04-28"], "2026-04-28")).toBe(2);
  });
});

describe("isScheduledOn", () => {
  it("daily is always scheduled", () => {
    expect(
      isScheduledOn({ frequency: "daily", createdAt: "2026-04-01" }, "2026-04-28"),
    ).toBe(true);
  });

  it("custom respects daysOfWeek (Tue 2026-04-28)", () => {
    // 2026-04-28 is a Tuesday (weekday 2)
    expect(
      isScheduledOn(
        { frequency: "custom", daysOfWeek: [1, 3], createdAt: "2026-04-01" },
        "2026-04-28",
      ),
    ).toBe(false);
    expect(
      isScheduledOn(
        { frequency: "custom", daysOfWeek: [2], createdAt: "2026-04-01" },
        "2026-04-28",
      ),
    ).toBe(true);
  });
});

describe("calculateCurrentStreak (custom)", () => {
  it("skips non-scheduled days without breaking the streak", () => {
    // Mon/Wed/Fri schedule, completed last Fri + this Mon + this Wed
    // today Wed 2026-04-29
    const habit: Habit = {
      id: "h",
      userId: "u",
      name: "gym",
      description: "",
      frequency: "custom",
      daysOfWeek: [1, 3, 5],
      createdAt: "2026-04-01T00:00:00.000Z",
      completions: ["2026-04-24", "2026-04-27", "2026-04-29"],
    };
    expect(calculateCurrentStreak(habit, "2026-04-29")).toBe(3);
  });
});