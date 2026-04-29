import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../app/lib/habits";
import type { Habit } from "../../app/types/habit";

const base: Habit = {
  id: "h1",
  userId: "u1",
  name: "Read",
  description: "",
  frequency: "daily",
  createdAt: "2026-04-01T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const next = toggleHabitCompletion(base, "2026-04-28");
    expect(next.completions).toContain("2026-04-28");
  });

  it("removes a completion date when the date already exists", () => {
    const h = { ...base, completions: ["2026-04-28"] };
    const next = toggleHabitCompletion(h, "2026-04-28");
    expect(next.completions).not.toContain("2026-04-28");
  });

  it("does not mutate the original habit object", () => {
    const h = { ...base, completions: ["2026-04-27"] };
    const snapshot = [...h.completions];

    toggleHabitCompletion(h, "2026-04-28");

    expect(h.completions).toEqual(snapshot);
  });

  it("does not return duplicate completion dates", () => {
    const h = {
      ...base,
      completions: ["2026-04-27", "2026-04-27"], // intentional duplicate
    };

    const next = toggleHabitCompletion(h, "2026-04-28");

    const occurrences = next.completions.filter(
      (d) => d === "2026-04-27"
    );

    expect(occurrences).toHaveLength(1);
  });
});