// import { describe, it, expect } from "vitest";
// import { validateHabitName } from "../../app/lib/validators";

// describe("validateHabitName", () => {
//   it("rejects empty string", () => {
//     const r = validateHabitName("");
//     expect(r.valid).toBe(false);
//     expect(r.error).toMatch(/required/i);
//   });

//   it("rejects whitespace-only", () => {
//     const r = validateHabitName("   ");
//     expect(r.valid).toBe(false);
//   });

//   it("accepts a normal name and trims it", () => {
//     const r = validateHabitName("  Meditate  ");
//     expect(r.valid).toBe(true);
//     expect(r.value).toBe("Meditate");
//     expect(r.error).toBeNull();
//   });

//   it("accepts exactly 60 chars", () => {
//     const r = validateHabitName("a".repeat(60));
//     expect(r.valid).toBe(true);
//   });

//   it("rejects 61 chars", () => {
//     const r = validateHabitName("a".repeat(61));
//     expect(r.valid).toBe(false);
//     expect(r.error).toMatch(/60/);
//   });

//   it("handles null/undefined input gracefully", () => {
//     // @ts-expect-error runtime defensive
//     expect(validateHabitName(undefined).valid).toBe(false);
//     // @ts-expect-error runtime defensive
//     expect(validateHabitName(null).valid).toBe(false);
//   });
// });

import { describe, it, expect } from "vitest";
import { validateHabitName } from "../../app/lib/validators";

describe("validateHabitName", () => {
  it("rejects empty string", () => {
    const r = validateHabitName("");
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/required/i);
  });

  it("rejects whitespace-only", () => {
    const r = validateHabitName("   ");
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/required/i);
  });

  it("accepts a normal name and trims it", () => {
    const r = validateHabitName("  Meditate  ");
    expect(r.valid).toBe(true);
    expect(r.value).toBe("Meditate");
    expect(r.error).toBeNull();
  });

  it("accepts exactly 60 chars", () => {
    const r = validateHabitName("a".repeat(60));
    expect(r.valid).toBe(true);
    expect(r.error).toBeNull();
  });

  it("rejects 61 chars", () => {
    const r = validateHabitName("a".repeat(61));
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/60/);
  });

  it("handles null/undefined input gracefully", () => {
    const invalidInputs = [undefined, null];

    invalidInputs.forEach((input) => {
      const r = validateHabitName(input);
      expect(r.valid).toBe(false);
    });
  });
});