import { describe, it, expect } from "vitest";
import { getHabitSlug } from "../../app/lib/slug";

describe("getHabitSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
  });

  it("strips non-alphanumerics", () => {
    expect(getHabitSlug("Read 10 pages!!")).toBe("read-10-pages");
  });

  it("trims whitespace", () => {
    expect(getHabitSlug("   morning run   ")).toBe("morning-run");
  });

  it("collapses internal whitespace into single hyphen", () => {
    expect(getHabitSlug("go    to   gym")).toBe("go-to-gym");
  });

  it("handles empty string", () => {
    expect(getHabitSlug("")).toBe("");
  });

  it("handles unicode by stripping non-ascii", () => {
    // "café ☕ time" -> spaces become hyphens, non-ascii stripped
    expect(getHabitSlug("café ☕ time")).toBe("caf--time");
  });
});