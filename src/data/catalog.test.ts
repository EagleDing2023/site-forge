import { describe, expect, it } from "vitest";
import * as original from "../../site-forge-handoff/data/catalog.js";
import * as typed from "./catalog";

describe("catalog.ts", () => {
  it("deep-equals the handoff catalog.js (no text changed)", () => {
    expect(Object.keys(typed).sort()).toEqual(Object.keys(original).sort());
    for (const key of Object.keys(original) as (keyof typeof original)[]) {
      // toStrictEqual also fails on extra or missing optional keys.
      expect(typed[key], key).toStrictEqual(original[key]);
    }
  });

  it("has 155 options across 15 layers", () => {
    expect(typed.STEPS).toHaveLength(15);
    expect(typed.STEPS.reduce((n, s) => n + s.items.length, 0)).toBe(155);
  });

  it("has unique item ids within each layer", () => {
    for (const s of typed.STEPS) {
      const ids = s.items.map((i) => i.id);
      expect(new Set(ids).size, s.id).toBe(ids.length);
    }
  });

  it("only uses known purpose ids in fit lists", () => {
    const purposes = new Set(typed.PURPOSES.map((p) => p.id));
    for (const s of typed.STEPS)
      for (const i of s.items)
        for (const f of i.fit ?? []) expect(purposes.has(f), `${s.id}/${i.id}: ${f}`).toBe(true);
  });

  it("every mood points at a real type pairing", () => {
    const types = new Set(typed.TYPES.map((t) => t.id));
    for (const m of typed.MOODS) expect(types.has(m.type), m.id).toBe(true);
  });
});
