import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STEPS } from "@/data/catalog";

const css = readFileSync(new URL("./demo.module.css", import.meta.url), "utf8");

describe("demo.module.css", () => {
  it("has a rule for every demo class in the catalog", () => {
    const demos = STEPS.flatMap((s) => s.items).flatMap((it) => (it.demo ? [it.demo] : []));
    expect(demos).toHaveLength(350);
    const missing = demos.filter((d) => !new RegExp(`\\.${d}[\\s.:{,]`).test(css));
    expect(missing).toEqual([]);
  });

  it("defines every keyframe it uses", () => {
    const defined = new Set([...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]));
    const used = new Set<string>();
    for (const [, decl] of css.matchAll(/animation:([^;}]+)/g)) {
      for (const part of decl.split(",")) {
        const name = part.trim().split(/\s+/).find((w) => defined.has(w) || /^[a-zA-Z][\w-]*$/.test(w) && !KEYWORDS.has(w));
        if (name) used.add(name);
      }
    }
    expect([...used].filter((n) => !defined.has(n))).toEqual([]);
  });

  it("pauses off-screen demos, pseudo-elements included, over any demo's own animation rule", () => {
    expect(css).toContain(".paused *,.paused *::before,.paused *::after{animation-play-state:paused!important}");
  });

  it("never reads app tokens", () => {
    expect(css).not.toMatch(/--color-|--font-(display|sans|mono)|--radius/);
  });

  it("type, radius and density previews use only user tokens (they follow Mood)", () => {
    const rules = css.split("\n").filter((l) => /^\.(typ|rad|den)[\s{]/.test(l));
    expect(rules).toHaveLength(7);
    for (const r of rules) expect(r, r).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });
});

const KEYWORDS = new Set([
  "infinite", "linear", "ease", "ease-in", "ease-out", "ease-in-out", "both", "forwards", "alternate", "steps",
]);
