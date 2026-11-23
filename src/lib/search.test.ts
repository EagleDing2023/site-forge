import { describe, expect, it } from "vitest";
import { searchOptions } from "./search";

const names = (q: string, stepId?: string) =>
  searchOptions(q)
    .filter((h) => !stepId || h.step.id === stepId)
    .map((h) => h.item.name);

describe("searchOptions", () => {
  it('"drawer" finds Bottom drawer in the Feedback layer', () => {
    const hit = searchOptions("drawer").find((h) => h.item.name === "Bottom drawer");
    expect(hit?.step.id).toBe("feedback");
  });

  it('"serif" finds the type pairings that use serifs', () => {
    expect(names("serif", "type")).toEqual(
      expect.arrayContaining(["Instrument Serif + Inter", "Fraunces + DM Sans", "Playfair Display + Manrope"]),
    );
  });

  it("is case-insensitive and ignores surrounding spaces", () => {
    expect(names("  DRAWER ")).toEqual(names("drawer"));
  });

  it("matches the library name", () => {
    expect(searchOptions("vaul").some((h) => h.item.name === "Bottom drawer")).toBe(true);
  });

  it("returns nothing for an empty or blank query", () => {
    expect(searchOptions("")).toEqual([]);
    expect(searchOptions("   ")).toEqual([]);
  });

  it("keeps catalog order: layer by layer, then item order", () => {
    const idx = searchOptions("a").map((h) => h.stepIndex);
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
  });
});
