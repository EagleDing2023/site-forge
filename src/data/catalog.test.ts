import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as original from "../../site-forge-handoff/data/catalog-v2.js";
import * as v1 from "../../site-forge-handoff/data/catalog.js";
import * as typed from "./catalog";

const css = readFileSync(new URL("../components/demo.module.css", import.meta.url), "utf8");

describe("catalog.ts", () => {
  it("deep-equals the handoff catalog-v2.js (no text changed)", () => {
    expect(Object.keys(typed).sort()).toEqual(Object.keys(original).sort());
    for (const key of Object.keys(original) as (keyof typeof original)[]) {
      // toStrictEqual also fails on extra or missing optional keys.
      expect(typed[key], key).toStrictEqual(original[key]);
    }
  });

  it("keeps every v1 option unchanged (saved picks and the golden test rely on it)", () => {
    for (const s1 of v1.STEPS) {
      const s2 = typed.STEPS.find((s) => s.id === s1.id)!;
      expect(s2, s1.id).toBeDefined();
      for (const it of s1.items) {
        const it2 = s2.items.find((x) => x.id === it.id);
        // v2 adds `like` to purposes; everything else must match exactly.
        if (s1.id === "purpose") expect(it2, `${s1.id}/${it.id}`).toMatchObject(it);
        else expect(it2, `${s1.id}/${it.id}`).toStrictEqual(it);
      }
    }
  });

  it("has 703 options across 19 layers", () => {
    expect(typed.STEPS).toHaveLength(19);
    expect(typed.STEPS.reduce((n, s) => n + s.items.length, 0)).toBe(703);
  });

  it("has unique item ids within each layer", () => {
    for (const s of typed.STEPS) {
      const ids = s.items.map((i) => i.id);
      expect(new Set(ids).size, s.id).toBe(ids.length);
    }
  });

  it("only uses known purpose ids in fit and like lists", () => {
    const purposes = new Set(typed.PURPOSES.map((p) => p.id));
    for (const s of typed.STEPS)
      for (const i of s.items)
        for (const f of i.fit ?? []) expect(purposes.has(f), `${s.id}/${i.id}: ${f}`).toBe(true);
    for (const p of typed.PURPOSES) for (const l of p.like) expect(purposes.has(l), `${p.id} like ${l}`).toBe(true);
  });

  it("every mood points at a real type pairing", () => {
    const types = new Set(typed.TYPES.map((t) => t.id));
    for (const m of typed.MOODS) expect(types.has(m.type), m.id).toBe(true);
  });

  it("every demo class exists in demo.module.css", () => {
    const demos = typed.STEPS.flatMap((s) => s.items).flatMap((it) => (it.demo ? [it.demo] : []));
    const missing = demos.filter((d) => !new RegExp(`\\.${d}[\\s.:{,]`).test(css));
    expect(missing).toEqual([]);
  });
});
